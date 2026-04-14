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

  // check if password is reuse
  const isReuse = await Promise.all(
  user.passwordHistory.map(async (h : any) => {
    return await bcrypt.compare(newPassword, h.password);
    })
  );

  if (isReuse.some((match) => match)) {
    return NextResponse.json({ error: "You cannot reuse your previous 5 passwords." }, { status: 403 });
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

  return NextResponse.json({ message: "Password changed successfully" });
}