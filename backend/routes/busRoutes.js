import { Router } from "express";
import { getBuses, searchBuses } from "../controllers/busController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// Protected so only logged-in users hit booking-related APIs
router.get("/search", authMiddleware, searchBuses);
router.get("/", authMiddleware, getBuses);

export default router;
