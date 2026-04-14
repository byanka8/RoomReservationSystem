"use client";

import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import LogsComponent from "@/components/LogsComponent";
import { useAuth } from "@/context/AuthContext";

export default function LogsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <Navbar role={user?.role || "user"} />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // role-based protection (UI level)
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <Navbar role={user?.role || "user"} />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h2>
            <p className="text-red-700">
              You do not have permission to access this page. Only administrators can view system logs.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Navbar role={user.role} />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <LogsComponent />
      </main>
    </div>
  );
}
