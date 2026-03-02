import dbConnect from "@/lib/db";
import Reservation from "@/models/Reservation";
import { NextResponse } from "next/server";

// Here, the second argument is the context object with params
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  const { id } = await params; // unwrap the promise

  const reservation = await Reservation.findById(id)
    .populate("roomId", "name location")
    .populate("userId", "name email");

  if (!reservation) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }

  return NextResponse.json(reservation);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  const body = await request.json();

  const updatedReservation = await Reservation.findByIdAndUpdate(id, body, {
    new: true,
  })
    .populate("roomId", "name location")
    .populate("userId", "name email");

  if (!updatedReservation) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }

  return NextResponse.json(updatedReservation);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  const reservation = await Reservation.findById(id);
  if (!reservation) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }

  await Reservation.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

export async function PATCH(
    request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect(); // connect to MongoDB

    const { id } = await params;
    const body = await request.json();

    // Only allow update on status field
    const allowedFields = ["status"];
    const updateData: any = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const reservation = await Reservation.findByIdAndUpdate(id, updateData, { new: true });

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    return NextResponse.json(reservation);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}