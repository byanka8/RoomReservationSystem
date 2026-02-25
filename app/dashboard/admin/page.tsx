"use client"

import Header from "@/components/Header";
import Banner from "@/components/Banner";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {

  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>
  );
  if (!user) return <div className="flex justify-center items-center h-screen text-gray-600">Please login</div>;

  return (
    <div>
      <Header user={user} onLogout={() => console.log("logout")} />

      {/* Banner Section */}
      <Banner />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">👋 Welcome, {user.name}!</h1>
          <p className="text-gray-600 text-lg">You have admin access to manage all systems</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Rooms Card */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-t-4 border-blue-500">
            <div className="flex items-center mb-4">
              {/*<div className="text-3xl mr-3">🏢</div>*/}
              <h2 className="text-2xl font-bold text-gray-800">Rooms</h2>
            </div>
            <p className="text-gray-600 mb-6">Manage all conference rooms and facilities</p>
            <button
              onClick={() => router.push("/rooms")}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              Manage Rooms
            </button>
          </div>

          {/* Users Card */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-t-4 border-purple-500">
            <div className="flex items-center mb-4">
              {/*<div className="text-3xl mr-3">👥</div>*/}
              <h2 className="text-2xl font-bold text-gray-800">Users</h2>
            </div>
            <p className="text-gray-600 mb-6">Manage user accounts and permissions</p>
            <button
              onClick={() => router.push("/users")}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
            >
              Manage Users
            </button>
          </div>

          {/* Reservations Card */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-t-4 border-green-500">
            <div className="flex items-center mb-4">
              {/*<div className="text-3xl mr-3">📅</div>*/}
              <h2 className="text-2xl font-bold text-gray-800">Reservations</h2>
            </div>
            <p className="text-gray-600 mb-6">View and manage all room reservations</p>
            <button
              onClick={() => router.push("/reservations")}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
            >
              View Reservations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}