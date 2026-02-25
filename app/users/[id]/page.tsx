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

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading user details...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="text-center">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button onClick={() => router.push("/users")} className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">Go Back</button>
      </div>
    </div>
  );
  if (!user) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <p className="text-gray-600 text-lg">No user data found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          className="mb-6 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
          onClick={() => router.push("/users")}
        >
          ← Back to Users
        </button>
        
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-purple-200">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-8 py-6">
            <h1 className="text-4xl font-bold text-white">{user.name}</h1>
          </div>
          
          <div className="p-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl">
                <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Email</p>
                <p className="text-lg text-gray-800">{user.email}</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Role</p>
                <p className="text-lg"><span className="capitalize inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">{user.role}</span></p>
              </div>
              
              {user.avatar && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
                  <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Profile Picture</p>
                  <p className="text-gray-700 text-sm break-all">{user.avatar}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
