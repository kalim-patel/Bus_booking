import dns from "dns";
import mongoose from "mongoose";

/**
 * Connects to MongoDB Atlas (or local URI in .env).
 */
export async function connectDB() {
  // Some routers/ISPs refuse SRV lookups that mongodb+srv:// requires; Node fails with ECONNREFUSED.
  dns.setServers(["8.8.8.8", "1.1.1.1"]);

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set in environment variables");
  }
  await mongoose.connect(uri);
  console.log("MongoDB connected");
}
