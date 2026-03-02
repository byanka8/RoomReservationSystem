"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ReservationForm } from "@/components/ReservationForm";

type ReservationForForm = {
  _id: string;
  roomId: { _id: string; name: string };
  userId: { _id: string; name: string };
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
};

export default function EditReservationPage() {
  const params = useParams();
  const router = useRouter();

  const [reservation, setReservation] = useState<ReservationForForm | null>(
    null
  );
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
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch reservation");
        }
        const data = await res.json();

        // Ensure that roomId and userId are objects for the form
        const formatted: ReservationForForm = {
          _id: data._id,
          roomId:
            typeof data.roomId === "string"
              ? { _id: data.roomId, name: "" } // fallback if not populated
              : { _id: data.roomId._id, name: data.roomId.name },
          userId:
            typeof data.userId === "string"
              ? { _id: data.userId, name: "" }
              : { _id: data.userId._id, name: data.userId.name },
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          status: data.status,
        };

        setReservation(formatted);
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
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Edit Reservation</h1>
      <ReservationForm initialData={reservation} />
    </div>
  );
}