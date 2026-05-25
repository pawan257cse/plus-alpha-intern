import { Router, Response } from "express";
import { AuthRequest, protect } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { Notification } from "../models/Notification.js";
import { calcProfileCompletion } from "../utils/tokens.js";
import { submitTask, getMyTasks } from "../controllers/taskController.js";
import { listDomainTasksForStudent } from "../controllers/domainTaskController.js";

const router = Router();

router.get("/notifications", protect, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    return sendSuccess(res, notifications);
  } catch {
    return sendError(res, "Failed to fetch notifications", 500);
  }
});

router.patch(
  "/notifications/:id/read",
  protect,
  async (req: AuthRequest, res: Response) => {
    try {
      await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
      return sendSuccess(res, null, "Marked as read");
    } catch {
      return sendError(res, "Failed", 500);
    }
  }
);

router.get("/profile", protect, async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, "Unauthorized", 401);
  return sendSuccess(res, req.user);
});

router.post("/tasks/submit", protect, submitTask);
router.get("/tasks/me", protect, getMyTasks);
router.get("/domain-tasks", protect, listDomainTasksForStudent);

router.patch("/profile", protect, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const allowed = [
      "name",
      "phone",
      "bio",
      "college",
      "university",
      "degree",
      "branch",
      "year",
      "passingYear",
      "graduationYear",
      "skills",
      "avatar",
      "profilePhoto",
      "resumeUrl",
      "linkedin",
      "github",
      "internshipDomain",
      "selectedDomain",
    ];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req.user as any)[key] = req.body[key];
      }
    }
    req.user.profileCompletion = calcProfileCompletion(req.user);
    await req.user.save();
    return sendSuccess(res, req.user);
  } catch {
    return sendError(res, "Profile update failed", 500);
  }
});

export default router;
