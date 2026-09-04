"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { isPasswordComplexEnough, PASSWORD_POLICY_MESSAGE } from "@/lib/passwordPolicy";

type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
};

export default function ChangePassword() {
  const params = useParams();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) {
      setError("No user ID provided");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${params.id}`);
        if (!res.ok) throw new Error("User not found");
        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-rose-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">No user data found.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validate new password
    if (!isPasswordComplexEnough(newPassword)) {
      setError(PASSWORD_POLICY_MESSAGE);
      return;
    }

    const res = await fetch("/api/changePassword", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword, userId: user._id }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Unable to update password.");
    } else {
      setSuccessMessage("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => router.push("/users"), 1200);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-[1.75rem] border border-slate-200 bg-white/95 p-10 shadow-2xl shadow-slate-200/40">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-500">User administration</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">Change Password</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Update the password for <span className="font-medium text-slate-900">{user.name}</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Current password</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">New password</label>
            <input
              type="password"
              placeholder="Create a new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            />
            <p className="mt-3 text-sm text-slate-500">
              {PASSWORD_POLICY_MESSAGE}
            </p>
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}
          {successMessage && <p className="text-sm text-emerald-600">{successMessage}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Save new password
          </button>
        </form>
      </div>
    </div>
  );
}
