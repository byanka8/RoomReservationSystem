"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

type UserType = { _id: string; name: string };

type ReservationFormData = {
  roomId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
};

type ReservationFormProps = {
  initialData?: {
    _id: string;
    roomId: { _id: string; name: string };
    userId: { _id: string; name: string };
    date: string;
    startTime: string;
    endTime: string;
    status: "pending" | "confirmed" | "cancelled";
  };
  onSubmit?: (data: ReservationFormData, isEditMode: boolean) => Promise<void>;
};

export function ReservationForm({ initialData, onSubmit }: ReservationFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState(""); // for display
  const [selectedUserId, setSelectedUserId] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState<"pending" | "confirmed" | "cancelled">("pending");
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!initialData?._id;
  const canManage = user?.role === "admin" || user?.role === "manager";

  // Populate room in create mode
  useEffect(() => {
    if (!isEditMode) {
      const roomIdFromUrl = searchParams.get("roomId");
      if (roomIdFromUrl) {
        setRoomId(roomIdFromUrl);
        fetch(`/api/rooms/${roomIdFromUrl}`)
          .then((res) => res.json())
          .then((data) => setRoomName(data.name || "Unknown Room"))
          .catch(() => setRoomName("Unknown Room"));
      }
    }
  }, [searchParams, isEditMode]);

  // Populate form in edit mode
  useEffect(() => {
    if (!initialData) return;

    setRoomId(initialData.roomId?._id || "");
    setRoomName(initialData.roomId?.name || "");
    setSelectedUserId(initialData.userId?._id || "");
    setDate(initialData.date.split("T")[0]);
    setStartTime(initialData.startTime.slice(0, 5));
    setEndTime(initialData.endTime.slice(0, 5));
    setStatus(initialData.status);
  }, [initialData]);

  // Fetch users if admin or manager
  useEffect(() => {
    if (canManage) {
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch(() => setUsers([]));
    }
  }, [canManage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("You must be logged in to create a reservation.");
      return;
    }

    const userIdToSubmit = canManage ? selectedUserId : user._id;
    if (!userIdToSubmit) {
      setError("User must be selected or logged in");
      return;
    }

    if (!roomId || !date || !startTime || !endTime) {
      setError("All fields are required");
      return;
    }

    const selectedDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("Reservation date cannot be in the past.");
      return;
    }

    const startMinutes = Number(startTime.slice(0, 2)) * 60 + Number(startTime.slice(3, 5));
    const endMinutes = Number(endTime.slice(0, 2)) * 60 + Number(endTime.slice(3, 5));

    if (endMinutes <= startMinutes) {
      setError("End time must be after the start time.");
      return;
    }

    const durationMinutes = endMinutes - startMinutes;
    if (durationMinutes < 30 || durationMinutes > 12 * 60) {
      setError("Reservation must be between 30 minutes and 12 hours.");
      return;
    }

    try {
      const payload: ReservationFormData = {
        roomId,
        userId: userIdToSubmit,
        date,
        startTime,
        endTime,
        status,
      };

      if (onSubmit) {
        await onSubmit(payload, isEditMode);
      } else if (isEditMode && initialData?._id) {
        await axios.put(`/api/reservations/${initialData._id}`, payload);
      } else {
        await axios.post("/api/reservations", payload);
      }

      router.push("/reservations");
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-8 shadow-lg">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            {isEditMode ? "Edit Reservation" : "New Reservation"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {isEditMode
              ? "Adjust booking details for this reservation."
              : "Select a room, date and time to confirm your booking."}
          </p>
        </div>

        {/* Room */}
        <div>
          <label htmlFor="room-name" className="block text-sm font-medium text-slate-700">
            Room
          </label>
          <input
            id="room-name"
            type="text"
            value={roomName}
            readOnly
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none"
          />
        </div>

        {/* User dropdown for admin/manager */}
        {canManage && (
          <div>
            <label htmlFor="user" className="block text-sm font-medium text-slate-700">
              User
            </label>
            <select
              id="user"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              required
            >
              <option value="">Choose user</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date */}
        <div>
          <label htmlFor="reservation-date" className="block text-sm font-medium text-slate-700">
            Date
          </label>
          <input
            id="reservation-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            required
          />
        </div>

        {/* Start Time */}
        <div>
          <label htmlFor="reservation-start" className="block text-sm font-medium text-slate-700">
            Start Time
          </label>
          <input
            id="reservation-start"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            required
          />
        </div>

        {/* End Time */}
        <div>
          <label htmlFor="reservation-end" className="block text-sm font-medium text-slate-700">
            End Time
          </label>
          <input
            id="reservation-end"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            required
          />
        </div>

        {/* Status dropdown for admin/manager */}
        {canManage && (
          <div>
            <label htmlFor="reservation-status" className="block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              id="reservation-status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "pending" | "confirmed" | "cancelled")
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {isEditMode ? "Update Reservation" : "Confirm Reservation"}
        </button>
      </form>
    </div>
  );
}