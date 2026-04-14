"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { RoomForm } from "@/components/RoomForm";
import { useAuth } from "@/context/AuthContext";

type Room = {
  _id: string;
  name: string;
  capacity: number;
  location: string;
  description: string;
};

export default function EditRoomPage() {
  const params = useParams();
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
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch room");
        }
        const data: Room = await res.json();
        setRoom(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [params?.id]);

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
          <p className="text-sm text-slate-500">Please login to edit rooms.</p>
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
          <p className="text-sm text-slate-500">Room not found.</p>
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
            <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Edit room</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Edit {room.name}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Update room details and save changes.</p>
          </div>
          <Link
            href="/rooms"
            className="inline-flex items-center rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Back to rooms
          </Link>
        </div>

        <RoomForm initialData={room} submitLabel="Save room" />
      </main>
    </div>
  );
}
