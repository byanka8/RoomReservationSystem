'use client';

import { useEffect, useState } from 'react';
import RoomCard from '@/components/RoomCard';
import {useRouter} from 'next/navigation';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadRooms() {
      const res = await fetch('/api/rooms');
      const data = await res.json();
      setRooms(data);
      setLoading(false);
    }

    loadRooms();
  }, []);

  if (loading) return <p>Loading rooms...</p>;

  return (
    <div>
      <h1>Available Rooms</h1>

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
          onClick={() => router.push("dashboard/admin")}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          Back
      </button>
    </div>
  );
}
