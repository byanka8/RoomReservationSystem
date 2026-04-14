"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ReservationCard from "@/components/ReservationCard";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    async function loadReservations() {
      const res = await fetch("/api/reservations");
      const data = await res.json();

      // If admin, see all
      // If normal user, see only their reservations
      if (user?.role === "admin" || user?.role === "manager") {
      setReservations(data);
      } else {
      const filtered = data.filter((r: any) => r.userId?._id === user?._id);
      setReservations(filtered);
      }

      setLoading(false);
    }

    if (user) {
      loadReservations();
    }
  }, [user]);

  if (!user) return <p>Please login</p>;
  if (loading) return <p>Loading reservations...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reservations List</h1>

      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reservations.map((reservation) => (
            <ReservationCard
                key={reservation._id}
                reservation={reservation}
            />
           ))}
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => router.push("/rooms")}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Reserve a Room
        </button>

        <button
          onClick={() => {
            if (user.role === "admin") {
              router.push("/dashboard/admin");
            } else if (user.role === "manager") {
              router.push("/dashboard/manager");
            } else if (user.role === "user") {
              router.push("/dashboard/user");
            } else {
              console.warn("Unknown role:", user.role);
            }
          }}
          className="px-3 py-1 bg-gray-500 text-white rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
}