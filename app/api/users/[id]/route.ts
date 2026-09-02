import User from "@/models/User";
import connectToDatabase from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { isPasswordComplexEnough, PASSWORD_POLICY_MESSAGE } from "@/lib/passwordPolicy";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const user = await User.findById(id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const body = await request.json();

    const updateData: any = {};

    if (body.name !== undefined && body.name.trim() !== "") {
      if (body.name.trim().length < 2 || body.name.trim().length > 100) {
        return NextResponse.json({ error: "Name must be between 2 and 100 characters" }, { status: 400 });
      }
      updateData.name = body.name;
    }

    if (body.email !== undefined && body.email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email.trim())) {
        return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
      }
      updateData.email = body.email;
    }

    if (body.role !== undefined && body.role.trim() !== "") {
      if (!["user", "manager", "admin"].includes(body.role)) {
        return NextResponse.json({ error: "Role must be user, manager, or admin" }, { status: 400 });
      }
      updateData.role = body.role;
    }

    if (body.avatar !== undefined && body.avatar.trim() !== "") {
      updateData.avatar = body.avatar;
    }

    if (body.password !== undefined && body.password.trim() !== "") {
      const passwordValue = String(body.password);
      if (!isPasswordComplexEnough(passwordValue)) {
        return NextResponse.json({ error: PASSWORD_POLICY_MESSAGE }, { status: 400 });
      }

      const currentUser = await User.findById(id);
      if (currentUser && currentUser.password) {
        currentUser.passwordHistory.unshift({
          password: currentUser.password,
          changedAt: currentUser.passwordChangedAt || new Date(),
        });

        currentUser.passwordHistory = currentUser.passwordHistory.slice(0, 5);
      }

      updateData.password = await bcrypt.hash(body.password, 10);
      updateData.passwordChangedAt = new Date();
      updateData.passwordHistory = currentUser ? currentUser.passwordHistory : [];
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(updatedUser, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "User account deleted successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
