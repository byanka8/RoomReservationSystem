import mongoose from "mongoose";

// Schema
const roomSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        capacity: { type: Number, required: true },
        location: { type: String },
        description: { type: String },
    },
    { timestamps: true } // for createdAt and updatedAt
)

// Model (if not available (schema not sees it), it will create a new one)
const Room = mongoose.models.Room || mongoose.model('Room', roomSchema)
export default Room;