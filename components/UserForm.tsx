'use client';

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type User = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
};

type UserFormProps = {
  initialData?: Partial<User>;
};

export function UserForm({ initialData }: UserFormProps) {
  const router = useRouter();

  const isEditMode = !!initialData?._id;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setEmail(
        initialData.email !== undefined
          ? String(initialData.email)
          : ""
      );
      setPassword("");
      setRole( initialData.role || "");
      setAvatar(initialData.avatar || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditMode) {
        // UPDATE
        await axios.put(`/api/users/${initialData?._id}`, {
          name,
          email,
          password,
          role,
          avatar,
        });
      } else {
        // CREATE
        await axios.post("/api/users", {
          name,
          email,
          password,
          role,
          avatar,
        });
      }

      router.push("/users");
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {isEditMode ? "✏️ Edit User" : "👤 Create User"}
        </h1>

        {/* Name */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors duration-200"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors duration-200"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Password</label>
          <input
            type="password"
            placeholder={isEditMode ? "Leave blank to keep current" : "Create strong password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors duration-200"
          />
        </div>

        {/* Role */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors duration-200"
            required
          >
            <option value="">Select a role</option>
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Avatar */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Picture URL</label>
          <input
            type="text"
            placeholder="https://example.com/avatar.jpg"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors duration-200"
          />
        </div>

        {error && <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">{error}</div>}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
        >
          {isEditMode ? "✅ Update User" : "➕ Create User"}
        </button>
      </form>
    </div>
  );
}
