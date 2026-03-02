"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

type UserType = { _id: string; name: string };

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
};

export function ReservationForm({ initialData }: ReservationFormProps) {
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
      setError("You must be logged in");
      return;
    }

    console.log(user._id);

    const userIdToSubmit = canManage ? selectedUserId : user._id;
    if (!userIdToSubmit) {
      setError("User must be selected or logged in");
      return;
    }

    if (!roomId || !date || !startTime || !endTime) {
      setError("All fields are required");
      return;
    }

    try {
      const payload = {
        roomId,
        userId: userIdToSubmit,
        date,
        startTime,
        endTime,
        status,
      };

      if (isEditMode && initialData?._id) {
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
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? "Edit Reservation" : "Create Reservation"}
        </h1>

        {/* Room */}
        <div className="mb-4">
          <label>Room</label>
          <input
            type="text"
            value={roomName}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        {/* User dropdown for admin/manager */}
        {canManage && (
          <div className="mb-4">
            <label>Select User</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Choose User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date */}
        <div className="mb-4">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Start Time */}
        <div className="mb-4">
          <label>Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* End Time */}
        <div className="mb-4">
          <label>End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Status dropdown for admin/manager */}
        {canManage && (
          <div className="mb-4">
            <label>Status</label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "pending" | "confirmed" | "cancelled")
              }
              className="w-full border px-3 py-2 rounded"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          {isEditMode ? "Update Reservation" : "Confirm Reservation"}
        </button>
      </form>
    </div>
  );
}