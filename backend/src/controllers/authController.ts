import { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { body } from "express-validator";
import { User } from "../models/User.js";
import { AuthRequest } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendOTPEmail, sendWelcomeEmail, sendResetPasswordEmail } from "../utils/email.js";
import { getSiteSettings, calcFees } from "../models/SiteSettings.js";
import {
  isEmailVerificationEnabled,
  signAccessToken,
  signRefreshToken,
  generateResetToken,
  hashToken,
  calcProfileCompletion,
} from "../utils/tokens.js";
import { applyLoginStreakAndRewards } from "../utils/gamification.js";
import {
  accessTokenCookieOptions,
  buildClientUrl,
  clearAuthCookieOptions,
  refreshTokenCookieOptions,
} from "../config/runtime.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sanitizeUser = (user: any) => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  avatar: user.avatar || user.profilePhoto,
  profilePhoto: user.profilePhoto,
  phone: user.phone,
  college: user.college,
  university: user.university,
  degree: user.degree,
  branch: user.branch,
  year: user.year,
  passingYear: user.passingYear,
  graduationYear: user.graduationYear,
  skills: user.skills || [],
  internshipDomain: user.internshipDomain || user.selectedDomain,
  selectedDomain: user.selectedDomain,
  linkedin: user.linkedin,
  github: user.github,
  resumeUrl: user.resumeUrl,
  isVerified: user.isVerified,
  emailVerified: user.emailVerified ?? user.isVerified,
  approvedByAdmin: user.approvedByAdmin,
  companyName: user.companyName,
  companyWebsite: user.companyWebsite,
  companyVerified: user.companyVerified,
  profileCompletion: user.profileCompletion,
  xp: user.xp,
  coins: user.coins ?? 0,
  dailyXp: user.dailyXp ?? 0,
  dailyCoins: user.dailyCoins ?? 0,
  streak: user.streak,
  badges: user.badges || [],
  registrationPaymentStatus: user.registrationPaymentStatus,
  taskPaymentStatus: user.taskPaymentStatus,
});

const issueTokens = async (user: InstanceType<typeof User>) => {
  const accessToken = signAccessToken(user._id.toString(), user.role);
  const refreshToken = signRefreshToken(user._id.toString());
  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie("token", accessToken, accessTokenCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
};

const clearAuthCookies = (res: Response) => {
  res.cookie("token", "", clearAuthCookieOptions);
  res.cookie("refreshToken", "", clearAuthCookieOptions);
};


export const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("phone").optional().trim(),
  body("college").optional().trim(),
  body("university").optional().trim(),
  body("degree").optional().trim(),
  body("branch").optional().trim(),
  body("year").optional().trim(),
  body("passingYear").optional().isInt({ min: 2020, max: 2040 }),
];

export const register = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const {
      name,
      password,
      phone,
      college,
      university,
      degree,
      branch,
      year,
      passingYear,
      role = "student",
      internshipDomain,
      selectedDomain,
      companyName,
      companyWebsite,
    } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return sendError(res, "Email already registered", 409);

    const hashed = await bcrypt.hash(password, 12);
    const emailVerification = isEmailVerificationEnabled();
    const domain = internshipDomain || selectedDomain;

    const userData: Record<string, unknown> = {
      name,
      email,
      password: hashed,
      phone,
      college,
      university,
      degree,
      branch,
      year,
      passingYear: passingYear ? Number(passingYear) : undefined,
      role: ["student", "company"].includes(role) ? role : "student",
      internshipDomain: domain,
      selectedDomain: domain,
      companyName,
      companyWebsite,
      skills: [],
      profileCompletion: calcProfileCompletion({
        phone,
        college,
        university,
        degree,
        branch,
        year,
        internshipDomain: domain,
      }),
    };

    if (emailVerification) {
      const otp = generateOTP();
      userData.otp = otp;
      userData.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      userData.isVerified = false;
      userData.emailVerified = false;
    } else {
      userData.isVerified = true;
      userData.emailVerified = true;
      userData.status = "active";
      const feeSettings = calcFees(await getSiteSettings());
      if (feeSettings.payAtTaskOnly) {
        userData.registrationPaymentStatus = "verified";
      }
    }

    const user = await User.create(userData);

    if (emailVerification) {
      try {
        await sendOTPEmail(email, userData.otp as string);
      } catch {
        console.warn("OTP email failed — check SMTP config");
      }
      return sendSuccess(
        res,
        { userId: user._id, email: user.email, requiresVerification: true },
        "Registration successful. Verify your email with OTP.",
        201
      );
    }

    try {
      await sendWelcomeEmail({
        to: email,
        name,
        email,
        password,
        internshipDomain: domain,
      });
    } catch {
      console.warn("Welcome email failed — check SMTP config");
    }

    const { accessToken, refreshToken } = await issueTokens(user);
    setAuthCookies(res, accessToken, refreshToken);
    return sendSuccess(
      res,
      {
        token: accessToken,
        refreshToken,
        user: sanitizeUser(user),
        requiresVerification: false,
      },
      "Registration successful",
      201
    );
  } catch (err) {
    console.error(err);
    return sendError(res, "Registration failed", 500);
  }
};

export const verifyOTP = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const { otp } = req.body;
    const user = await User.findOne({ email }).select("+otp +otpExpires +password");
    if (!user || user.otp !== otp) {
      return sendError(res, "Invalid OTP", 400);
    }
    if (user.otpExpires && user.otpExpires < new Date()) {
      return sendError(res, "OTP expired", 400);
    }

    user.isVerified = true;
    user.emailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    const feeSettings = calcFees(await getSiteSettings());
    if (feeSettings.payAtTaskOnly) {
      user.registrationPaymentStatus = "verified";
    }
    await user.save();

    const { accessToken, refreshToken } = await issueTokens(user);
    setAuthCookies(res, accessToken, refreshToken);
    return sendSuccess(res, { token: accessToken, refreshToken, user: sanitizeUser(user) }, "Email verified");
  } catch {
    return sendError(res, "Verification failed", 500);
  }
};

export const login = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { password, role } = req.body;
    const email = String(req.body.email || "").trim().toLowerCase();
    const user = await User.findOne({ email }).select("+password +refreshToken");
    if (!user || !user.password) {
      return sendError(res, "Invalid credentials", 401);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return sendError(res, "Invalid credentials", 401);

    if (role && user.role !== role) {
      if (role === "student" && user.role === "admin") {
        return sendError(res, "Please sign in at /admin/login", 403);
      }
      if (role === "admin" && user.role === "student") {
        return sendError(res, "Invalid admin credentials", 401);
      }
      return sendError(res, `Please use ${user.role} login`, 403);
    }

    if (isEmailVerificationEnabled() && !user.isVerified) {
      return sendError(res, "Please verify your email first", 403, {
        requiresVerification: true,
        email: user.email,
      });
    }

    if (user.status === "suspended") {
      return sendError(res, "Account suspended. Contact support.", 403);
    }

    applyLoginStreakAndRewards(user);
    const { accessToken, refreshToken } = await issueTokens(user);
    setAuthCookies(res, accessToken, refreshToken);

    return sendSuccess(res, {
      token: accessToken,
      refreshToken,
      user: sanitizeUser(user),
      redirectTo: getRedirectPath(user.role),
    });
  } catch {
    return sendError(res, "Login failed", 500);
  }
};

const getRedirectPath = (role: string): string => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "company":
      return "/company/dashboard";
    default:
      return "/dashboard";
  }
};

export const refreshAccessToken = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
    if (!refreshToken) return sendError(res, "Refresh token required", 400);

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as { id: string };

    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== refreshToken) {
      return sendError(res, "Invalid refresh token", 401);
    }

    const accessToken = signAccessToken(user._id.toString(), user.role);
    res.cookie("token", accessToken, accessTokenCookieOptions);
    return sendSuccess(res, { token: accessToken, user: sanitizeUser(user) });
  } catch {
    return sendError(res, "Token refresh failed", 401);
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (req.user) {
      req.user.refreshToken = undefined;
      await req.user.save();
    }
    clearAuthCookies(res);
    return sendSuccess(res, null, "Logged out");
  } catch {
    return sendError(res, "Logout failed", 500);
  }
};

export const googleLogin = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { credential } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) return sendError(res, "Invalid Google token", 401);

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        name: payload.name || "User",
        email: payload.email,
        googleId: payload.sub,
        avatar: payload.picture,
        profilePhoto: payload.picture,
        isVerified: true,
        emailVerified: true,
        skills: [],
      });
    }

    applyLoginStreakAndRewards(user);
    const { accessToken, refreshToken } = await issueTokens(user);
    setAuthCookies(res, accessToken, refreshToken);
    return sendSuccess(res, {
      token: accessToken,
      refreshToken,
      user: sanitizeUser(user),
      redirectTo: getRedirectPath(user.role),
    });
  } catch {
    return sendError(res, "Google login failed", 500);
  }
};

export const resendOTP = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return sendError(res, "User not found", 404);
    if (user.isVerified) return sendError(res, "Already verified", 400);

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendOTPEmail(email, otp);

    return sendSuccess(res, null, "OTP sent");
  } catch {
    return sendError(res, "Failed to send OTP", 500);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  if (!req.user) return sendError(res, "Unauthorized", 401);
  return sendSuccess(res, sanitizeUser(req.user));
};

export const forgotPassword = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return sendSuccess(res, null, "If account exists, reset link sent");

    if (isEmailVerificationEnabled()) {
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      await sendOTPEmail(email, otp);
      return sendSuccess(res, { method: "otp" }, "Reset OTP sent to email");
    }

    const resetToken = generateResetToken();
    user.resetPasswordToken = hashToken(resetToken);
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetUrl = `${buildClientUrl("/reset-password")}?token=${resetToken}&email=${encodeURIComponent(email)}`;
    await sendResetPasswordEmail({ to: email, name: user.name, resetUrl });

    return sendSuccess(res, { method: "link" }, "Reset link sent to email");
  } catch {
    return sendError(res, "Failed to process request", 500);
  }
};

export const resetPassword = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { email, otp, newPassword, token } = req.body;

    if (token && email) {
      const user = await User.findOne({ email }).select(
        "+resetPasswordToken +resetPasswordExpires"
      );
      if (
        !user ||
        user.resetPasswordToken !== hashToken(token) ||
        !user.resetPasswordExpires ||
        user.resetPasswordExpires < new Date()
      ) {
        return sendError(res, "Invalid or expired reset link", 400);
      }
      user.password = await bcrypt.hash(newPassword, 12);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return sendSuccess(res, null, "Password reset successful");
    }

    const user = await User.findOne({ email }).select("+otp +otpExpires +password");
    if (!user || user.otp !== otp) return sendError(res, "Invalid OTP", 400);
    if (user.otpExpires && user.otpExpires < new Date()) {
      return sendError(res, "OTP expired", 400);
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return sendSuccess(res, null, "Password reset successful");
  } catch {
    return sendError(res, "Reset failed", 500);
  }
};

export const getAuthConfig = async (
  _req: AuthRequest,
  res: Response
): Promise<Response> => {
  return sendSuccess(res, {
    emailVerificationEnabled: isEmailVerificationEnabled(),
    googleClientId: process.env.GOOGLE_CLIENT_ID || null,
  });
};
