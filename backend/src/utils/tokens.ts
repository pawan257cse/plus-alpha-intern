import crypto from "crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import { IUser } from "../models/User.js";

export const isEmailVerificationEnabled = (): boolean =>
  process.env.ENABLE_EMAIL_VERIFICATION === "true";

export const signAccessToken = (id: string, role: string): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"],
  };
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, options);
};

export const signRefreshToken = (id: string): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "30d") as SignOptions["expiresIn"],
  };
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as string, options);
};

export const generateResetToken = (): string => crypto.randomBytes(32).toString("hex");

export const hashToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

export const calcProfileCompletion = (user: Partial<IUser>): number => {
  let score = 15;
  if (user.phone) score += 10;
  if (user.college) score += 10;
  if (user.university) score += 5;
  if (user.degree) score += 5;
  if (user.branch) score += 5;
  if (user.year) score += 5;
  if (user.skills?.length) score += 15;
  if (user.internshipDomain || user.selectedDomain) score += 10;
  if (user.linkedin) score += 5;
  if (user.github) score += 5;
  if (user.resumeUrl) score += 10;
  if (user.profilePhoto || user.avatar) score += 10;
  return Math.min(score, 100);
};
