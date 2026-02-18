'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RoomForm } from '@/components/RoomForm';

type Room = {
  _id: string;
  name: string;
  capacity: number;
  location: string;
  description: string;
};

export default function EditRoomPage() {
  const params = useParams();
  const router = useRouter();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) {
      setError('No room ID provided');
      setLoading(false);
      return;
    }

    const fetchRoom = async () => {
      try {
        const res = await fetch(`/api/rooms/${params.id}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch room');
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

  if (loading) return <p className="p-8">Loading room...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!room) return <p className="p-8">Room not found</p>;

  return (
    <div>
      <h1>Edit Room</h1>
      <RoomForm initialData={room} />
    </div>
  );
}
