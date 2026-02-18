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
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="big-white p-8 rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? "Edit User" : "Create User"}
        </h1>

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

        {/* Role */}
        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <input
            type="text"
            placeholder="Choose Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Avatar */}
        <div className="mb-4">
          <label className="block text-gray-700">Picture</label>
          <input
            type="text"
            placeholder="Enter Link"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {isEditMode ? "Update User" : "Create User"}
        </button>
      </form>
    </div>
  );
}