"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifySecurity() {
  const params = useSearchParams();
  const email = params.get("email");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/forgotPassword", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
      .then(res => res.json())
      .then(data => setQuestion(data.question));
  }, [email]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/verifySecurity", {
        method: "POST",
        body: JSON.stringify({ email, answer }),
    });

    const data = await res.json();

    if (res.ok) {
        router.push(`/resetPassword?token=${data.resetToken}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{question}</h1>
      <input
        placeholder="Answer"
        onChange={(e) => setAnswer(e.target.value)}
      />
      <button>Verify</button>
    </form>
  );
}