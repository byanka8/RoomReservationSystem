import User from "@/models/User";
import connectToDatabase from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    try {

        connectToDatabase();

        // checks if user is already exisitng
        const { name, email, password, securityQuestion, securityAnswer } = await request.json();
        const userExistence = await User.findOne({email})
        if(userExistence) {
            return NextResponse.json({error: "Please input valid credentials."})
        }

        // hash password and answer
        const hashpassword = await bcrypt.hash(password, 10)
        const hashedAnswer = await bcrypt.hash(securityAnswer.toLowerCase(), 10);

        const newUser = new User({
            name,
            email,
            password: hashpassword,
            securityQuestion,
            securityAnswer: hashedAnswer
        })
        await newUser.save()

        // Create JWT
        const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET!, // use env variable
        { expiresIn: "1h" }
        );

        // Create response
        const response = NextResponse.json({
        message: "Register successful",
        user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
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