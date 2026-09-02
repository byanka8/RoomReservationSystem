import mongoose from "mongoose";

// Schema for system logs
const logSchema = new mongoose.Schema(
    {
        // Identifies what type of event occurred
        eventType: {
            type: String,
            enum: [
                "AUTH_LOGIN_SUCCESS",
                "AUTH_LOGIN_FAILURE",
                "AUTH_REGISTER_SUCCESS",
                "AUTH_REGISTER_FAILURE",
                "AUTH_LOGOUT",
                "AUTH_TOKEN_EXPIRED",
                "AUTH_INVALID_TOKEN",
                "ACCESS_DENIED",
                "ACCESS_SUCCESS",
                "VALIDATION_FAILURE",
                "SECURITY_QUESTION_SUCCESS",
                "SECURITY_QUESTION_FAILURE",
                "PASSWORD_CHANGE_SUCCESS",
                "PASSWORD_CHANGE_FAILURE",
                "PASSWORD_RESET_SUCCESS",
                "PASSWORD_RESET_FAILURE",
                "ACCOUNT_DISABLED",
                "ACCOUNT_ENABLED",
                "RESOURCE_CREATED",
                "RESOURCE_UPDATED",
                "RESOURCE_DELETED"
            ],
            required: true
        },

        // The user who triggered the event (if applicable)
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        // User details at time of log (for cases where user was deleted)
        userEmail: {
            type: String
        },

        // IP address of the request
        ipAddress: {
            type: String
        },

        // HTTP method (GET, POST, etc.)
        method: {
            type: String
        },

        // API endpoint that was accessed
        endpoint: {
            type: String
        },

        // Whether the action succeeded or failed
        status: {
            type: String,
            enum: ["success", "failure"],
            required: true
        },

        // Human-readable message
        message: {
            type: String,
            required: true
        },

        // Specific details about what failed (for validation errors, etc.)
        errorDetails: {
            type: String
        },

        // Resource type affected (User, Room, Reservation, etc.)
        resourceType: {
            type: String
        },

        // ID of the resource affected
        resourceId: {
            type: mongoose.Schema.Types.ObjectId
        },

        // Additional metadata
        metadata: {
            type: mongoose.Schema.Types.Mixed
        }
    },
    { timestamps: true } // createdAt and updatedAt
);

// Index for efficient querying
logSchema.index({ eventType: 1, createdAt: -1 });
logSchema.index({ userId: 1, createdAt: -1 });
logSchema.index({ status: 1, createdAt: -1 });
logSchema.index({ ipAddress: 1 });
logSchema.index({ userEmail: 1 });

const Log = mongoose.models.Log || mongoose.model("Log", logSchema);
export default Log;
