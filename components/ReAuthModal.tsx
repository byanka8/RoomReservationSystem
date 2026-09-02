"use client";

import { useState } from "react";
import { reAuthenticate } from "@/lib/reAuthenticate";
import { useAuth } from "@/context/AuthContext";

type Props = {
  onVerified: () => void; // callback for the sensitive action
};

export default function ReAuthModal({ onVerified }: Props) {
  const { user } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!user) throw new Error("User not found");
      await reAuthenticate(user._id, password);
      onVerified();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-[1.75rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40"
      >
        <div className="mb-6 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-500">Secure action</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">Verify your identity</h2>
          <p className="mt-2 text-sm text-slate-500">Please enter your current password before continuing.</p>
        </div>

        <label className="block text-sm font-medium text-slate-700 mb-2">Current password</label>
        <input
          type="password"
          placeholder="Enter your current password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          required
        />

        {error && <p className="mb-4 text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Verify
        </button>
      </form>
    </div>
  );
}
