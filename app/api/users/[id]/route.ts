import User from "@/models/User";
import connectToDatabase from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

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

    // Only update these if provided and not empty
    if (body.name && body.name.trim() !== "") {
      updateData.name = body.name;
    }

    if (body.email && body.email.trim() !== "") {
      updateData.email = body.email;
    }

    if (body.role && body.role.trim() !== "") {
      updateData.role = body.role;
    }

    if (body.avatar && body.avatar.trim() !== "") {
      updateData.avatar = body.avatar;
    }

    // Only hash if password exists AND not empty
    if (body.password && body.password.trim() !== "") {
      // Get current user to maintain password history
      const currentUser = await User.findById(id);
      if (currentUser && currentUser.password) {
        currentUser.passwordHistory.unshift({
          password: currentUser.password, // old hashed password
          changedAt: currentUser.passwordChangedAt || new Date(),
        });

        // Keep only last 5 passwords
        currentUser.passwordHistory = currentUser.passwordHistory.slice(0, 5);
      }

      updateData.password = await bcrypt.hash(body.password, 10);
      updateData.passwordChangedAt = new Date(); // track change time
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
