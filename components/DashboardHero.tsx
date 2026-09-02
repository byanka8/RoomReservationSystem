"use client";

import { useRouter } from "next/navigation";

export default function DashboardHero() {
  const router = useRouter();

  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15,23,42,0.65), rgba(15,23,42,0.65)), url('https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-slate-900/50" />
      <div className="relative mx-auto max-w-6xl px-6 py-20 text-center sm:px-10 lg:px-16">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">
          Welcome to the workspace
        </p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
          Room Reservation System
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-slate-200 sm:text-lg">
          Book your space easily and efficiently with a clean, responsive reservation experience.
        </p>
        <button
          type="button"
          onClick={() => router.push("/reservations")}
          className="mt-8 inline-flex rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
        >
          Reserve Now
        </button>
      </div>
    </section>
  );
}
