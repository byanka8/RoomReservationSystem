"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import RoomCard from "@/components/RoomCard";
import { useAuth } from "@/context/AuthContext";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    async function loadRooms() {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      setRooms(data);
      setLoading(false);
    }

    loadRooms();
  }, []);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">Loading rooms...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">Please login to view rooms.</p>
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
            <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Rooms</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Available rooms</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Browse rooms available for reservation and manage room details.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/rooms/new"
              className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Add room
            </Link>
            <button
              onClick={() => router.push(dashboardRoute)}
              className="inline-flex items-center rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Back to dashboard
            </button>
          </div>
        </div>

        {rooms.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/95 p-10 text-center text-slate-600 shadow-sm">
            No rooms are available yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} bookHref={`/reservations/new?roomId=${room._id}`} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
