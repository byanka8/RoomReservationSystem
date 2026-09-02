import Link from "next/link";

type Room = {
  _id: string;
  name: string;
  capacity: number;
  location: string;
  description: string;
};

type RoomCardProps = {
  room: Room;
  bookHref?: string;
};

export default function RoomCard({ room, bookHref }: RoomCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{room.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{room.location}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
          {room.capacity} seats
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">{room.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`/rooms/${room._id}`}
          className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          View
        </Link>
        {bookHref && (
          <Link
            href={bookHref}
            className="inline-flex items-center rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            Book room
          </Link>
        )}
      </div>
    </div>
  );
}
