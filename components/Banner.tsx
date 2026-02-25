import React from "react";

export default function Banner() {
  return (
    <div className="relative w-full h-80 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full -ml-40 -mb-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-start px-6 max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-white mb-4">Welcome to Room Reservation</h2>
        <p className="text-xl text-blue-100 max-w-2xl">
          Simplify your booking experience. Find, reserve, and manage your meeting rooms with ease.
        </p>
        <div className="mt-6 flex gap-4">
          <div className="flex items-center text-white">
            <span className="text-3xl mr-2">‣</span>
            <span>Professional Spaces</span>
          </div>
          <div className="flex items-center text-white">
            <span className="text-3xl mr-2">‣</span>
            <span>Quick Booking</span>
          </div>
          <div className="flex items-center text-white">
            <span className="text-3xl mr-2">‣</span>
            <span>Easy Management</span>
          </div>
        </div>
      </div>
    </div>
  );
}
