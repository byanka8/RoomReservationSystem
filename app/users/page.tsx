'use client';

import { useEffect, useState } from 'react';
import UserCard from '@/components/UserCard';
import {useRouter} from 'next/navigation';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUsers() {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    }

    loadUsers();
  }, []);

  if (loading) return <p>Loading user accounts...</p>;

  return (
    <div>
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
          onClick={() => router.push("dashboard/admin")}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          Back
      </button>
    </div>
  );
}
