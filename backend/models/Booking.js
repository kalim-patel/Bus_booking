import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    travelDate: { type: String, required: true },
    passengers: {
      type: [passengerSchema],
      required: true,
      validate: [(v) => Array.isArray(v) && v.length > 0, "At least one passenger"],
    },
    seatCount: { type: Number, required: true, min: 1, max: 10 },
    seatNumbers: { type: [String], default: [] },
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String, trim: true },
    reviewDate: { type: Date },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
