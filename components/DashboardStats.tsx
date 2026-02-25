"use client"

import React, { useState, useEffect } from "react";

type Booking = {
  _id: string;
  roomId: string;
  userId: string;
  startDate: string;
  endDate: string;
};

type DashboardStatsProps = {
  userId?: string;
};

export default function DashboardStats({ userId }: DashboardStatsProps) {
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    pastBookings: 0,
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // Fetch reservations - adjust the API endpoint as needed
        const res = await fetch("/api/reservations");
        if (!res.ok) throw new Error("Failed to fetch bookings");

        const data = await res.json();
        const reservations = Array.isArray(data) ? data : data.reservations || [];

        // Filter bookings for current user if userId is provided
        const userBookings = userId
          ? reservations.filter((booking: Booking) => booking.userId === userId)
          : reservations;

        setBookings(userBookings);

        // Calculate stats
        const now = new Date();
        const upcoming = userBookings.filter(
          (booking: Booking) => new Date(booking.startDate) > now
        ).length;
        const past = userBookings.filter(
          (booking: Booking) => new Date(booking.endDate) <= now
        ).length;

        setStats({
          totalBookings: userBookings.length,
          upcomingBookings: upcoming,
          pastBookings: past,
        });
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Your Booking Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Bookings Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Bookings</p>
              <p className="text-4xl font-bold text-blue-600">{stats.totalBookings}</p>
            </div>
            <div className="text-5xl">📅</div>
          </div>
          <p className="text-gray-600 text-xs mt-4">All your reservations</p>
        </div>

        {/* Upcoming Bookings Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Upcoming Bookings</p>
              <p className="text-4xl font-bold text-green-600">{stats.upcomingBookings}</p>
            </div>
            <div className="text-5xl">🚀</div>
          </div>
          <p className="text-gray-600 text-xs mt-4">Scheduled for future dates</p>
        </div>

        {/* Past Bookings Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Past Bookings</p>
              <p className="text-4xl font-bold text-purple-600">{stats.pastBookings}</p>
            </div>
            <div className="text-5xl">📊</div>
          </div>
          <p className="text-gray-600 text-xs mt-4">Completed reservations</p>
        </div>
      </div>

      {/* Recent Bookings List */}
      {bookings.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Recent Bookings History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Start Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">End Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((booking, index) => {
                  const isUpcoming = new Date(booking.startDate) > new Date();
                  const status = isUpcoming ? "Upcoming" : "Completed";
                  const statusColor = isUpcoming
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800";

                  return (
                    <tr key={booking._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-700">{index + 1}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {new Date(booking.startDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {new Date(booking.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {bookings.length > 5 && (
            <p className="text-gray-600 text-sm mt-4">
              And {bookings.length - 5} more booking(s)...
            </p>
          )}
        </div>
      )}

      {bookings.length === 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-gray-600 text-lg">No bookings yet.</p>
          <p className="text-gray-500 text-sm mt-2">
            Start by booking your first room from the available options below.
          </p>
        </div>
      )}
    </div>
  );
}
