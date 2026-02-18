'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UserForm } from '@/components/UserForm';

type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
};

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) {
      setError('No user ID provided');
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${params.id}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch user');
        }
        const data: User = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params?.id]);

  if (loading) return <p className="p-8">Loading user...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!user) return <p className="p-8">User not found</p>;

  return (
    <div>
      <h1>Edit User</h1>
      <UserForm initialData={user} />
    </div>
  );
}
