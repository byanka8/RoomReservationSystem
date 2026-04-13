// components/rooms/UserCard.tsx
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReAuthModal from "./ReAuthModal";
import { useAuth } from "@/context/AuthContext";

type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string,
  avatar: string;
  passwordChangedAt: Date;
};

export default function UserCard({ user }: { user: User }) {

  const router = useRouter();
  const [showReAuth, setShowReAuth] = useState(false);
  const [method, setMethod] = useState("");

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
    <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
      <h3>{user.name}</h3>
      <p><strong>email:</strong> {user.email}</p>
      <p><strong>password: ● ● ● ● ●</strong></p>
      <p><strong>role: {user.role}</strong></p>
      <p><strong>avatar:</strong>{user.avatar}</p>

      {/* Edit and Delete */}
      <div className="mt-2 flex gap-2">

        <a
          href={`/users/${user._id}`}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          View
        </a>

        {/* <a
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
        </button> */}
      </div>

      {showReAuth && (
        <ReAuthModal
          onVerified={() => {
            setShowReAuth(false);
            if (method == "change")
              router.push("/changePassword")
            else if (method == "delete")
              handleDelete();
          }}
        />
      )}
    </div>
  );
}
