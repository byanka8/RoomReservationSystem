'use client';

import { useEffect, useState } from 'react';
import UserCard from '@/components/UserCard';
import {useRouter} from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    async function loadUsers() {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    }

    loadUsers();
  }, []);

  if (!user) return <p>Please login</p>;
  if (loading) return <p>Loading user accounts...</p>;

  return (
    <div className="p6">
      <h1>User list</h1>

      <div className="grid grid-cols-3 gap-4">
        {users.map((users) => (
          <UserCard key={users._id} user={users} />
        ))}
      </div>

      <button
          onClick={() => router.push("/users/new")}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          Add User
      </button>

      <button
          onClick={() => {
            if (user.role === "admin") {
              router.push("/dashboard/admin");
            } else if (user.role === "manager") {
              router.push("/dashboard/manager");
            } else if (user.role === "user") {
              router.push("/dashboard/user");
            } else {
              console.warn("Unknown role:", user.role);
            }
          }}
          className="px-3 py-1 bg-gray-500 text-white rounded"
      >
        Back
      </button>

    </div>
  );
}
