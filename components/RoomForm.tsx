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

type RoomFormData = {
  name: string;
  capacity: number;
  location: string;
  description: string;
};

type RoomFormProps = {
  initialData?: Partial<Room>;
  onSubmit?: (data: RoomFormData, isEditMode: boolean) => Promise<void>;
  submitLabel?: string;
};

export function RoomForm({ initialData, onSubmit, submitLabel }: RoomFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(initialData?._id);

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

    if (!name.trim() || !capacity || !location.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    const capacityNumber = Number(capacity);
    if (isNaN(capacityNumber) || capacityNumber < 1 || capacityNumber > 200) {
      setError("Capacity must be a valid number between 1 and 200.");
      return;
    }

    if (name.trim().length < 2 || name.trim().length > 100) {
      setError("Room name must be between 2 and 100 characters.");
      return;
    }

    if (location.trim().length < 2 || location.trim().length > 200) {
      setError("Location must be between 2 and 200 characters.");
      return;
    }

    const payload: RoomFormData = {
      name: name.trim(),
      capacity: capacityNumber,
      location: location.trim(),
      description: description.trim(),
    };

    try {
      if (onSubmit) {
        await onSubmit(payload, isEditMode);
      } else if (isEditMode) {
        await axios.put(`/api/rooms/${initialData?._id}`, payload);
      } else {
        await axios.post("/api/rooms", payload);
      }

      router.push("/rooms");
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? "Edit Room" : "Create Room"}
        </h1>

        {/* Name */}
        <div>
          <label htmlFor="room-name" className="block text-sm font-medium text-slate-700">
            Room Name
          </label>
          <input
            id="room-name"
            type="text"
            placeholder="Boardroom A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            required
          />
        </div>

        {/* Capacity */}
        <div>
          <label htmlFor="room-capacity" className="block text-sm font-medium text-slate-700">
            Capacity
          </label>
          <input
            id="room-capacity"
            type="number"
            min={1}
            placeholder="10"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="room-location" className="block text-sm font-medium text-slate-700">
            Location
          </label>
          <input
            id="room-location"
            type="text"
            placeholder="2nd Floor, East Wing"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="room-description" className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="room-description"
            placeholder="Available with HDMI, whiteboard, and video conferencing."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            rows={4}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {submitLabel || (isEditMode ? "Update Room" : "Create Room")}
        </button>
      </form>
    </div>
  );
}