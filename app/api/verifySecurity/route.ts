import User from "@/models/User";
import connectToDatabase from "@/lib/db";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextResponse, NextRequest } from "next/server";
import { logSecurityQuestion, getClientIp, logValidationFailure } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { email, answer } = await req.json();
    const ipAddress = getClientIp(req);

    // Validate input
    if (!email || !answer) {
      await logValidationFailure(email, ipAddress, "/api/verifySecurity", "Missing email or answer");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      await logSecurityQuestion("", email, ipAddress, false);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(answer.toLowerCase(), user.securityAnswer);

    if (!isMatch) {
      await logSecurityQuestion(user._id.toString(), email, ipAddress, false);
      return NextResponse.json({ error: "Incorrect answer" }, { status: 401 });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    // Log successful security question verification
    await logSecurityQuestion(user._id.toString(), email, ipAddress, true);

    return NextResponse.json({ resetToken });
  } catch (error: any) {
    console.error("Security verification error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}