import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User } from "../models/User";

const ADMIN_EMAIL = "admin@plusalphaintern.com";
const ADMIN_PASSWORD = "Admin@123456";
const ADMIN_NAME = "Plus Alpha Admin";

async function seedAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI missing in backend/.env");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("✅ MongoDB connected");

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const existing = await User.findOne({ email: ADMIN_EMAIL });

  if (existing) {
    existing.password = hashed;
    existing.role = "admin";
    existing.isVerified = true;
    existing.name = ADMIN_NAME;
    existing.registrationPaymentStatus = "verified";
    existing.taskPaymentStatus = "verified";
    existing.emailVerified = true;
    existing.approvedByAdmin = true;
    existing.status = "active";
    await existing.save();
    console.log("✅ Admin user updated");
  } else {
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashed,
      role: "admin",
      isVerified: true,
      registrationPaymentStatus: "verified",
      taskPaymentStatus: "verified",
      skills: [],
      profileCompletion: 100,
      emailVerified: true,
      approvedByAdmin: true,
      status: "active",
    });
    console.log("✅ Admin user created");
  }

  console.log("\n--- Admin login ---");
  console.log("Email:    ", ADMIN_EMAIL);
  console.log("Password: ", ADMIN_PASSWORD);
  console.log("Login:    http://localhost:3000/admin/login");
  console.log("Dashboard: http://localhost:3000/admin/dashboard\n");

  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
