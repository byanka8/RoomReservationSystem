"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import ReservationCard from "@/components/ReservationCard";
import { useAuth } from "@/context/AuthContext";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    async function loadReservations() {
      const res = await fetch("/api/reservations");
      const data = await res.json();

      if (user?.role === "admin" || user?.role === "manager") {
        setReservations(data);
      } else {
        const filtered = data.filter((r: any) => r.userId?._id === user?._id);
        setReservations(filtered);
      }

      setLoading(false);
    }

    if (user) {
      loadReservations();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">Loading reservations...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">Please login to view reservations.</p>
        </div>
      </div>
    );
  }

  const dashboardRoute =
    user.role === "admin"
      ? "/dashboard/admin"
      : user.role === "manager"
      ? "/dashboard/manager"
      : "/dashboard/user";

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Navbar role={user.role} />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Reservations</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Reservation list</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">View and manage your bookings from here.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/reservations/new"
              className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              New reservation
            </Link>
            <button
              onClick={() => router.push(dashboardRoute)}
              className="inline-flex items-center rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Back to dashboard
            </button>
          </div>
        </div>

        {reservations.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/95 p-10 text-center text-slate-600 shadow-sm">
            No reservations found.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {reservations.map((reservation) => (
              <ReservationCard key={reservation._id} reservation={reservation} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
