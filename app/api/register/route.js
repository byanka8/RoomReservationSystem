import User from "@/models/User";
import connectToDatabase from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {

        connectToDatabase();

        // checks if user is already exisitng
        const {name, email, password} = await request.json()
        const userExistence = await User.findOne({email})
        if(userExistence) {
            return NextResponse.json({error: "User already existed"})
        }

        // hash password
        const hashpassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password: hashpassword
        })
        await newUser.save()

        return NextResponse.json({message: "User Registered", status: 201})
    } catch(err) {
        return NextResponse.json({error: err.message, status: 500})
    }
}