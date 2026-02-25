"use client"

import React, { useState } from "react";

type FilterState = {
  roomName: string;
  roomType: string;
  capacity: string;
  location: string;
  date: string;
};

type RoomFilterProps = {
  onFilter: (filters: FilterState) => void;
  totalRooms?: number;
};

export default function RoomFilter({ onFilter, totalRooms = 0 }: RoomFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    roomName: "",
    roomType: "",
    capacity: "",
    location: "",
    date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
  };

  const handleFilter = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    const emptyFilters: FilterState = {
      roomName: "",
      roomType: "",
      capacity: "",
      location: "",
      date: "",
    };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🔍 Search & Filter Rooms</h2>
        <p className="text-gray-600">Use the filters below to find your perfect meeting room</p>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* Room Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Room Name
          </label>
          <input
            type="text"
            name="roomName"
            value={filters.roomName}
            onChange={handleChange}
            placeholder="e.g., Conference Room A"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Room Type
          </label>
          <select
            name="roomType"
            value={filters.roomType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="">All Room Types</option>
            <option value="Conference">Conference Room</option>
            <option value="Meeting">Meeting Room</option>
            <option value="Training">Training Room</option>
          </select>
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Capacity
          </label>
          <select
            name="capacity"
            value={filters.capacity}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="">All Capacities</option>
            <option value="5">5 people</option>
            <option value="10">10 people</option>
            <option value="20">20 people</option>
            <option value="30">30+ people</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location
          </label>
          <select
            name="location"
            value={filters.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="">All Locations</option>
            <option value="Floor 1">Floor 1</option>
            <option value="Floor 2">Floor 2</option>
            <option value="Floor 3">Floor 3</option>
            <option value="Building A">Building A</option>
            <option value="Building B">Building B</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Buttons Container */}
        <div className="flex gap-2 items-end">
          <button
            onClick={handleFilter}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Search
          </button>
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors duration-200"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-900">Results Details</p>
            <p className="text-lg font-bold text-blue-600 mt-1">
              📊 Total Rooms Available: <span className="text-blue-800">{totalRooms}</span>
            </p>
          </div>
          {(filters.roomName || filters.capacity || filters.location || filters.date) && (
            <div className="text-sm text-blue-700 bg-white px-3 py-1 rounded">
              {Object.values(filters).filter(Boolean).length} filter(s) applied
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
