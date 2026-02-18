"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
};

export default function ViewUserClient() {
  const params = useParams();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="p-8 max-w-xl mx-auto shadow rounded bg-white">
      <h1 className="text-3xl font-bold mb-4">{user.name}</h1>
      <p><strong>Email:</strong> {user.email}</p>
      {/* <p><strong>Password:</strong> {user.password}</p> */}
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Avatar:</strong> {user.avatar}</p>

      {/* Optional: Back button */}
      <button
        className="mt-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => router.push("/users")}
      >
        Go Back
      </button>
    </div>
  );
}
