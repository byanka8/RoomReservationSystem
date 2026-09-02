import User from "@/models/User";
import connectToDatabase from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { logRegistration, getClientIp, logValidationFailure } from "@/lib/logger";
import { isPasswordComplexEnough, PASSWORD_POLICY_MESSAGE } from "@/lib/passwordPolicy";

export async function POST(request: Request) {
    let email: string | null = null;
    const ipAddress = getClientIp(request);

    try {
        await connectToDatabase();

        const { name, email: bodyEmail, password, securityQuestion, securityAnswer } = await request.json();
        email = bodyEmail;

        if (!name || !email || !password || !securityQuestion || !securityAnswer) {
            await logValidationFailure(email ?? undefined, ipAddress, "/api/register", "Missing required fields");
            return NextResponse.json({ error: "Please input valid credentials." }, { status: 400 });
        }

        if (!isPasswordComplexEnough(password)) {
            await logValidationFailure(email, ipAddress, "/api/register", "Password policy failed");
            return NextResponse.json({ error: PASSWORD_POLICY_MESSAGE }, { status: 400 });
        }

        const userExistence = await User.findOne({ email });
        if (userExistence) {
            await logRegistration(email, ipAddress, false, "Email already exists");
            return NextResponse.json({ error: "Please input valid credentials." });
        }

        const hashpassword = await bcrypt.hash(password, 10);
        const hashedAnswer = await bcrypt.hash(securityAnswer.toLowerCase(), 10);
        const passwordChangedAt = new Date();

        const newUser = new User({
            name,
            email,
            password: hashpassword,
            securityQuestion,
            securityAnswer: hashedAnswer,
            passwordChangedAt,
        });
        await newUser.save();

        await logRegistration(email, ipAddress, true);

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        const response = NextResponse.json({
            message: "Register successful",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
            status: 201,
        }, { status: 201 });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60,
            path: "/",
        });

        return response;
    } catch (err: any) {
        await logRegistration(email ?? "unknown", ipAddress, false, err.message);
        return NextResponse.json({ error: err.message, status: 500 });
    }
}