"use client";

import { useAuth } from "@/context/AuthContext";

export default function TopBanner() {
  const { user, showBanner, setShowBanner } = useAuth();

  if (!user || !showBanner) return null;

  const formatDate = (date: any) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="w-full bg-yellow-100 text-yellow-800 px-4 py-2 text-sm flex justify-between items-center">
      <div className="flex gap-4">
        <p>
          <strong>Last Login:</strong> {formatDate(user.lastLoginAt)}
        </p>
        <p>
          <strong>Last Failed Login:</strong> {formatDate(user.lastFailedLoginAt)}
        </p>
      </div>
      <button
        onClick={() => setShowBanner(false)}
        className="text-yellow-800 font-bold px-2 py-1 rounded hover:bg-yellow-200"
      >
        ✕
      </button>
    </div>
  );
}