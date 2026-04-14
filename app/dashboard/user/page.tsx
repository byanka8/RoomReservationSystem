"use client"

import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function UserDashboard() {
  const { user, loading } = useAuth();
    
    if (loading) return <p>Loading...</p>;
    
    // role-based protection (UI level)
    if (user?.role !== "user") {
        return <p>Unauthorized</p>;
    }

    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <Navbar role={user.role} />

        <section
          className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.65), rgba(15,23,42,0.65)), url('https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-slate-900/70" />
          <div className="relative mx-auto max-w-6xl px-4 py-20 text-center text-white sm:px-6 lg:px-8">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-200">Dashboard</p>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Room Reservation System</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">
              Book your space easily and efficiently
            </p>
            <Link
              href="/reservations"
              className="mt-8 inline-flex rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
            >
              Reserve Now
            </Link>
          </div>
        </section>
      </div>
    )
}