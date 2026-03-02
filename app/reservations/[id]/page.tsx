"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

type Reservation = {
  _id: string;
  roomId: { _id: string; name: string; location: string };
  userId: { _id: string; name: string; email: string };
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
};

export default function ViewReservationPage() {
  const params = useParams();
  const router = useRouter();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) {
      setError("No reservation ID provided");
      setLoading(false);
      return;
    }

    const fetchReservation = async () => {
      try {
        const res = await fetch(`/api/reservations/${params.id}`);
        if (!res.ok) throw new Error("Reservation not found");
        const data = await res.json();
        setReservation(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [params?.id]);

  if (loading) return <p className="p-8">Loading reservation...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!reservation) return <p className="p-8">Reservation not found</p>;

  return (
    <div className="p-8 max-w-xl mx-auto shadow rounded bg-white">
      <h1 className="text-3xl font-bold mb-4">Reservation Details</h1>

      <p>
        <strong>Room:</strong> {reservation.roomId?.name} (
        {reservation.roomId?.location})
      </p>
      <p>
        <strong>User:</strong> {reservation.userId?.name} (
        {reservation.userId?.email})
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

      <div className="mt-4 flex gap-2">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => router.back()}
        >
          Back
        </button>
        <button
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          onClick={() => router.push(`/reservations/${reservation._id}/edit`)}
        >
          Edit
        </button>
      </div>
    </div>
  );
}