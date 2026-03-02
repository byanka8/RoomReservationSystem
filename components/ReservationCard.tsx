"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Reservation = {
  _id: string;
  roomId: { _id: string; name: string; location: string };
  userId: { _id: string; name: string; email: string };
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
};

export default function ReservationCard({
  reservation,
}: {
  reservation: Reservation;
}) {
  const router = useRouter();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
//   const isOwner = user?._id === reservation.userId._id;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this reservation?")) return;

    try {
      const res = await fetch(`/api/reservations/${reservation._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete reservation");
      }

      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this reservation?")) return;

    try {
      const res = await fetch(`/api/reservations/${reservation._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to cancel reservation");
      }

      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="border p-4 rounded shadow bg-white">
      <h3 className="font-bold">Room: {reservation.roomId?.name}</h3>
      <p>
        <strong>User:</strong> {reservation.userId?.name}
      </p>
      <p>
        <strong>Date:</strong> {reservation.date}
      </p>
      <p>
        <strong>Time:</strong> {reservation.startTime} - {reservation.endTime}
      </p>
      <p>
        <strong>Status:</strong> {reservation.status}
      </p>

      <div className="mt-3 flex gap-2">
        {/* View */}
        <a
          href={`/reservations/${reservation._id}`}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          View
        </a>

        {/* Edit */}
        { (isAdmin || reservation.status !== "cancelled") && (<a
        href={`/reservations/${reservation._id}/edit`}
        className="px-2 py-1 bg-yellow-500 text-white rounded"
        >
        Edit
        </a>
        )}

        {/* Cancel (owner or admin) */}
        {reservation.status !== "cancelled" && (
          <button
            onClick={handleCancel}
            className="px-2 py-1 bg-orange-500 text-white rounded"
          >
            Cancel
          </button>
        )}

        {/* Delete (admin only) */}
        {isAdmin && (
          <button
            onClick={handleDelete}
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}