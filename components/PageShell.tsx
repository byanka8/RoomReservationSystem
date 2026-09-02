"use client";

import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import DashboardHero from "@/components/DashboardHero";

type Props = {
  children: ReactNode;
  showHero?: boolean;
};

export default function PageShell({ children, showHero = false }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-20 text-center text-slate-700">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      {user && <Navbar role={user.role} />}
      {showHero && <DashboardHero />}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
