import User from "@/models/User";
import connectToDatabase from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectToDatabase();

  const { email } = await req.json();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    question: user.securityQuestion,
  });
}