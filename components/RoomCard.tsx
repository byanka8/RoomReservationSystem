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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{room.name}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-700">
            <span className="font-semibold w-28">📍 Location:</span>
            <span>{room.location}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <span className="font-semibold w-28">👥 Capacity:</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{room.capacity} people</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">{room.description}</p>

        {/* Edit and Delete */}
        <div className="mt-4 flex gap-2">

        <a
          href={`/rooms/${room._id}`}
          className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 text-center"
        >
          View
        </a>

        <a
          href={`/rooms/${room._id}/edit`}
          className="flex-1 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors duration-200 text-center"
        >
          Edit
        </a>

        <button
          onClick={handleDelete}
          className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200"
        >
          Delete
        </button>
      </div>
      </div>
    </div>
  );
}
