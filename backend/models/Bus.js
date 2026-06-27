import mongoose from "mongoose";

const busSchema = new mongoose.Schema(
  {
    busName: { type: String, required: true },
    busNumber: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    duration: { type: String, required: true },
    seatsAvailable: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    busType: { type: String, enum: ["AC", "Non-AC", "Sleeper", "Semi-Sleeper"], default: "Non-AC" },
  },
  { timestamps: true }
);

export const Bus = mongoose.model("Bus", busSchema);
