import User from "@/models/User";
import connectToDatabase from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

function validateUserData(name: string, email: string, password: string, role: string) {
  if (!name || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
    return "Name must be between 2 and 100 characters";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
    return "Please enter a valid email address";
  }

  if (!password || typeof password !== "string" || password.trim().length < 8) {
    return "Password must be at least 8 characters long";
  }

  if (!role || !["user", "manager", "admin"].includes(role)) {
    return "Role must be user, manager, or admin";
  }

  return null;
}

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find(); // fetch all users
    return NextResponse.json(users, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { name, email, password, role, avatar } = await request.json();

    const validationError = validateUserData(name, email, password, role);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashpassword,
      role,
      avatar,
    });
    await newUser.save();

    return NextResponse.json({ message: "User account created successfully" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
