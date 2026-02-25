'use client';

import { useEffect, useState } from 'react';
import RoomCard from '@/components/RoomCard';
import SearchFilter from '@/components/SearchFilter';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import {useRouter} from 'next/navigation';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRooms, setTotalRooms] = useState(0);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    async function loadRooms() {
      const res = await fetch('/api/rooms');
      const data = await res.json();
      setRooms(data);
      setFilteredRooms(data);
      setTotalRooms(data.length);
      setLoading(false);
    }

    loadRooms();
  }, []);

  const handleFilter = async (filters: Record<string, string>) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.roomName) queryParams.append("name", filters.roomName);
      if (filters.capacity) queryParams.append("capacity", filters.capacity);
      if (filters.location) queryParams.append("location", filters.location);

      const res = await fetch(`/api/rooms?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch rooms");

      const data = await res.json();
      const filtered = Array.isArray(data) ? data : data.rooms || [];
      setFilteredRooms(filtered);
      setTotalRooms(filtered.length);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setFilteredRooms(rooms);
      setTotalRooms(rooms.length);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading rooms...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
        <Header user={user} onLogout={() => console.log("logout")} />
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Section */}
        <SearchFilter type="adminRooms" onFilter={handleFilter} total={rooms.length} />
        {/* Room List Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">📍 Room Listings</h2>
            <p className="text-gray-600 mt-1">Showing {filteredRooms.length} of {rooms.length} available rooms</p>
          </div>
          {user && user.role === 'admin' && (
            <div className="flex gap-2">
              <button
                onClick={() => router.push("rooms/new")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md"
              >
                ➕ Add Room
              </button>
              <button
                onClick={() => router.push("dashboard/admin")}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors duration-200"
              >
                ← Back
              </button>
            </div>
          )}
        </div>

        {filteredRooms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg mb-2">No rooms found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
