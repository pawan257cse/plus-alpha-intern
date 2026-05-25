import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { Internship } from "../models/Internship.js";
import { Course } from "../models/Course.js";
import { Application } from "../models/Application.js";
import { Payment } from "../models/Payment.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { sendApprovalEmail } from "../utils/email.js";
import { Notification } from "../models/Notification.js";
import { Certificate } from "../models/Certificate.js";

export const getDashboardStats = async (
  _req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalUsers,
      totalInternships,
      activeInternships,
      totalCourses,
      totalApplications,
      newUsers,
      certificatesIssued,
      revenue,
    ] = await Promise.all([
      User.countDocuments(),
      Internship.countDocuments(),
      Internship.countDocuments({ status: "open" }),
      Course.countDocuments(),
      Application.countDocuments(),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Certificate.countDocuments(),
      Payment.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const pendingApplications = await Application.countDocuments({
      status: "pending",
    });

    return sendSuccess(res, {
      totalUsers,
      totalInternships,
      activeInternships,
      totalCourses,
      totalApplications,
      pendingApplications,
      newUsers,
      certificatesIssued,
      revenue: revenue[0]?.total || 0,
      usersByRole,
      userGrowth,
    });
  } catch {
    return sendError(res, "Failed to fetch stats", 500);
  }
};

export const getAllUsers = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { role, page = 1, limit = 20, status } = req.query;
    const filter: Record<string, unknown> = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password -otp -refreshToken")
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);
    return sendSuccess(res, { users, total });
  } catch {
    return sendError(res, "Failed to fetch users", 500);
  }
};

export const verifyUser = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true, emailVerified: true },
      { new: true }
    ).select("-password");
    if (!user) return sendError(res, "User not found", 404);
    return sendSuccess(res, user);
  } catch {
    return sendError(res, "Verification failed", 500);
  }
};

export const approveStudent = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { startDate, internshipDomain } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, "User not found", 404);
    if (user.role !== "student") return sendError(res, "Only students can be approved", 400);

    user.approvedByAdmin = true;
    user.status = "active";
    user.isVerified = true;
    user.emailVerified = true;
    if (internshipDomain) {
      user.internshipDomain = internshipDomain;
      user.selectedDomain = internshipDomain;
    }
    await user.save();

    await Notification.create({
      user: user._id,
      title: "Registration approved",
      message:
        "You can now submit your internship tasks. Go to Submit Task when your project is ready.",
      type: "success",
      link: "/submit-task",
    });

    try {
      await sendApprovalEmail({
        to: user.email,
        name: user.name,
        internshipDomain: user.internshipDomain || user.selectedDomain,
        startDate: startDate || new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      });
    } catch {
      console.warn("Approval email failed");
    }

    return sendSuccess(res, user, "Student approved and notified");
  } catch {
    return sendError(res, "Approval failed", 500);
  }
};

export const rejectStudent = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, "User not found", 404);
    if (user.role !== "student") return sendError(res, "Only students can be rejected", 400);

    user.approvedByAdmin = false;
    user.status = "suspended";
    await user.save();

    await Notification.create({
      user: user._id,
      title: "Registration not approved",
      message: reason || "Your registration was not approved. Contact support for details.",
      type: "warning",
      link: "/contact",
    });

    return sendSuccess(res, user, "Student rejected");
  } catch {
    return sendError(res, "Rejection failed", 500);
  }
};

export const verifyCompany = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { companyVerified: true, status: "active", isVerified: true, emailVerified: true },
      { new: true }
    ).select("-password");
    if (!user) return sendError(res, "Company not found", 404);
    return sendSuccess(res, user, "Company verified");
  } catch {
    return sendError(res, "Verification failed", 500);
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const allowed = [
      "name",
      "email",
      "phone",
      "role",
      "status",
      "approvedByAdmin",
      "isVerified",
      "internshipDomain",
      "college",
    ];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password -otp -refreshToken");
    if (!user) return sendError(res, "User not found", 404);
    return sendSuccess(res, user);
  } catch {
    return sendError(res, "Update failed", 500);
  }
};

export const setUserStatus = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { status } = req.body;
    if (!["active", "suspended", "pending"].includes(status)) {
      return sendError(res, "Invalid status", 400);
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select("-password");
    if (!user) return sendError(res, "User not found", 404);
    return sendSuccess(res, user, status === "suspended" ? "User banned" : "User updated");
  } catch {
    return sendError(res, "Status update failed", 500);
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, "User not found", 404);
    if (user.role === "admin") return sendError(res, "Cannot delete admin", 400);
    await user.deleteOne();
    return sendSuccess(res, null, "User deleted");
  } catch {
    return sendError(res, "Delete failed", 500);
  }
};

export const getAdminCertificates = async (
  _req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const certs = await Certificate.find()
      .populate("user", "name email")
      .populate("course", "title")
      .sort({ issuedAt: -1 })
      .limit(100);
    return sendSuccess(res, certs);
  } catch {
    return sendError(res, "Failed to fetch certificates", 500);
  }
};

export const issueCertificate = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { userId, title, courseId, internshipId } = req.body;
    if (!userId || !title?.trim()) {
      return sendError(res, "userId and title required", 400);
    }
    const cert = await Certificate.create({
      user: userId,
      title: title.trim(),
      course: courseId,
      internship: internshipId,
    });
    await Notification.create({
      user: userId,
      title: "Certificate issued",
      message: `Your certificate "${title}" is ready. View it in your dashboard.`,
      type: "success",
      link: "/dashboard/certificates",
    });
    const populated = await Certificate.findById(cert._id).populate("user", "name email");
    return sendSuccess(res, populated, "Certificate issued", 201);
  } catch {
    return sendError(res, "Failed to issue certificate", 500);
  }
};

export const broadcastNotification = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { title, message, role, type, link } = req.body;
    if (!title?.trim() || !message?.trim()) {
      return sendError(res, "Title and message required", 400);
    }
    const filter: Record<string, unknown> = {};
    if (role) filter.role = role;
    const users = await User.find(filter).select("_id");
    await Notification.insertMany(
      users.map((u) => ({
        user: u._id,
        title: title.trim(),
        message: message.trim(),
        type: type || "info",
        link: link || "/dashboard/notifications",
      }))
    );
    return sendSuccess(res, { sent: users.length }, `Sent to ${users.length} users`);
  } catch {
    return sendError(res, "Broadcast failed", 500);
  }
};

export const getAdminApplications = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { status } = req.query;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    const apps = await Application.find(filter)
      .populate("applicant", "name email college")
      .populate("internship", "title company domain")
      .sort({ appliedAt: -1 })
      .limit(100);
    return sendSuccess(res, apps);
  } catch {
    return sendError(res, "Failed to fetch applications", 500);
  }
};

export const getAdminInternships = async (
  _req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const internships = await Internship.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });
    return sendSuccess(res, internships);
  } catch {
    return sendError(res, "Failed to fetch internships", 500);
  }
};

export const createAdminInternship = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const internship = await Internship.create({
      ...req.body,
      postedBy: req.user._id,
    });
    return sendSuccess(res, internship, "Internship created", 201);
  } catch {
    return sendError(res, "Failed to create internship", 500);
  }
};

export const updateAdminInternship = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!internship) return sendError(res, "Internship not found", 404);
    return sendSuccess(res, internship);
  } catch {
    return sendError(res, "Failed to update internship", 500);
  }
};

export const deleteAdminInternship = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);
    if (!internship) return sendError(res, "Internship not found", 404);
    return sendSuccess(res, null, "Internship deleted");
  } catch {
    return sendError(res, "Failed to delete internship", 500);
  }
};
