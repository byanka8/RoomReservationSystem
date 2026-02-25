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

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading room details...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="text-center">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button onClick={() => router.push("/rooms")} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Go Back</button>
      </div>
    </div>
  );
  if (!room) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <p className="text-gray-600 text-lg">No room data found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          className="mb-6 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
          onClick={() => router.push("/rooms")}
        >
          ← Back to Rooms
        </button>
        
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-200">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-4xl font-bold text-white">{room.name}</h1>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Capacity</p>
                <p className="text-4xl font-bold text-blue-600">{room.capacity} <span className="text-lg text-gray-500">people</span></p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Location</p>
                <p className="text-xl font-bold text-green-600">{room.location}</p>
              </div>
            </div>
            
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-3 uppercase tracking-wide">Description</p>
              <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 p-4 rounded-lg">{room.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
