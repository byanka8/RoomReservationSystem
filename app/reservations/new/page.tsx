"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { ReservationForm } from "@/components/ReservationForm";
import { useAuth } from "@/context/AuthContext";

type Room = {
  _id: string;
  name: string;
  capacity: number;
  location: string;
  description: string;
};

export default function NewReservationPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedRoomId = searchParams.get("roomId") || "";

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRooms() {
      try {
        const res = await fetch("/api/rooms");
        if (!res.ok) throw new Error("Failed to load rooms");
        const data = await res.json();
        setRooms(data);
      } catch (err: any) {
        setRoomsError(err.message || "Unable to load rooms.");
      } finally {
        setRoomsLoading(false);
      }
    }

    loadRooms();
  }, []);

  const selectedRoom = rooms.find((room) => room._id === selectedRoomId) || null;

  if (authLoading || roomsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">Please login to create a reservation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Navbar role={user.role} />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Reservations</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Create reservation</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Choose a room first, then select scheduling and booking details.</p>
          </div>
          <Link
            href="/reservations"
            className="inline-flex items-center rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Back to reservations
          </Link>
        </div>

        {roomsError && (
          <div className="mb-6 rounded-[1.75rem] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
            {roomsError}
          </div>
        )}

        {!selectedRoom ? (
          <div className="rounded-[1.75rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Choose a room</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Select a room to reserve</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Tap a room below to start the booking flow with a preselected room.</p>
            </div>

            {rooms.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600 shadow-sm">
                No rooms are available yet.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {rooms.map((room) => (
                  <div key={room._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">{room.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">{room.location}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {room.capacity} seats
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{room.description}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      <Link
                        href={`/rooms/${room._id}`}
                        className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        View room
                      </Link>
                      <button
                        type="button"
                        onClick={() => router.push(`/reservations/new?roomId=${room._id}`)}
                        className="inline-flex items-center rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
                      >
                        Choose room
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Selected room</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">{selectedRoom.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{selectedRoom.location} · {selectedRoom.capacity} seats</p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/reservations/new")}
                  className="inline-flex items-center rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Choose another room
                </button>
              </div>
              <p className="mt-6 text-sm leading-6 text-slate-600">{selectedRoom.description}</p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
              <ReservationForm />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
