"use client";

import React, { useState } from "react";

{/* TYPES */}
type FilterField = {
  label: string;
  name: string;
  type: "text" | "select" | "date";
  options?: string[];
};

type SearchType =
  | "adminRooms"
  | "adminUsers"
  | "userReservations"
  | "managerReservations";

type SearchFilterProps = {
  type: SearchType;
  onFilter: (filters: Record<string, string>) => void;
  total?: number;
};

{/* CONFIG */}
const searchConfigs: Record<SearchType, {
  title: string;
  description: string;
  fields: FilterField[];
}> = {
  adminRooms: {
    title: "🔍 Search & Filter Rooms",
    description: "Manage and filter all rooms",
    fields: [
      { label: "Room Name", name: "roomName", type: "text" },
      { label: "Room Type", name: "roomType", type: "select", options: ["Conference", "Meeting", "Training"] },
      { label: "Capacity", name: "capacity", type: "select", options: ["5", "10", "20", "30+"] },
      { label: "Location", name: "location", type: "select", options: ["Floor 1", "Floor 2", "Building A"] },
    ],
  },

  adminUsers: {
    title: "🔍 Search & Filter Users",
    description: "Manage system users",
    fields: [
      { label: "Name", name: "name", type: "text" },
      { label: "Email", name: "email", type: "text" },
      { label: "Role", name: "role", type: "select", options: ["user", "manager", "admin"] },
    ],
  },

  userReservations: {
    title: "🔍 My Reservations",
    description: "Filter your reservations",
    fields: [
      { label: "Room Name", name: "roomName", type: "text" },
      { label: "Date", name: "date", type: "date" },
      { label: "Status", name: "status", type: "select", options: ["Pending", "Approved", "Rejected"] },
    ],
  },

  managerReservations: {
    title: "🔍 All Reservations",
    description: "Manage reservations",
    fields: [
      { label: "User Name", name: "userName", type: "text" },
      { label: "Room", name: "room", type: "text" },
      { label: "Date", name: "date", type: "date" },
      { label: "Status", name: "status", type: "select", options: ["Pending", "Approved", "Rejected"] },
    ],
  },
};

{/* COMPONENT */}
export default function SearchFilter({
  type,
  onFilter,
  total = 0,
}: SearchFilterProps) {
  const config = searchConfigs[type];

  const initialState = config.fields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {} as Record<string, string>);

  const [filters, setFilters] = useState<Record<string, string>>(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilter = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters(initialState);
    onFilter(initialState);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {config.title}
        </h2>
        <p className="text-gray-600">{config.description}</p>
      </div>

      {/* Dynamic Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {config.fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {field.label}
            </label>

            {field.type === "text" && (
              <input
                type="text"
                name={field.name}
                value={filters[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            )}

            {field.type === "date" && (
              <input
                type="date"
                name={field.name}
                value={filters[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            )}

            {field.type === "select" && (
              <select
                name={field.name}
                value={filters[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}

        {/* Buttons */}
        <div className="flex gap-2 items-end">
          <button
            onClick={handleFilter}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Search
          </button>
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-lg font-bold text-blue-600">
          📊 Total Results: {total}
        </p>
      </div>
    </div>
  );
}