'use client';

import { useEffect, useState } from 'react';
import RoomCard from '@/components/RoomCard';
import {useRouter} from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    async function loadRooms() {
      const res = await fetch('/api/rooms');
      const data = await res.json();
      setRooms(data);
      setLoading(false);
    }
      loadRooms();

  }, []);

  if (!user) return <p>Please login</p>;
  if (loading) return <p>Loading rooms...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Available Rooms</h1>

      <div className="grid grid-cols-3 gap-4">
        {rooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>

      <button
          onClick={() => router.push("rooms/new")}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          Add Room
      </button>

      <button
          onClick={() => {
            if (user.role === "admin") {
              router.push("/dashboard/admin");
            } else if (user.role === "manager") {
              router.push("/dashboard/manager");
            } else if (user.role === "user") {
              router.push("/dashboard/user");
            } else {
              console.warn("Unknown role:", user.role);
            }
          }}
          className="px-3 py-1 bg-gray-500 text-white rounded"
      >
          Back
      </button>
      
    </div>
  );
}
