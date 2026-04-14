"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { refreshUser } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      try {
        const response = await axios.post(
          "/api/login",
          { email, password },
          { withCredentials: true }
        );

        if (response.data.status === 201) {
          await refreshUser();

          setTimeout(() => {
            const role = response.data.user.role;
            if (role === "admin") router.push("/dashboard/admin");
            else if (role === "manager") router.push("/dashboard/manager");
            else router.push("/dashboard/user");
          }, 100);
        } else {
          setError(response.data.error || "Login failed");
        }
      } catch (err: any) {
        setError(err?.response?.data?.error || err.message || "Login failed");
      }
    };

    return (
      <AuthForm
        title="Welcome back"
        subtitle="Log in to manage your rooms and reservations"
        footer={
          <p>
            New to the platform?{' '}
            <Link href="/register" className="text-sky-600 hover:underline">
              Create an account
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div />
            <Link href="/forgotPassword" className="text-sm text-sky-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Log in
          </button>
        </form>
      </AuthForm>
    );
}

