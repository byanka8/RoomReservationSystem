"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import ReAuthModal from "@/components/ReAuthModal";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter, useSearchParams } from "next/navigation";

type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
};

export default function ViewUserClient() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromProfile = searchParams.get("from") === "profile";
  const { user: authUser, loading: authLoading } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReAuth, setShowReAuth] = useState(false);
  const [method, setMethod] = useState("");

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

  const handleDelete = async () => {
    if (!user) return;
    if (!confirm(`Are you sure you want to delete "${user.name}"?`)) return;

    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete user account");
      }

      router.push("/users");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <p className="text-sm text-slate-500">Please login to view user details.</p>
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Navbar role={authUser.role} />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-500">User details</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">{user.name}</h1>
              <p className="mt-2 text-sm text-slate-500">View profile information and take actions for this account.</p>
            </div>
            {!fromProfile && (
              <button
                type="button"
                onClick={() => router.push("/users")}
                className="inline-flex items-center rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Back to user list
              </button>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-1 text-lg font-medium text-slate-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Role</p>
                <p className="mt-1 text-lg font-medium text-slate-900">{user.role}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Avatar URL</p>
                <p className="mt-1 text-lg font-medium text-slate-900 break-all">{user.avatar || "—"}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-700">Actions</p>
              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href={`/users/${user._id}/edit`}
                  className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Edit user
                </Link>
                <button
                  onClick={() => {
                    setMethod("change");
                    setShowReAuth(true);
                  }}
                  className="inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
                >
                  Change password
                </button>
                <button
                  onClick={() => {
                    setMethod("delete");
                    setShowReAuth(true);
                  }}
                  className="inline-flex w-full items-center justify-center rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
                >
                  Delete user
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showReAuth && (
        <ReAuthModal
          onVerified={() => {
            setShowReAuth(false);
            if (method === "change") {
              router.push(`/users/${user._id}/changePassword`);
            } else if (method === "delete") {
              handleDelete();
            }
          }}
        />
      )}
    </div>
  );
}
