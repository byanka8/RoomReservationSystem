'use client';

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Room = {
  _id?: string;
  name: string;
  capacity: number;
  location: string;
  description: string;
};

type RoomFormProps = {
  initialData?: Partial<Room>;
};

export function RoomForm({ initialData }: RoomFormProps) {
  const router = useRouter();

  const isEditMode = !!initialData?._id;

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setCapacity(
        initialData.capacity !== undefined
          ? String(initialData.capacity)
          : ""
      );
      setLocation(initialData.location || "");
      setDescription(initialData.description || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditMode) {
        // UPDATE
        await axios.put(`/api/rooms/${initialData?._id}`, {
          name,
          capacity: Number(capacity),
          location,
          description,
        });
      } else {
        // CREATE
        await axios.post("/api/rooms", {
          name,
          capacity: Number(capacity),
          location,
          description,
        });
      }

      router.push("/rooms");
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {isEditMode ? "✏️ Edit Room" : "🏢 Create Room"}
        </h1>

        {/* Name */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Room Name</label>
          <input
            type="text"
            placeholder="e.g., Conference Room A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-200"
            required
          />
        </div>

        {/* Capacity */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Capacity (persons)</label>
          <input
            type="number"
            placeholder="e.g., 20"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-200"
            required
          />
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Location</label>
          <input
            type="text"
            placeholder="e.g., Building A, Floor 3"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-200"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            placeholder={isEditMode ? "Update Description" : "Enter a brief description..."}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-200 resize-none h-24"
            required
          />
        </div>

        {error && <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">{error}</div>}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
        >
          {isEditMode ? "✅ Update Room" : "➕ Create Room"}
        </button>
      </form>
    </div>
  );
}