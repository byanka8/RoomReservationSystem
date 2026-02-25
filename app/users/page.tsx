'use client';

import { useEffect, useState } from 'react';
import UserCard from '@/components/UserCard';
import {useRouter} from 'next/navigation';
import SearchFilter from '@/components/SearchFilter';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { set } from 'mongoose';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    async function loadUsers() {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
      setLoading(false);
      setFilteredUsers(data);
      setTotalUsers(data.length);
    }

    loadUsers();
  }, []);

  const handleFilter = async (filters: Record<string, string>) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.name) queryParams.append("name", filters.name);
      if (filters.email) queryParams.append("email", filters.email);
      if (filters.role) queryParams.append("role", filters.role);

      const res = await fetch(`/api/users?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      const filtered = Array.isArray(data) ? data : data.users || [];
      setFilteredUsers(filtered);
      setTotalUsers(filtered.length);
    } catch (error) {
      console.error("Error fetching users:", error);
      setFilteredUsers(users);
      setTotalUsers(users.length);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading users...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
              <Header user={user} onLogout={() => console.log("logout")} />
            )}
      
      <div className="max-w-7xl mx-auto px-6 py-8">
      <SearchFilter type="adminUsers" onFilter={handleFilter} total={users.length} />  
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">User Management 👥</h1>
            <p className="text-gray-600">{users.length} users in the system</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/users/new")}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
            >
              ➕ Add User
            </button>
            <button
              onClick={() => router.push("dashboard/admin")}
              className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors duration-200"
            >
              ← Back
            </button>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No users yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

