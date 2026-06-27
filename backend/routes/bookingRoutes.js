import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createBooking, getMyBookings, cancelBooking } from "../controllers/bookingController.js";

const router = Router();

router.get("/mine", authMiddleware, getMyBookings);
router.post("/", authMiddleware, createBooking);
router.delete("/:id", authMiddleware, cancelBooking);

export default router;
