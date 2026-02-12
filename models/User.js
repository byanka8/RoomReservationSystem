import mongoose from "mongoose";

// Schema
const userSchema = new mongoose.Schema(
    {
        name: {type: String},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        role: { type: String, enum: ["user", "manager", "admin"], default: "user" },
        avatar: { type: String },
    },
    { timestamps: true } // for createdAt and updatedAt
)

// Model (if not available (schema not sees it), it will create a new one)
const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User;