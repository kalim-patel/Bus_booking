import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} from "../controllers/bookingController.js";

const router = Router();

router.get("/mine", authMiddleware, getMyBookings);
router.get("/:id", authMiddleware, getBookingById);
router.post("/", authMiddleware, createBooking);
router.delete("/:id", authMiddleware, cancelBooking);

export default router;
