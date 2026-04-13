import mongoose from "mongoose";

// Schema
const userSchema = new mongoose.Schema(
    {
        name: {type: String},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        role: { type: String, enum: ["user", "manager", "admin"], default: "user" },
        avatar: { type: String },
        securityQuestion: { type: String },
        securityAnswer: { type: String },
        resetToken: { type: String, default: null },
        resetTokenExpiry: { type: Number, default: null },
        passwordChangedAt: { type: Date, default: null },
        failedLoginAttempts: { type: Number, default: 0 },
        isAccountDisabled: { type: Boolean, default: false },
        accountDisabledAt: { type: Date, default: null },
        lastLoginAt: { type: Date, default: null },
        lastFailedLoginAt: { type: Date, default: null },
        passwordHistory: {
            type: [
                {
                password: { type: String, required: true }, // store hashed password
                changedAt: { type: Date, required: true },  // when it was set
                }
            ],
            default: [],
        }
    },
    { timestamps: true } // for createdAt and updatedAt
)

// Model (if not available (schema not sees it), it will create a new one)
const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User;