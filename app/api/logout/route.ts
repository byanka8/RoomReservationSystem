// /api/logout.ts
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { logLogout, getClientIp } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    // Get token to extract user info for logging
    const token = request.cookies.get("token")?.value;
    const ipAddress = getClientIp(request);

    let userId: string = "";
    let userEmail: string = "unknown";

    if (token) {
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        userId = decoded.id;
        // Try to get email from the request or token
        const User = (await import("@/models/User")).default;
        const connectToDatabase = (await import("@/lib/db")).default;
        await connectToDatabase();
        const user = await User.findById(decoded.id);
        if (user) {
          userEmail = user.email;
        }
      } catch (e) {
        // Silently fail if token is invalid
      }
    }

    const response = NextResponse.json({ message: "Logged out" });

    // Log logout
    if (userId && userEmail) {
      await logLogout(userId, userEmail, ipAddress);
    }

    // delete JWT cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0), // remove expiration
    });

    return response;
  } catch (error: any) {
    console.error("Logout error:", error);
    const response = NextResponse.json({ message: "Logged out" });
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });
    return response;
  }
}