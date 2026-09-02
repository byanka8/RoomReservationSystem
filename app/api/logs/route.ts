import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Log from "@/models/Log";
import jwt from "jsonwebtoken";
import User from "@/models/User";

/**
 * POST /api/logs
 * Admin-only endpoint to retrieve paginated logs with filtering
 * Query params: page, limit, eventType, status, dateFrom, dateTo, userEmail
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Verify admin access
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token" },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    // Check if user exists and is admin
    const user = await User.findById(decoded.id);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      page = 1,
      limit = 50,
      eventType,
      status,
      dateFrom,
      dateTo,
      userEmail,
    } = body;

    // Build filter query
    const filter: any = {};

    if (eventType) {
      filter.eventType = eventType;
    }

    if (status) {
      filter.status = status;
    }

    if (userEmail) {
      filter.userEmail = { $regex: userEmail, $options: "i" }; // case-insensitive
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999); // Include entire day
        filter.createdAt.$lte = endDate;
      }
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit) || 50)); // Max 100 per page
    const skip = (pageNum - 1) * pageSize;

    // Query logs
    const logs = await Log.find(filter)
      .sort({ createdAt: -1 }) // Most recent first
      .skip(skip)
      .limit(pageSize)
      .lean(); // Use lean for better performance

    // Get total count for pagination
    const total = await Log.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: pageNum < Math.ceil(total / pageSize),
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error: any) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/logs
 * Get event types and status options for filtering
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Verify admin access
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token" },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    // Check if user exists and is admin
    const user = await User.findById(decoded.id);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Get distinct event types and status values
    const eventTypes = await Log.distinct("eventType");
    const statuses = await Log.distinct("status");

    return NextResponse.json({
      success: true,
      filters: {
        eventTypes: eventTypes.sort(),
        statuses: statuses.sort(),
      },
    });
  } catch (error: any) {
    console.error("Error fetching log filters:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
