import mongoose from "mongoose";

// Schema
const reservationSchema = new mongoose.Schema(
    {
        roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        date: { type: Date, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    },
    { timestamps: true } // for createdAt and updatedAt
)

// Model (if not available (schema not sees it), it will create a new one)
const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema)
export default Reservation;