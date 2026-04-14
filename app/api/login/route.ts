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

        // user does not exist
        if(!userExist) {
            return NextResponse.json({error: "Invalid username and/or password.", status: 401})
        }

        // Check if account is disabled
        if(userExist.isAccountDisabled) {
            const disabledTime = new Date(userExist.accountDisabledAt).getTime();
            const currentTime = new Date().getTime();
            const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds

            if(currentTime - disabledTime < fifteenMinutes) {
                const remainingTime = Math.ceil((fifteenMinutes - (currentTime - disabledTime)) / 1000 / 60);
                return NextResponse.json({
                    error: `Account is locked due to multiple failed login attempts. Please try again in ${remainingTime} minute(s).`,
                    status: 403
                })
            } else {
                // 15 minutes have passed, re-enable the account
                userExist.isAccountDisabled = false;
                userExist.accountDisabledAt = null;
                userExist.failedLoginAttempts = 0;
                await userExist.save();
            }
        }

        const isMatch = await bcrypt.compare(password, userExist.password);

        if(!isMatch) {
            // Increment failed login attempts
            userExist.failedLoginAttempts += 1;
            // save latest failed login attempt date
            userExist.lastFailedLoginAt = new Date();

            // Disable account after 5 failed attempts
            if(userExist.failedLoginAttempts >= 5) {
                userExist.isAccountDisabled = true;
                userExist.accountDisabledAt = new Date();
            }

            await userExist.save();
            return NextResponse.json({error: "Invalid username and/or password.", status: 401})
        }

        // Reset failed login attempts on successful login
        userExist.failedLoginAttempts = 0;
        // Save latest successful login date
        userExist.lastLoginAt = new Date();

        await userExist.save();

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