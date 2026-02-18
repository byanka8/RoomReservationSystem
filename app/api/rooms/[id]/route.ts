import Room from "@/models/Room";
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

    const deletedRoom = await Room.findByIdAndDelete(id);
    if (!deletedRoom) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    return NextResponse.json({ message: "Room deleted successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
