"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function ResetPassword() {
  const params = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Reset token is missing.");
      return;
    }

    try {
      const res = await fetch("/api/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.error || "Unable to reset password.");
      }
    } catch (err: any) {
      setError(err.message || "Unable to reset password.");
    }
  };

  return (
    <AuthForm
      title="Reset password"
      subtitle="Set a new password for your account"
      footer={
        <p>
          Need a new reset link?{' '}
          <Link href="/forgotPassword" className="text-sky-600 hover:underline">
            Request again
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">New password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your new password"
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            required
          />
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Reset password
        </button>
      </form>
    </AuthForm>
  );
}