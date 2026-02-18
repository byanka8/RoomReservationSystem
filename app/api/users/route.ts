import User from "@/models/User";
import connectToDatabase from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

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

    // hash password
    const hashpassword = await bcrypt.hash(password, 10)

    const newUser = new User({
        name,
        email,
        password: hashpassword,
        role,
        avatar
    })
    await newUser.save()

    return NextResponse.json({ message: "User account created successfully" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
