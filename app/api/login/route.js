import User from "@/models/User";
import connectToDatabase from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
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

        return NextResponse.json({message: "Log In Successful", status: 201})

    } catch(err) {
        return NextResponse.json({error: err.message, status: 500})
    }
}