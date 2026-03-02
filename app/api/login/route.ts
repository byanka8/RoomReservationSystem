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
            return NextResponse.json({error: "User does not exist.", status: 401})
        }

        const isMatch = await bcrypt.compare(password, userExist.password);

        if(!isMatch) {
            return NextResponse.json({error: "Invalid password.", status: 401})
        }

        // Create JWT token
        const token = jwt.sign({ id: userExist._id, role: userExist.role }, "SECRET_KEY", { expiresIn: "1h" });

        return NextResponse.json({message: "Log In Successful", status: 201, user: { _id: userExist._id, name: userExist.name, email: userExist.email, role: userExist.role },
    token})

    } catch(err: any) {
        return NextResponse.json({error: err.message, status: 500})
    }
}