type Room = {
  id: string;
  name: string;
  capacity: number;
  location?: string;
};

type Props = {
  room: Room;
  onBook: (roomId: string) => void;
};

export default function RoomCard({ room, onBook }: Props) {
  return (
    <div className="border p-4 rounded shadow mb-4">
      <h2 className="text-xl font-bold">{room.name}</h2>
      <p>Capacity: {room.capacity}</p>
      {room.location && <p>Location: {room.location}</p>}
      <button
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => onBook(room.id)}
      >
        Book
      </button>
    </div>
  );
}
