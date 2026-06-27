import mongoose from "mongoose";
import { Booking } from "../models/Booking.js";
import { Bus } from "../models/Bus.js";

/** POST /api/bookings */
export async function createBooking(req, res) {
  try {
    const { busId, travelDate, passengers, seatCount } = req.body;

    if (!busId || !travelDate) {
      return res.status(400).json({ message: "Bus and travel date are required." });
    }
    if (!mongoose.isValidObjectId(busId)) {
      return res.status(400).json({ message: "Invalid bus id." });
    }
    const count = Number(seatCount);
    if (!Number.isInteger(count) || count < 1 || count > 10) {
      return res.status(400).json({ message: "Seat count must be between 1 and 10." });
    }
    if (!Array.isArray(passengers) || passengers.length !== count) {
      return res.status(400).json({ message: `Enter exactly ${count} passenger name(s).` });
    }

    const cleaned = passengers.map((p) => {
      const fullName = typeof p?.fullName === "string" ? p.fullName.trim() : "";
      return { fullName };
    });
    if (cleaned.some((p) => p.fullName.length < 2)) {
      return res.status(400).json({ message: "Each passenger needs a name (at least 2 characters)." });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found." });
    }
    if (bus.seatsAvailable < count) {
      return res.status(400).json({ message: "Not enough seats on this bus." });
    }

    const totalAmount = bus.price * count;

    const updated = await Bus.findOneAndUpdate(
      { _id: busId, seatsAvailable: { $gte: count } },
      { $inc: { seatsAvailable: -count } },
      { new: true }
    );
    if (!updated) {
      return res.status(400).json({ message: "Seats were just taken. Try fewer seats or another bus." });
    }

    const booking = await Booking.create({
      user: req.user.id,
      bus: busId,
      travelDate: String(travelDate).trim(),
      passengers: cleaned,
      seatCount: count,
      totalAmount,
    });

    const populated = await Booking.findById(booking._id)
      .populate("bus", "busName busNumber from to departureTime arrivalTime duration price")
      .lean();

    return res.status(201).json({ booking: populated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not complete booking." });
  }
}

/** GET /api/bookings/mine */
export async function getMyBookings(req, res) {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("bus", "busName busNumber from to departureTime arrivalTime duration price")
      .lean();
    return res.json({ bookings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load bookings." });
  }
}

/** DELETE /api/bookings/:id – cancel a booking */
export async function cancelBooking(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid booking ID." });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Verify the booking belongs to the user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only cancel your own bookings." });
    }

    // Check if already cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled." });
    }

    // Update booking status to cancelled
    booking.status = "cancelled";
    await booking.save();

    // Restore seats to the bus
    await Bus.findByIdAndUpdate(booking.bus, { $inc: { seatsAvailable: booking.seatCount } });

    return res.json({ message: "Booking cancelled successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to cancel booking." });
  }
}
