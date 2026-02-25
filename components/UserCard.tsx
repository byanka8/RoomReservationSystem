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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{user.name}</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">📧 Email:</span>
            <span className="text-gray-800">{user.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">🔒 Password:</span>
            <span className="text-gray-800">● ● ● ● ●</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">👤 Role:</span>
            <span className="capitalize bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">{user.role}</span>
          </div>
          {user.avatar && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">🖼️ Avatar:</span>
              <span className="text-gray-800 text-sm truncate">{user.avatar}</span>
            </div>
          )}
        </div>

        {/* Edit and Delete */}
        <div className="flex gap-2">
          <a
            href={`/users/${user._id}`}
            className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 text-center"
          >
            View
          </a>

          <a
            href={`/users/${user._id}/edit`}
            className="flex-1 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors duration-200 text-center"
          >
            Edit
          </a>

          <button
            onClick={handleDelete}
            className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
