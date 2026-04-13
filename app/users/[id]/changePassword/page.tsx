"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";

type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
};

export default function ChangePassword() {
  // const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      if (!params?.id) {
        setError("No user ID provided");
        setLoading(false);
        return;
      }
  
      const fetchUser = async () => {
        try {
          const res = await fetch(`/api/users/${params.id}`);
          if (!res.ok) throw new Error("User not found");
          const data = await res.json();
          setUser(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUser();
    }, [params?.id]);
  
    if (loading) return <p className="p-8">Loading...</p>;
    if (error) return <p className="p-8 text-red-600">{error}</p>;
    if (!user) return <p className="p-8">No user data found</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/changePassword", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword, userId: user?._id }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
    } else {
      alert("Password changed successfully!");
      router.push("/users");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto mt-10 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Change Password</h1>
      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
        required
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
        required
      />
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
        Change Password
      </button>
    </form>
  );
}