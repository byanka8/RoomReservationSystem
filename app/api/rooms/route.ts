import Room from "@/models/Room";
import connectToDatabase from "@/lib/db";
import { NextResponse } from "next/server";

function validateRoomData(name: string, capacity: unknown, location: string, description?: string) {
  if (!name || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
    return "Room name must be between 2 and 100 characters";
  }

  const capacityNumber = Number(capacity);
  if (!Number.isFinite(capacityNumber) || capacityNumber < 1 || capacityNumber > 200) {
    return "Capacity must be a number between 1 and 200";
  }

  if (!location || typeof location !== "string" || location.trim().length < 2 || location.trim().length > 200) {
    return "Location must be between 2 and 200 characters";
  }

  if (description && typeof description === "string" && description.trim().length > 500) {
    return "Description cannot exceed 500 characters";
  }

  return null;
}

export async function GET() {
  try {
    await connectToDatabase();
    const rooms = await Room.find(); // fetch all rooms
    return NextResponse.json(rooms, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { name, capacity, location, description } = await request.json();

    const validationError = validateRoomData(name, capacity, location, description);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const newRoom = new Room({ name, capacity, location, description });
    await newRoom.save();
    return NextResponse.json({ message: "Room created successfully" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
