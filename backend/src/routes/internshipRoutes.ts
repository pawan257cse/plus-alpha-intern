import { Router } from "express";
import {
  getInternships,
  getInternshipById,
  createInternship,
  applyInternship,
  saveInternship,
  getMyApplications,
  updateApplicationStatus,
  getLeaderboard,
} from "../controllers/internshipController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", getInternships);
router.get("/leaderboard", getLeaderboard);
router.get("/applications/me", protect, getMyApplications);
router.get("/:id", getInternshipById);
router.post("/", protect, authorize("company", "admin"), createInternship);
router.post("/:id/apply", protect, authorize("student"), applyInternship);
router.post("/:id/save", protect, authorize("student"), saveInternship);
router.patch(
  "/applications/:id/status",
  protect,
  authorize("company", "admin"),
  updateApplicationStatus
);

export default router;
