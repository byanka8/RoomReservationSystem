import Room from "@/models/Room";
import Reservation from "@/models/Reservation";
import connectToDatabase from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const room = await Room.findById(id);
    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    return NextResponse.json(room, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const body = await request.json();

    if (body.name !== undefined) {
      const name = String(body.name).trim();
      if (name.length < 2 || name.length > 100) {
        return NextResponse.json({ error: "Room name must be between 2 and 100 characters" }, { status: 400 });
      }
    }

    if (body.capacity !== undefined) {
      const capacityNumber = Number(body.capacity);
      if (!Number.isFinite(capacityNumber) || capacityNumber < 1 || capacityNumber > 200) {
        return NextResponse.json({ error: "Capacity must be a number between 1 and 200" }, { status: 400 });
      }
    }

    if (body.location !== undefined) {
      const location = String(body.location).trim();
      if (location.length < 2 || location.length > 200) {
        return NextResponse.json({ error: "Location must be between 2 and 200 characters" }, { status: 400 });
      }
    }

    if (body.description !== undefined && String(body.description).trim().length > 500) {
      return NextResponse.json({ error: "Description cannot exceed 500 characters" }, { status: 400 });
    }

    const updatedRoom = await Room.findByIdAndUpdate(id, body, { new: true });

    if (!updatedRoom) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    return NextResponse.json(updatedRoom, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    // Check for URL parameters to determine deletion mode
    const url = new URL(request.url);
    const forceDelete = url.searchParams.get('force') === 'true';

    // Check for existing reservations for this room
    const activeReservations = await Reservation.find({
      roomId: id,
      status: { $in: ["pending", "confirmed"] },
      date: { $gte: new Date() } // Only future reservations
    });

    if (activeReservations.length > 0 && !forceDelete) {
      return NextResponse.json({
        error: "Cannot delete room with active reservations",
        message: `This room has ${activeReservations.length} active/future reservation(s). Please cancel all reservations before deleting the room, or use force=true to cancel all reservations automatically.`,
        activeReservations: activeReservations.length,
        canForceDelete: true
      }, { status: 409 }); // Conflict status
    }

    // If force delete is requested, cancel all active reservations first
    if (forceDelete && activeReservations.length > 0) {
      await Reservation.updateMany(
        {
          roomId: id,
          status: { $in: ["pending", "confirmed"] },
          date: { $gte: new Date() }
        },
        { status: "cancelled" }
      );
    }

    // Proceed with room deletion
    const deletedRoom = await Room.findByIdAndDelete(id);
    if (!deletedRoom) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    return NextResponse.json({
      message: forceDelete && activeReservations.length > 0
        ? `Room deleted successfully. ${activeReservations.length} active reservation(s) were automatically cancelled.`
        : "Room deleted successfully",
      deletedRoom: {
        id: deletedRoom._id,
        name: deletedRoom.name
      },
      cancelledReservations: forceDelete ? activeReservations.length : 0
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
