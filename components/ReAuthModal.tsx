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
      onVerified(); // allow the critical action
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-xl font-bold mb-4">Verify Your Identity</h2>
        <input
          type="password"
          placeholder="Enter your current password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Verify
        </button>
      </form>
    </div>
  );
}