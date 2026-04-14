"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <Link href="/" className="text-2xl font-semibold tracking-tight text-slate-900">
            Room Reservation
          </Link>
          <p className="text-sm text-slate-500">Manage rooms, users, and bookings in one place.</p>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">
                {user.name} • {user.role}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}