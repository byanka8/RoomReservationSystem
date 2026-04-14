"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";

const isValidPassword = (password: string): boolean => {
    // Check length
    if (password.length < 8) return false;
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) return false;
    
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) return false;
    
    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
    
    return true;
};

export default function Registration() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');
    const router = useRouter()
    const { refreshUser } = useAuth(); 
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (!isValidPassword(password)) {
        setError("Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one special character.");
        return;
      }

      try {
        const response = await axios.post("/api/register", {
          name,
          email,
          password,
          securityQuestion,
          securityAnswer,
        });

        if (response.data.status === 201) {
          await refreshUser();

          setTimeout(() => {
            const role = response.data.user.role;
            if (role === "admin") router.push("/dashboard/admin");
            else if (role === "manager") router.push("/dashboard/manager");
            else router.push("/dashboard/user");
          }, 100);
        } else {
          setError(response.data.error || "Registration failed");
        }
      } catch (err: any) {
        setError(err?.response?.data?.error || err.message || "Registration failed");
      }
    };

    return (
      <AuthForm
        title="Create your account"
        subtitle="Register to access rooms, users, and reservations"
        footer={
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-sky-600 hover:underline">
              Log in
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            />
          </div>

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
              placeholder="Create a strong password"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            />
            <p className="mt-3 text-sm text-slate-500">
              Password must be at least 8 characters and include uppercase, lowercase, and a symbol.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Security question</label>
            <select
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            >
              <option value="">Select a question</option>
              <option>What is your first pet's name?</option>
              <option>What was the name of your first school?</option>
              <option>What city were you born in?</option>
              <option>What is your favorite food?</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Answer</label>
            <input
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              placeholder="Enter your answer"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            />
            <p className="mt-3 text-sm text-slate-500">Use an answer only you know.</p>
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Create account
          </button>
        </form>
      </AuthForm>
    );
}
