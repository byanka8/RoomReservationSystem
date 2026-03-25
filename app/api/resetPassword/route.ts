import User from "@/models/User";
import connectToDatabase from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectToDatabase();

  const { token, newPassword } = await req.json();

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  user.password = hashed;

  // Clear token after use
  user.resetToken = null;
  user.resetTokenExpiry = null;

  await user.save();

  return NextResponse.json({ message: "Password reset successful" });
}