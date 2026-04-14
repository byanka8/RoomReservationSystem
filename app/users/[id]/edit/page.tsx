"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { UserForm } from "@/components/UserForm";
import { useAuth } from "@/context/AuthContext";
import { useParams, useSearchParams } from "next/navigation";

type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "manager" | "admin";
  avatar: string;
};

export default function EditUserPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const fromProfile = searchParams.get("from") === "profile";
  const { user: authUser, loading: authLoading } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) {
      setError("No user ID provided");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${params.id}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch user");
        }
        const data: User = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params?.id]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">Loading user information...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">Please login to edit users.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-rose-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">User not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Navbar role={authUser.role} />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Edit user</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Update {user.name}</h1>
              <p className="mt-2 text-sm text-slate-500">Change profile details and role settings for this account.</p>
            </div>
            {!fromProfile && (
            <Link
              href="/users"
              className="inline-flex items-center rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Back to users
            </Link>
          )}
          </div>
          <UserForm initialData={user} submitLabel="Save changes" />
        </div>
      </main>
    </div>
  );
}
