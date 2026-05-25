import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { Internship } from "../models/Internship.js";
import { Application } from "../models/Application.js";
import { User } from "../models/User.js";
import { Notification } from "../models/Notification.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const getInternships = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const {
      domain,
      location,
      minStipend,
      duration,
      isRemote,
      search,
      page = 1,
      limit = 12,
    } = req.query;

    const filter: Record<string, unknown> = { status: "open" };
    if (domain) filter.domain = domain;
    if (location) filter.location = new RegExp(location as string, "i");
    if (minStipend) filter.stipend = { $gte: Number(minStipend) };
    if (duration) filter.duration = duration;
    if (isRemote === "true") filter.isRemote = true;
    if (search) {
      filter.$text = { $search: search as string };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [internships, total] = await Promise.all([
      Internship.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("postedBy", "name companyName"),
      Internship.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      internships,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch {
    return sendError(res, "Failed to fetch internships", 500);
  }
};

export const getInternshipById = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const internship = await Internship.findById(req.params.id).populate(
      "postedBy",
      "name email companyName companyWebsite"
    );
    if (!internship) return sendError(res, "Internship not found", 404);
    return sendSuccess(res, internship);
  } catch {
    return sendError(res, "Failed to fetch internship", 500);
  }
};

export const createInternship = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const internship = await Internship.create({
      ...req.body,
      postedBy: req.user._id,
      company: req.body.company || req.user.companyName,
    });
    return sendSuccess(res, internship, "Internship posted", 201);
  } catch {
    return sendError(res, "Failed to create internship", 500);
  }
};

export const applyInternship = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const internshipId = req.params.id;
    const existing = await Application.findOne({
      internship: internshipId,
      applicant: req.user._id,
    });
    if (existing) return sendError(res, "Already applied", 409);

    const application = await Application.create({
      internship: internshipId,
      applicant: req.user._id,
      coverLetter: req.body.coverLetter,
      resumeUrl: req.body.resumeUrl || req.user.resumeUrl,
    });

    await Internship.findByIdAndUpdate(internshipId, {
      $inc: { applicantsCount: 1 },
    });

    await Notification.create({
      user: req.user._id,
      title: "Application Submitted",
      message: "Your internship application has been submitted successfully.",
      type: "application",
      link: `/dashboard/internships`,
    });

    req.user.xp += 15;
    await req.user.save();

    return sendSuccess(res, application, "Application submitted", 201);
  } catch {
    return sendError(res, "Application failed", 500);
  }
};

export const saveInternship = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const id = String(req.params.id);
    const saved = req.user.savedInternships.map(String);
    if (saved.includes(id)) {
      req.user.savedInternships = req.user.savedInternships.filter(
        (s) => s.toString() !== id
      );
    } else {
      req.user.savedInternships.push(
        id as unknown as (typeof req.user.savedInternships)[number]
      );
    }
    await req.user.save();
    return sendSuccess(res, { saved: req.user.savedInternships });
  } catch {
    return sendError(res, "Failed to save", 500);
  }
};

export const getMyApplications = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const applications = await Application.find({ applicant: req.user._id })
      .populate("internship")
      .sort({ appliedAt: -1 });
    return sendSuccess(res, applications);
  } catch {
    return sendError(res, "Failed to fetch applications", 500);
  }
};

export const updateApplicationStatus = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("applicant internship");

    if (!application) return sendError(res, "Application not found", 404);

    await Notification.create({
      user: application.applicant,
      title: "Application Update",
      message: `Your application status is now: ${status}`,
      type: "application",
    });

    return sendSuccess(res, application);
  } catch {
    return sendError(res, "Update failed", 500);
  }
};

export const getLeaderboard = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const period = (req.query.period as string) || "all";
    const sortField = period === "daily" ? "dailyCoins" : "xp";
    const leaders = await User.find({ role: "student" })
      .sort({ [sortField]: -1 })
      .limit(20)
      .select("name avatar xp streak badges coins dailyXp dailyCoins");
    return sendSuccess(res, leaders);
  } catch {
    return sendError(res, "Failed to fetch leaderboard", 500);
  }
};
