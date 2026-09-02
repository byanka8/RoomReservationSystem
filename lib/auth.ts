import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectToDatabase from "./db";
import { logAccessControl, getClientIp } from "./logger";

/**
 * Verify JWT token and return user if valid
 */
export async function verifyToken(
  request: NextRequest
): Promise<{ user: any; error?: string }> {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return { user: null, error: "No token provided" };
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    await connectToDatabase();
    const user = await User.findById(decoded.id);

    if (!user) {
      return { user: null, error: "User not found" };
    }

    return { user };
  } catch (error) {
    return { user: null, error: "Invalid token" };
  }
}

/**
 * Verify user is admin with logging
 */
export async function verifyAdmin(
  request: NextRequest,
  logAction: boolean = true
): Promise<{ isAdmin: boolean; user?: any; error?: string }> {
  const { user, error } = await verifyToken(request);

  if (error || !user) {
    return { isAdmin: false, error: error || "Unauthorized" };
  }

  if (user.role !== "admin") {
    if (logAction) {
      const ipAddress = getClientIp(request);
      const endpoint = new URL(request.url).pathname;
      await logAccessControl(
        user._id.toString(),
        user.email,
        ipAddress,
        endpoint,
        false,
        "Insufficient permissions (admin required)"
      );
    }
    return {
      isAdmin: false,
      user,
      error: "Admin access required",
    };
  }

  if (logAction) {
    const ipAddress = getClientIp(request);
    const endpoint = new URL(request.url).pathname;
    await logAccessControl(
      user._id.toString(),
      user.email,
      ipAddress,
      endpoint,
      true
    );
  }

  return { isAdmin: true, user };
}

/**
 * Verify user is manager or admin with logging
 */
export async function verifyManager(
  request: NextRequest,
  logAction: boolean = true
): Promise<{ isManager: boolean; user?: any; error?: string }> {
  const { user, error } = await verifyToken(request);

  if (error || !user) {
    return { isManager: false, error: error || "Unauthorized" };
  }

  const isManager = user.role === "manager" || user.role === "admin";

  if (!isManager) {
    if (logAction) {
      const ipAddress = getClientIp(request);
      const endpoint = new URL(request.url).pathname;
      await logAccessControl(
        user._id.toString(),
        user.email,
        ipAddress,
        endpoint,
        false,
        "Insufficient permissions (manager or admin required)"
      );
    }
    return { isManager: false, user, error: "Manager access required" };
  }

  if (logAction) {
    const ipAddress = getClientIp(request);
    const endpoint = new URL(request.url).pathname;
    await logAccessControl(
      user._id.toString(),
      user.email,
      ipAddress,
      endpoint,
      true
    );
  }

  return { isManager: true, user };
}

/**
 * Verify user is authenticated with logging
 */
export async function verifyAuth(
  request: NextRequest,
  logAction: boolean = true
): Promise<{ isAuth: boolean; user?: any; error?: string }> {
  const { user, error } = await verifyToken(request);

  if (error || !user) {
    return { isAuth: false, error: error || "Unauthorized" };
  }

  if (logAction) {
    const ipAddress = getClientIp(request);
    const endpoint = new URL(request.url).pathname;
    await logAccessControl(user._id.toString(), user.email, ipAddress, endpoint, true);
  }

  return { isAuth: true, user };
}
