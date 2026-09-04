"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function VerifySecurityContent() {
  const params = useSearchParams();
  const email = params.get("email");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!email) return;

    fetch("/api/forgotPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => setQuestion(data.question || "Security question"))
      .catch(() => setQuestion("Security question"));
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Email is missing.");
      return;
    }

    try {
      const res = await fetch("/api/verifySecurity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, answer }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/resetPassword?token=${encodeURIComponent(data.resetToken)}`);
      } else {
        setError(data.error || "Verification failed");
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Verification failed");
    }
  };

  return (
    <AuthForm
      title="Verify your identity"
      subtitle="Answer your security question to continue"
      footer={
        <p>
          Want to change email?{" "}
          <Link href="/forgotPassword" className="text-sky-600 hover:underline">
            Start again
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">{question || "Security question"}</p>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer"
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            required
          />
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Verify answer
        </button>
      </form>
    </AuthForm>
  );
}
