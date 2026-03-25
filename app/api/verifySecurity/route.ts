import User from "@/models/User";
import connectToDatabase from "@/lib/db";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectToDatabase();

  const { email, answer } = await req.json();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(
    answer.toLowerCase(),
    user.securityAnswer
  );

  if (!isMatch) {
    return NextResponse.json({ error: "Incorrect answer" }, { status: 401 });
  }

  // Generate secure reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

  await user.save();

  return NextResponse.json({ resetToken });
}