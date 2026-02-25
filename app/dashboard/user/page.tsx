"use client"

import Header from "@/components/Header";
import Banner from "@/components/Banner";
import DashboardStats from "@/components/DashboardStats";
import SearchFilter from "@/components/SearchFilter";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";

export default function UserDashboard() {

    const { user, loading } = useAuth();
    const [totalReservations, setTotalReservations] = useState(0);
    
    if (loading) return (
      <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>
    );
    if (!user) return <div className="flex justify-center items-center h-screen text-gray-600">Please login</div>;

    const handleFilter = async (filters: Record<string, string>) => {
      try {
        // Build query string
        const queryParams = new URLSearchParams();
        if (filters.roomName) queryParams.append("name", filters.roomName);
        if (filters.capacity) queryParams.append("capacity", filters.capacity);
        if (filters.location) queryParams.append("location", filters.location);

        const res = await fetch(`/api/rooms?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch rooms");

        const data = await res.json();
        const reservations = Array.isArray(data) ? data : data.reservations || [];
        setTotalReservations(reservations.length);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setTotalReservations(0);
      }
    };

    return (
        <div>
            <Header user={user} onLogout={() => console.log("logout")} />
            
            {/* Banner Section */}
            <Banner />
            
            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Dashboard Stats Section */}
              <DashboardStats userId={user._id} />
              
              {/* Filter Section */}
              <SearchFilter type="userReservations" onFilter={handleFilter} total={totalReservations} />

              {/* Quick Actions */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">⚡ Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* My Bookings Card */}
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-t-4 border-blue-500">
                    <div className="flex items-center mb-4">
                      {/*<div className="text-3xl mr-3">📅</div>*/}
                      <h2 className="text-2xl font-bold text-gray-800">My Bookings</h2>
                    </div>
                    <p className="text-gray-600 mb-6">View and manage your room reservations</p>
                    <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200">View My Bookings</button>
                  </div>

                  {/* Book Room Card */}
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-t-4 border-green-500">
                    <div className="flex items-center mb-4">
                      {/*<div className="text-3xl mr-3">🏢</div>*/}
                      <h2 className="text-2xl font-bold text-gray-800">Browse Rooms</h2>
                    </div>
                    <p className="text-gray-600 mb-6">Browse available rooms and make a reservation</p>
                    <button className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200">View All Rooms</button>
                  </div>
                </div>
              </div>
            </div>
        </div>
    )
}