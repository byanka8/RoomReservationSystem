// components/rooms/UserCard.tsx
import { useRouter } from "next/navigation";

type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string,
  avatar: string;
};

export default function UserCard({ user }: { user: User }) {

  const router = useRouter();

  const handleDelete = async () => {
      if (!confirm(`Are you sure you want to delete "${user.name}"?`)) return;

      try {
        const res = await fetch(`/api/users/${user._id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to delete user account");
        }

        // Refresh the page or remove from state
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

        <a
          href={`/users/${user._id}/edit`}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          Edit
        </a>

        <button
          onClick={handleDelete}
          className="px-2 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
