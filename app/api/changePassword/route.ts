// /api/change-password/route.ts
import User from "@/models/User";
import connectToDatabase from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectToDatabase();

  const { currentPassword, newPassword, userId } = await req.json();

  const user = await User.findById(userId);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Re-authenticate
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
  }

  // Step 3: Update password
  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.passwordChangedAt = new Date(); // track change time
  await user.save();

  return NextResponse.json({ message: "Password changed successfully" });
}