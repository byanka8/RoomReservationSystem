import dbConnect from "@/lib/db";
import Reservation from "@/models/Reservation";
import Room from "@/models/Room";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const reservations = await Reservation.find({})
    .populate("roomId", "name location")
    .populate("userId", "name email");

  return NextResponse.json(reservations);
}

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();
  const { roomId, userId, date, startTime, endTime } = body;

  if (!roomId || !userId || !date || !startTime || !endTime) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const room = await Room.findById(roomId);
  if (!room) {
    return NextResponse.json({ error: "Invalid room" }, { status: 400 });
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: "Invalid user" }, { status: 400 });
  }

  // Check for overlapping time slots
  const conflict = await Reservation.findOne({
    roomId,
    date,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  });

  if (conflict) {
    return NextResponse.json({ error: "Time conflict" }, { status: 400 });
  }

  const reservation = await Reservation.create(body);
  return NextResponse.json(reservation);
}