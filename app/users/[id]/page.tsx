"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ReAuthModal from "@/components/ReAuthModal";

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

  const [showReAuth, setShowReAuth] = useState(false);
  const [method, setMethod] = useState("");

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

  const handleDelete = async () => {

      if (!confirm(`Are you sure you want to delete "${user.name}"?`)) return;

      try {
        const res = await fetch(`/api/users/${user._id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to delete user account");
        } else {
          alert("User deleted successfully.");
          // Refresh the page or remove from state
        }
        router.refresh();

      } catch (err: any) {
        alert(err.message);
      }
  };

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

      {/* Edit and Delete */}
      <div className="mt-2 flex gap-2">

        <a
          href={`/users/${user._id}/edit`}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          Edit
        </a>

        <button
          onClick={() => {
            setMethod("change");
            // Check if password is at least 1 day old
            // if (user.passwordChangedAt) {
            //   const changedAt = new Date(user.passwordChangedAt); // convert from string
            //   const oneDay = 24 * 60 * 60 * 1000;
            //   if (Date.now() - changedAt.getTime() < oneDay) {
            //     alert("Password must be at least 1 day old before changing.");
            //   } else {
            //     setShowReAuth(true);
            //   }
            // } else {
            //   // passwordChangedAt is null
            //   setShowReAuth(true);
            // }

            setShowReAuth(true);
          }}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          Change Password
        </button>

        <button
          onClick={() => { 
            setMethod("delete");
            setShowReAuth(true) 
          }}
          className="px-2 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>

      {showReAuth && (
        <ReAuthModal
          onVerified={() => {
            setShowReAuth(false);
            if (method == "change")
              router.push(`/users/${user._id}/changePassword`)
            else if (method == "delete")
              handleDelete();
          }}
        />
      )}
    </div>
  );
}
