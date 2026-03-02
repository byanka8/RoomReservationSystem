// components/rooms/RoomCard.tsx
import { useRouter } from "next/navigation";

type Room = {
  _id: string;
  name: string;
  capacity: number;
  location: string;
  description: string;
};

export default function RoomCard({ room }: { room: Room }) {

  const router = useRouter();

  const handleDelete = async () => {
      if (!confirm(`Are you sure you want to delete "${room.name}"?`)) return;

      try {
        const res = await fetch(`/api/rooms/${room._id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to delete room");
        }

        // Refresh the page or remove from state
        router.refresh();
      } catch (err: any) {
        alert(err.message);
      }
   };

  return (
    <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
      <h3>{room.name}</h3>
      <p><strong>Location:</strong> {room.location}</p>
      <p><strong>Capacity:</strong> {room.capacity}</p>
      <p>{room.description}</p>

      {/* Edit and Delete */}
      <div className="mt-2 flex gap-2">

        <button
          onClick={() => router.push(`/reservations/new?roomId=${room._id}`)}
          className="mt-3 px-3 py-1 bg-green-500 text-white rounded"
        >
          Reserve
        </button>

        <a
          href={`/rooms/${room._id}`}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          View
        </a>

        <a
          href={`/rooms/${room._id}/edit`}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          Edit
        </a>

        <button
          onClick={handleDelete}
          className="px-2 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
