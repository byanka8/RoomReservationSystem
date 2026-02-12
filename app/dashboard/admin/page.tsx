"use client"

import { useState } from "react";
import RoomCard from "@/components/RoomCard";

// Dummy rooms data
const dummyRooms = [
  { id: "1", name: "Room A", capacity: 10, location: "First Floor" },
  { id: "2", name: "Room B", capacity: 5 },
  { id: "3", name: "Room C", capacity: 15, location: "Second Floor" },
];

export default function UserDashboardPage() {
  const [rooms, setRooms] = useState(dummyRooms);

  const handleBook = (roomId: string) => {
    alert(`Booking room with ID: ${roomId}`);
    // Here you would call POST /api/reservations
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Available Rooms</h1>
      {rooms.map(room => (
        <RoomCard key={room.id} room={room} onBook={handleBook} />
      ))}
    </div>
  );
}