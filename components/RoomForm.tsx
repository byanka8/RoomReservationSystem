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
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="big-white p-8 rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? "Edit Room" : "Create Room"}
        </h1>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {/* Capacity */}
        <div className="mb-4">
          <label className="block text-gray-700">Capacity</label>
          <input
            type="number"
            placeholder="Enter Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-gray-700">Location</label>
          <input
            type="text"
            placeholder="Enter Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <input
            type="text"
            placeholder={
              isEditMode ? "Update Description" : "Enter Description"
            }
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {isEditMode ? "Update Room" : "Create Room"}
        </button>
      </form>
    </div>
  );
}