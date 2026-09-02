"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Log {
  _id: string;
  eventType: string;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  method?: string;
  endpoint?: string;
  status: "success" | "failure";
  message: string;
  errorDetails?: string;
  resourceType?: string;
  resourceId?: string;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface LogsResponse {
  success: boolean;
  data: Log[];
  pagination: PaginationInfo;
}

interface FiltersResponse {
  success: boolean;
  filters: {
    eventTypes: string[];
    statuses: string[];
  };
}

export default function LogsComponent() {
  const { user } = useAuth();
  const router = useRouter();

  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);

  // Filter values
  const [selectedEventType, setSelectedEventType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [userEmailFilter, setUserEmailFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard/user");
    }
  }, [user, router]);

  // Fetch filter options
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch("/api/logs");
        if (!res.ok) throw new Error("Failed to fetch filters");
        const data: FiltersResponse = await res.json();
        setEventTypes(data.filters.eventTypes);
        setStatuses(data.filters.statuses);
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };

    fetchFilters();
  }, []);

  // Fetch logs
  const fetchLogs = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        page,
        limit: pageSize,
        ...(selectedEventType && { eventType: selectedEventType }),
        ...(selectedStatus && { status: selectedStatus }),
        ...(userEmailFilter && { userEmail: userEmailFilter }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
      };

      const res = await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 403) {
          setError("You do not have permission to view logs");
          return;
        }
        throw new Error("Failed to fetch logs");
      }

      const data: LogsResponse = await res.json();
      setLogs(data.data);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch logs on filter change
  useEffect(() => {
    setCurrentPage(1);
    fetchLogs(1);
  }, [selectedEventType, selectedStatus, userEmailFilter, dateFrom, dateTo]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get badge color based on status
  const getStatusBadgeColor = (status: string): string => {
    return status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  // Get badge color based on event type
  const getEventTypeBadgeColor = (eventType: string): string => {
    if (eventType.startsWith("AUTH_")) return "bg-blue-100 text-blue-800";
    if (eventType.startsWith("VALIDATION_")) return "bg-yellow-100 text-yellow-800";
    if (eventType.includes("ACCESS")) return "bg-purple-100 text-purple-800";
    if (eventType.includes("PASSWORD")) return "bg-orange-100 text-orange-800";
    if (eventType.includes("RESOURCE")) return "bg-indigo-100 text-indigo-800";
    return "bg-gray-100 text-gray-800";
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Access Denied: Admin users only</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
        <p className="text-gray-600 mt-1">View and filter security and system events</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type
            </label>
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Event Types</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* User Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Email
            </label>
            <input
              type="email"
              value={userEmailFilter}
              onChange={(e) => setUserEmailFilter(e.target.value)}
              placeholder="Filter by email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedEventType("");
                setSelectedStatus("");
                setUserEmailFilter("");
                setDateFrom("");
                setDateTo("");
              }}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Logs Table */}
      {!loading && logs.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Event Type
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    User Email
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Endpoint
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getEventTypeBadgeColor(
                          log.eventType
                        )}`}
                      >
                        {log.eventType}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                          log.status
                        )}`}
                      >
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {log.userEmail || "-"}
                    </td>
                    <td className="px-6 py-3 text-gray-700 font-mono text-xs">
                      {log.ipAddress || "-"}
                    </td>
                    <td className="px-6 py-3 text-gray-700 font-mono text-xs">
                      {log.endpoint || "-"}
                    </td>
                    <td className="px-6 py-3 text-gray-700 max-w-xs truncate">
                      {log.message}
                    </td>
                    <td className="px-6 py-3 text-gray-700 text-xs whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Error Details (Expandable) */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <details className="cursor-pointer">
              <summary className="font-semibold text-gray-700 hover:text-gray-900">
                Show Details
              </summary>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                {logs.map((log) => (
                  <div key={log._id} className="py-2 border-b border-gray-200 last:border-b-0">
                    <div className="font-mono text-xs">
                      {log.errorDetails && (
                        <div>
                          <strong>Error:</strong> {log.errorDetails}
                        </div>
                      )}
                      {log.resourceType && (
                        <div>
                          <strong>Resource:</strong> {log.resourceType}{" "}
                          {log.resourceId && `(${log.resourceId})`}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>
      )}

      {/* No Logs Message */}
      {!loading && logs.length === 0 && !error && (
        <div className="bg-gray-50 border border-gray-200 p-8 rounded-lg text-center">
          <p className="text-gray-600">No logs found matching the current filters</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination && pagination.totalPages > 1 && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page <strong>{pagination.page}</strong> of{" "}
              <strong>{pagination.totalPages}</strong> ({pagination.total} total logs)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fetchLogs(pagination.page - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
              >
                Previous
              </button>
              <button
                onClick={() => fetchLogs(pagination.page + 1)}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
