"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { formatDatePretty, formatTimePretty } from "@/lib/formatDate";

type EntityRef<T> = T | string | null;

type Reservation = {
  _id: string;
  roomId: EntityRef<{ _id: string; name: string; location: string }>;
  userId: EntityRef<{ _id: string; name: string; email: string }>;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
};

export default function ViewReservationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) {
      setError("No reservation ID provided");
      setLoading(false);
      return;
    }

    const fetchReservation = async () => {
      try {
        const res = await fetch(`/api/reservations/${params.id}`);
        if (!res.ok) throw new Error("Reservation not found");
        const data = await res.json();
        setReservation(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [params?.id]);

  const isRegularUser = user?.role === "user";

  const handleReservationAction = async () => {
    if (!reservation) return;

    const confirmMessage = isRegularUser
      ? "Are you sure you want to cancel this reservation?"
      : "Are you sure you want to delete this reservation?";

    if (!confirm(confirmMessage)) return;

    try {
      const res = await fetch(`/api/reservations/${reservation._id}`, {
        method: isRegularUser ? "PATCH" : "DELETE",
        headers: isRegularUser ? { "Content-Type": "application/json" } : undefined,
        body: isRegularUser ? JSON.stringify({ status: "cancelled" }) : undefined,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update reservation");
      }

      router.push("/reservations");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">Loading reservation details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">Please login to view this reservation.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-rose-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">Reservation not found.</p>
        </div>
      </div>
    );
  }

  const roomName =
    typeof reservation.roomId === "string"
      ? reservation.roomId
      : reservation.roomId?.name || "Unknown room";
  const roomLocation =
    typeof reservation.roomId === "string"
      ? ""
      : reservation.roomId?.location || "Unknown location";
  const userName =
    typeof reservation.userId === "string"
      ? reservation.userId
      : reservation.userId?.name || "Unknown guest";
  const userEmail =
    typeof reservation.userId === "string"
      ? ""
      : reservation.userId?.email || "No email provided";

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Navbar role={user.role} />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Reservation details</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Booking details</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">Review this reservation and make changes as needed.</p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/reservations")}
              className="inline-flex items-center rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Back to reservations
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Room</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{roomName}</p>
              <p className="mt-1 text-sm text-slate-600">{roomLocation}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Guest</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{userName}</p>
              <p className="mt-1 text-sm text-slate-600">{userEmail}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-sm text-slate-500">Date</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{formatDatePretty(reservation.date)}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-sm text-slate-500">Time</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{formatTimePretty(reservation.startTime)} - {formatTimePretty(reservation.endTime)}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-sm text-slate-500">Status</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{reservation.status}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push(`/reservations/${reservation._id}/edit`)}
              className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Edit reservation
            </button>
            <button
              type="button"
              onClick={handleReservationAction}
              className={`inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold text-white transition ${isRegularUser ? "bg-amber-500 hover:bg-amber-600" : "bg-rose-500 hover:bg-rose-600"}`}
            >
              {isRegularUser ? "Cancel reservation" : "Delete reservation"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
