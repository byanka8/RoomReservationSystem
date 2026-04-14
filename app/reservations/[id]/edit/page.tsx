"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { ReservationForm } from "@/components/ReservationForm";
import { useAuth } from "@/context/AuthContext";

type ReservationForForm = {
  _id: string;
  roomId: { _id: string; name: string };
  userId: { _id: string; name: string };
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
};

export default function EditReservationPage() {
  const params = useParams();
  const { user, loading: authLoading } = useAuth();

  const [reservation, setReservation] = useState<ReservationForForm | null>(null);
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
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch reservation");
        }
        const data = await res.json();

        const formatted: ReservationForForm = {
          _id: data._id,
          roomId:
            typeof data.roomId === "string"
              ? { _id: data.roomId, name: "" }
              : { _id: data.roomId._id, name: data.roomId.name },
          userId:
            typeof data.userId === "string"
              ? { _id: data.userId, name: "" }
              : { _id: data.userId._id, name: data.userId.name },
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          status: data.status,
        };

        setReservation(formatted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [params?.id]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">Loading reservation...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">Please login to edit reservations.</p>
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Navbar role={user.role} />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Reservations</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Edit reservation</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Update the details for this booking.</p>
          </div>
          <Link
            href="/reservations"
            className="inline-flex items-center rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Back to reservations
          </Link>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <ReservationForm initialData={reservation} />
        </div>
      </main>
    </div>
  );
}
