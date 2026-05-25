import mongoose from "mongoose";
import { ensureAdminUser } from "../utils/ensureAdmin";

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }
  await mongoose.connect(uri);
  console.log("MongoDB connected");
  await ensureAdminUser();
  console.log("Admin account ready (admin@plusalphaintern.com)");
};
