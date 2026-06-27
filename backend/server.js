import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import { seedBusesIfEmpty } from "./controllers/busController.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Allow Vercel + local dev
const defaultOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const extra = process.env.CLIENT_ORIGIN ? [process.env.CLIENT_ORIGIN] : [];
app.use(
  cors({
    origin: [...defaultOrigins, ...extra],
    credentials: true,
  })
);
app.use(express.json());

// Health check for Render
app.get("/api/health", (_req, res) => res.json({ ok: true, name: "BUS TRACK API" }));

app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

async function start() {
  try {
    if (!process.env.JWT_SECRET) {
      console.warn("Warning: JWT_SECRET is not set. Set it in production.");
    }
    await connectDB();
    await seedBusesIfEmpty();
    app.listen(PORT, () => {
      console.log(`BUS TRACK server running on port ${PORT}`);
    });
  } catch (e) {
    console.error("Failed to start server:", e.message);
    process.exit(1);
  }
}

start();
