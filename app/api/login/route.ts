import User from "@/models/User";
import connectToDatabase from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    try {

        connectToDatabase();

        // checks if user is already exisitng
        const {email, password} = await request.json()
        const userExist = await User.findOne({email})


        if(!userExist) {
            return NextResponse.json({error: "Invalid username and/or password.", status: 401})
        }

        const isMatch = await bcrypt.compare(password, userExist.password);

        if(!isMatch) {
            return NextResponse.json({error: "Invalid username and/or password.", status: 401})
        }

        // Create JWT
        const token = jwt.sign(
        { id: userExist._id, role: userExist.role },
        process.env.JWT_SECRET!, // use env variable
        { expiresIn: "1h" }
        );

        // Create response
        const response = NextResponse.json({
        message: "Login successful",
        user: {
            _id: userExist._id,
            name: userExist.name,
            email: userExist.email,
            role: userExist.role,
        },
        status: 201,
        });

        // Set HTTP-only cookie
        response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60, // 1 hour
        path: "/",
        });

        return response;

    } catch(err: any) {
        return NextResponse.json({error: err.message, status: 500})
    }
}