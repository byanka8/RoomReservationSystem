"use client";

import Link from "next/link";
import { formatDatePretty, formatTimePretty } from "@/lib/formatDate";

type Reservation = {
  _id: string;
  roomId: { _id: string; name: string; location: string };
  userId: { _id: string; name: string; email: string };
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
};

export default function ReservationCard({
  reservation,
}: {
  reservation: Reservation;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{reservation.roomId?.name}</h3>
          <p className="mt-1 text-sm text-slate-500">Booked by {reservation.userId?.name}</p>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            reservation.status === "confirmed"
              ? "bg-emerald-100 text-emerald-700"
              : reservation.status === "pending"
              ? "bg-amber-100 text-amber-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {reservation.status}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600">
        <p>
          <span className="font-medium text-slate-800">Date:</span> {formatDatePretty(reservation.date)}
        </p>
        <p>
          <span className="font-medium text-slate-800">Time:</span> {formatTimePretty(reservation.startTime)} - {formatTimePretty(reservation.endTime)}
        </p>
        <p>
          <span className="font-medium text-slate-800">Location:</span> {reservation.roomId?.location}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`/reservations/${reservation._id}`}
          className="inline-flex items-center rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          View
        </Link>
      </div>
    </div>
  );
}