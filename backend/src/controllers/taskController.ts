import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { TaskSubmission } from "../models/TaskSubmission.js";
import { Notification } from "../models/Notification.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { awardActivity } from "../utils/gamification.js";

export const submitTask = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    if (!req.user.approvedByAdmin) {
      return sendError(
        res,
        "Task submission unlocks after admin approves your registration",
        403
      );
    }

    const { weekNumber, title, submissionUrl, notes, domain } = req.body;
    if (!weekNumber?.trim() || !title?.trim() || !submissionUrl?.trim()) {
      return sendError(res, "Week, title, and submission link are required", 400);
    }

    const submission = await TaskSubmission.create({
      user: req.user._id,
      weekNumber: weekNumber.trim(),
      title: title.trim(),
      submissionUrl: submissionUrl.trim(),
      notes: notes?.trim(),
      domain: domain || req.user.internshipDomain || req.user.selectedDomain,
      status: "pending",
    });

    awardActivity(req.user, 25, 10);
    await req.user.save();

    return sendSuccess(res, submission, "Task submitted for review");
  } catch {
    return sendError(res, "Task submission failed", 500);
  }
};

export const getMyTasks = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const tasks = await TaskSubmission.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return sendSuccess(res, tasks);
  } catch {
    return sendError(res, "Failed to fetch tasks", 500);
  }
};

export const getAdminTasks = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const status = (req.query.status as string) || "pending";
    const filter = status === "all" ? {} : { status };
    const tasks = await TaskSubmission.find(filter)
      .populate("user", "name email internshipDomain selectedDomain")
      .sort({ createdAt: -1 })
      .limit(50);
    return sendSuccess(res, tasks);
  } catch {
    return sendError(res, "Failed to fetch task submissions", 500);
  }
};

export const reviewTask = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { status, adminNote } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return sendError(res, "Status must be approved or rejected", 400);
    }

    const task = await TaskSubmission.findById(req.params.id).populate("user");
    if (!task) return sendError(res, "Task not found", 404);

    task.status = status;
    task.adminNote = adminNote;
    task.reviewedAt = new Date();
    await task.save();

    const userId = task.user as { _id?: { toString: () => string } };
    const uid = typeof userId === "object" && userId._id ? userId._id.toString() : String(task.user);

    await Notification.create({
      user: uid,
      title: status === "approved" ? "Task approved" : "Task needs revision",
      message:
        status === "approved"
          ? `Your task "${task.title}" was approved.`
          : `Your task "${task.title}" was rejected. ${adminNote || "Please resubmit."}`,
      type: status === "approved" ? "success" : "warning",
      link: "/submit-task",
    });

    return sendSuccess(res, task, `Task ${status}`);
  } catch {
    return sendError(res, "Review failed", 500);
  }
};
