import { Response } from "express";
import bcrypt from "bcryptjs";
import { body } from "express-validator";
import { User } from "../models/User.js";
import { Internship } from "../models/Internship.js";
import { Application } from "../models/Application.js";
import { AuthRequest } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { isEmailVerificationEnabled } from "../utils/tokens.js";
import { signAccessToken, signRefreshToken } from "../utils/tokens.js";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from "../config/runtime.js";

export const companyRegisterValidation = [
  body("name").trim().notEmpty().withMessage("Contact name required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 8 }).withMessage("Password min 8 chars"),
  body("companyName").trim().notEmpty().withMessage("Company name required"),
];

export const registerCompany = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { name, password, companyName, companyWebsite, phone } = req.body;
    const email = String(req.body.email || "").trim().toLowerCase();
    const exists = await User.findOne({ email });
    if (exists) return sendError(res, "Email already registered", 409);

    const hashed = await bcrypt.hash(password, 12);
    const verified = !isEmailVerificationEnabled();

    const user = await User.create({
      name,
      email,
      password: hashed,
      phone,
      role: "company",
      companyName,
      companyWebsite,
      isVerified: verified,
      emailVerified: verified,
      companyVerified: false,
      status: "pending",
      skills: [],
    });

    const accessToken = signAccessToken(user._id.toString(), user.role);
    const refreshToken = signRefreshToken(user._id.toString());
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("token", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    return sendSuccess(
      res,
      {
        token: accessToken,
        refreshToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyName: user.companyName,
          companyVerified: user.companyVerified,
        },
        redirectTo: "/company/dashboard",
      },
      "Company registered. Awaiting admin verification.",
      201
    );
  } catch {
    return sendError(res, "Company registration failed", 500);
  }
};

export const getCompanyDashboard = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const companyId = req.user._id;

    const [internships, applications] = await Promise.all([
      Internship.find({ postedBy: companyId }).sort({ createdAt: -1 }).limit(20),
      Application.find()
        .populate({
          path: "internship",
          match: { postedBy: companyId },
        })
        .populate("student", "name email college avatar")
        .sort({ createdAt: -1 })
        .limit(50),
    ]);

    const relevantApps = applications.filter((a) => a.internship);

    return sendSuccess(res, {
      company: {
        name: req.user.companyName,
        verified: req.user.companyVerified,
        website: req.user.companyWebsite,
      },
      internships,
      applications: relevantApps,
      stats: {
        totalInternships: internships.length,
        totalApplications: relevantApps.length,
      },
    });
  } catch {
    return sendError(res, "Failed to load dashboard", 500);
  }
};
