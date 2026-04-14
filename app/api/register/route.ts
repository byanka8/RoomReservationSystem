import User from "@/models/User";
import connectToDatabase from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { logRegistration, getClientIp, logValidationFailure } from "@/lib/logger";

export async function POST(request: Request) {
    try {

        connectToDatabase();

        // Get client IP
        const ipAddress = getClientIp(request);

        // checks if user is already exisitng
        const { name, email, password, securityQuestion, securityAnswer } = await request.json();
        
        // Validate input
        if (!name || !email || !password || !securityQuestion || !securityAnswer) {
            await logValidationFailure(email, ipAddress, "/api/register", "Missing required fields");
            return NextResponse.json({error: "Please input valid credentials."})
        }

        const userExistence = await User.findOne({email})
        if(userExistence) {
            await logRegistration(email, ipAddress, false, "Email already exists");
            return NextResponse.json({error: "Please input valid credentials."})
        }

        // hash password and answer
        const hashpassword = await bcrypt.hash(password, 10)
        const hashedAnswer = await bcrypt.hash(securityAnswer.toLowerCase(), 10);

        const passwordChangedAt = new Date();

        const newUser = new User({
            name,
            email,
            password: hashpassword,
            securityQuestion,
            securityAnswer: hashedAnswer,
            passwordChangedAt
        })
        await newUser.save()

        // Log successful registration
        await logRegistration(email, ipAddress, true);

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
    
    } catch(err: any) {
        // Log registration error
        try {
            const { email } = await request.json();
            const ipAddress = getClientIp(request);
            await logRegistration(email, ipAddress, false, err.message);
        } catch(e) {
            // Silently fail if we can't extract details
        }
        return NextResponse.json({error: err.message, status: 500})
    }
}