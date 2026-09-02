import dbConnect from "@/lib/db";
import Reservation from "@/models/Reservation";
import Room from "@/models/Room";
import User from "@/models/User";
import { NextResponse } from "next/server";

function timeToMinutes(value: string): number | null {
  if (typeof value !== "string") return null;

  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(value.trim());
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours * 60 + minutes;
}

function validateReservationRange(date: string, startTime: string, endTime: string) {
  if (!date || !startTime || !endTime) {
    return "Missing fields";
  }

  const selectedDate = new Date(`${date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(selectedDate.getTime()) || selectedDate < today) {
    return "Reservation date cannot be in the past";
  }

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  if (startMinutes === null || endMinutes === null) {
    return "Start and end times must be valid HH:MM values";
  }

  if (endMinutes <= startMinutes) {
    return "End time must be after start time";
  }

  const durationMinutes = endMinutes - startMinutes;
  if (durationMinutes < 30) {
    return "Reservation must be at least 30 minutes";
  }

  if (durationMinutes > 12 * 60) {
    return "Reservation cannot exceed 12 hours";
  }

  return null;
}

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

  const rangeError = validateReservationRange(date, startTime, endTime);
  if (rangeError) {
    return NextResponse.json({ error: rangeError }, { status: 400 });
  }

  if (!roomId || !userId) {
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