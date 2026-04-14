"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

type Room = {
  _id: string;
  name: string;
  capacity: number;
  location: string;
  description: string;
};

export default function ViewRoomClient() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) {
      setError("No room ID provided");
      setLoading(false);
      return;
    }

    const fetchRoom = async () => {
      try {
        const res = await fetch(`/api/rooms/${params.id}`);
        if (!res.ok) throw new Error("Room not found");
        const data = await res.json();
        setRoom(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [params?.id]);

  const handleDelete = async () => {
    if (!room) return;
    if (!confirm(`Are you sure you want to delete "${room.name}"?`)) return;

    try {
      const res = await fetch(`/api/rooms/${room._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete room");
      }

      router.push("/rooms");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">Please login to view this room.</p>
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

  if (!room) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">No room data found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Navbar role={user.role} />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Room details</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">{room.name}</h1>
              <p className="mt-2 text-sm text-slate-500">Review room information and manage this listing.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/rooms"
                className="inline-flex items-center rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Back to rooms
              </Link>
              <Link
                href={`/reservations/new?roomId=${room._id}`}
                className="inline-flex items-center rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
              >
                Book room
              </Link>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Capacity</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{room.capacity}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Location</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{room.location}</p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-500">Description</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{room.description}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push(`/rooms/${room._id}/edit`)}
              className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Edit room
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              Delete room
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
