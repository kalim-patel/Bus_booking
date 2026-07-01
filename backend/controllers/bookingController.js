import mongoose from "mongoose";
import { Booking } from "../models/Booking.js";
import { Bus } from "../models/Bus.js";

/**
 * Helper function to determine booking state based on travel date and cancellation status
 * Returns: 'upcoming' | 'today' | 'completed' | 'cancelled'
 */
function getBookingState(travelDate, status) {
  if (status === "cancelled") return "cancelled";
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const travel = new Date(travelDate);
  travel.setHours(0, 0, 0, 0);
  
  if (travel.getTime() === today.getTime()) return "today";
  if (travel.getTime() > today.getTime()) return "upcoming";
  return "completed";
}

/** POST /api/bookings */
export async function createBooking(req, res) {
  try {
    const { busId, travelDate, passengers, seatCount, seatNumbers } = req.body;

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

    // Validate seat numbers if provided
    let finalSeatNumbers = [];
    if (seatNumbers && Array.isArray(seatNumbers) && seatNumbers.length > 0) {
      if (seatNumbers.length !== count) {
        return res.status(400).json({ message: "Number of selected seats must match passenger count." });
      }
      // Validate seat number format
      const seatRegex = /^[A-Z]\d+$/;
      if (!seatNumbers.every((s) => seatRegex.test(s))) {
        return res.status(400).json({ message: "Invalid seat number format. Use format like A1, B2, etc." });
      }
      finalSeatNumbers = seatNumbers.map((s) => s.toUpperCase());

      // Verify seats are not already booked
      const existingBookings = await Booking.find({
        bus: busId,
        travelDate: String(travelDate).trim(),
        status: "confirmed",
        seatNumbers: { $in: finalSeatNumbers },
      }).lean();

      const alreadyBooked = existingBookings.flatMap((b) => b.seatNumbers || []);
      const conflictingSeats = finalSeatNumbers.filter((s) => alreadyBooked.includes(s));
      if (conflictingSeats.length > 0) {
        return res.status(400).json({ 
          message: `Seats ${conflictingSeats.join(", ")} are already booked. Please select different seats.` 
        });
      }
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
      seatNumbers: finalSeatNumbers,
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

/** GET /api/bookings/:id */
export async function getBookingById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid booking ID." });
    }

    const booking = await Booking.findById(id)
      .populate("bus", "busName busNumber from to departureTime arrivalTime duration price busType")
      .lean();

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only view your own bookings." });
    }

    return res.json({ booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load booking." });
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

/** GET /api/bookings/bus/:busId/available-seats?date=YYYY-MM-DD */
export async function getAvailableSeats(req, res) {
  try {
    const { busId } = req.params;
    const { date } = req.query;

    if (!mongoose.isValidObjectId(busId)) {
      return res.status(400).json({ message: "Invalid bus id." });
    }
    if (!date) {
      return res.status(400).json({ message: "Travel date is required." });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found." });
    }

    // Get all confirmed bookings for this bus on this date
    const bookings = await Booking.find({
      bus: busId,
      travelDate: String(date).trim(),
      status: "confirmed",
    }).lean();

    // Extract all booked seat numbers
    const bookedSeats = bookings.flatMap((booking) => booking.seatNumbers || []);

    return res.json({ bookedSeats, totalSeats: bus.seatsAvailable });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load available seats." });
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

    // Check if travel date is in the future
    const state = getBookingState(booking.travelDate, booking.status);
    if (state === "completed" || state === "today") {
      return res.status(400).json({ 
        message: state === "today" 
          ? "Cannot cancel a booking for today's journey." 
          : "Cannot cancel a completed journey." 
      });
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

/** PUT /api/bookings/:id/rating – submit rating for a completed journey */
export async function submitRating(req, res) {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid booking ID." });
    }

    // Validate rating
    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Verify the booking belongs to the user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only rate your own bookings." });
    }

    // Check if already rated
    if (booking.rating) {
      return res.status(400).json({ message: "You have already rated this journey." });
    }

    // Check if journey is completed
    const state = getBookingState(booking.travelDate, booking.status);
    if (state !== "completed") {
      return res.status(400).json({ 
        message: "You can only rate completed journeys." 
      });
    }

    // Update booking with rating
    booking.rating = ratingNum;
    if (review && typeof review === "string" && review.trim()) {
      booking.review = review.trim();
    }
    booking.reviewDate = new Date();
    await booking.save();

    return res.json({ message: "Thank you for your feedback." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to submit rating." });
  }
}
