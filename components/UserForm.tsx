"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type User = {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: "user" | "manager" | "admin";
  avatar: string;
};

type UserFormData = {
  name: string;
  email: string;
  password: string;
  role: "user" | "manager" | "admin";
  avatar: string;
};

type UserFormProps = {
  initialData?: Partial<User>;
  onSubmit?: (data: UserFormData, isEditMode: boolean) => Promise<void>;
  submitLabel?: string;
};

export function UserForm({ initialData, onSubmit, submitLabel }: UserFormProps) {
  const router = useRouter();

  const isEditMode = Boolean(initialData?._id);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<User["role"]>("user");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setEmail(initialData.email || "");
      setPassword("");
      setRole(initialData.role || "user");
      setAvatar(initialData.avatar || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !role.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    if (name.trim().length < 2 || name.trim().length > 100) {
      setError("Name must be between 2 and 100 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isEditMode && !password) {
      setError("Password is required when creating a new user.");
      return;
    }

    if (password && password.trim().length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const payload: UserFormData = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role,
      avatar: avatar.trim(),
    };

    try {
      if (onSubmit) {
        await onSubmit(payload, isEditMode);
      } else {
        if (isEditMode) {
          await axios.put(`/api/users/${initialData?._id}`, payload);
        } else {
          await axios.post("/api/users", payload);
        }
      }

      router.push("/users");
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-8 shadow-lg">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            {isEditMode ? "Edit User" : "Create User"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {isEditMode
              ? "Update user details and role information. Leave password blank to keep the current password."
              : "Create a new user account with a secure role and optional avatar."}
          </p>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {/* Eamil */}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-700">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as User["role"])}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            required
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label htmlFor="avatar" className="block text-sm font-medium text-slate-700">
            Avatar URL
          </label>
          <input
            id="avatar"
            type="text"
            placeholder="https://example.com/avatar.jpg"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {submitLabel || (isEditMode ? "Update User" : "Create User")}
        </button>
      </form>
    </div>
  );
}