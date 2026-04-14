"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type NavLink = {
  label: string;
  href: string;
};

type Props = {
  role: "user" | "manager" | "admin";
};

const baseLinks: Record<Props["role"], NavLink[]> = {
  user: [
    { label: "Dashboard", href: "/dashboard/user" },
    { label: "My Bookings", href: "/reservations" },
    { label: "Book Room", href: "/reservations/new" },
  ],
  manager: [
    { label: "Dashboard", href: "/dashboard/manager" },
    { label: "All Reservations", href: "/reservations" },
    { label: "Rooms", href: "/rooms" },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard/admin" },
    { label: "Manage Users", href: "/users" },
    { label: "Manage Rooms", href: "/rooms" },
    { label: "Reservations", href: "/reservations" },
    { label: "System Logs", href: "/dashboard/admin/logs" },
  ],
};

export default function Navbar({ role }: Props) {
  const pathname = usePathname();
  const { user } = useAuth();

  const profileLink: NavLink | null = user
    ? { label: "Profile", href: `/users/${user._id}?from=profile` }
    : null;

  const links = [...(baseLinks[role] || []), ...(profileLink ? [profileLink] : [])];

  return (
    <nav className="border-t border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
      <div className="mx-auto flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-slate-700 sm:justify-start">
        {links.map((link) => {
          const hrefPath = link.href.split("?")[0];
          const isActive = pathname === hrefPath || pathname?.startsWith(`${hrefPath}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 transition ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}