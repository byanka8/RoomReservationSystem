// /api/change-password/route.ts
import User from "@/models/User";
import connectToDatabase from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse, NextRequest } from "next/server";
import { logPasswordChange, getClientIp, logValidationFailure } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { currentPassword, newPassword, userId } = await req.json();
    const ipAddress = getClientIp(req);

    // Validate input
    if (!currentPassword || !newPassword || !userId) {
      await logValidationFailure("unknown", ipAddress, "/api/changePassword", "Missing required fields", userId);
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await User.findById(userId);

    if (!user) {
      await logPasswordChange(userId, "unknown", ipAddress, false, "User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check password age - must be at least 1 day old
    if (user.passwordChangedAt) {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours in milliseconds
      if (user.passwordChangedAt > oneDayAgo) {
        const timeRemaining = Math.ceil((user.passwordChangedAt.getTime() - oneDayAgo.getTime()) / (60 * 60 * 1000)); // hours remaining
        await logPasswordChange(userId, user.email, ipAddress, false, "Password change too soon - must wait 24 hours");
        return NextResponse.json(
          { error: `Password was changed recently. You must wait ${timeRemaining} more hour(s) before changing it again.` },
          { status: 429 }
        );
      }
    }

    // Re-authenticate
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      await logPasswordChange(userId, user.email, ipAddress, false, "Incorrect current password");
      return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
    }

    // check if password is reuse
    const isReuse = await Promise.all(
      user.passwordHistory.map(async (h : any) => {
        return await bcrypt.compare(newPassword, h.password);
      })
    );

    if (isReuse.some((match) => match)) {
      await logPasswordChange(userId, user.email, ipAddress, false, "Password reuse detected");
      return NextResponse.json(
        { error: "You cannot reuse your previous 5 passwords." },
        { status: 403 }
      );
    }

    // hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // Add current password to history before overwriting
    if (user.password) {
      user.passwordHistory.unshift({
        password: user.password, // old hashed password
        changedAt: user.passwordChangedAt || new Date(),
      });

      // Keep only last 5 passwords
      user.passwordHistory = user.passwordHistory.slice(0, 5);
    }

    // Update current password
    user.password = hashed;
    user.passwordChangedAt = new Date(); // track change time
    await user.save();

    // Log successful password change
    await logPasswordChange(userId, user.email, ipAddress, true);

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error: any) {
    console.error("Password change error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}