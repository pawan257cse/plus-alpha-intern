import bcrypt from "bcryptjs";
import { User } from "../models/User";

const ADMIN_EMAIL = "admin@plusalphaintern.com";
const ADMIN_PASSWORD = "Admin@123456";
const ADMIN_NAME = "Plus Alpha Admin";

export async function ensureAdminUser(): Promise<void> {
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
    return;
  }

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
}
