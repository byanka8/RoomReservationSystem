import Link from "next/link";

type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
};

export default function UserCard({ user }: { user: User }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 overflow-hidden rounded-full bg-slate-100">
          {user.avatar ? (
            <img src={user.avatar} alt={`${user.name} avatar`} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-500">U</div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p>
          <span className="font-medium text-slate-800">Role:</span> {user.role}
        </p>
        <p>
          <span className="font-medium text-slate-800">Password:</span> ••••••••
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`/users/${user._id}`}
          className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          View
        </Link>
      </div>
    </div>
  );
}
