"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

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

  if (loading) return <p className="p-8">Loading...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!room) return <p className="p-8">No room data found</p>;

  return (
    <div className="p-8 max-w-xl mx-auto shadow rounded bg-white">
      <h1 className="text-3xl font-bold mb-4">{room.name}</h1>
      <p><strong>Capacity:</strong> {room.capacity}</p>
      <p><strong>Location:</strong> {room.location}</p>
      <p><strong>Description:</strong> {room.description}</p>

      {/* Optional: Back button */}
      <button
        className="mt-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => router.push("/rooms")}
      >
        Go Back
      </button>
    </div>
  );
}
