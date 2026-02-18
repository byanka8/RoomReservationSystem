import Room from "@/models/Room";
import connectToDatabase from "@/lib/db";
import { NextResponse } from "next/server";

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
    const newRoom = new Room({ name, capacity, location, description });
    await newRoom.save();
    return NextResponse.json({ message: "Room created successfully" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
