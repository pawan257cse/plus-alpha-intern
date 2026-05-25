import { Router } from "express";
import {
  getCourses,
  getCourseById,
  enrollCourse,
  updateProgress,
} from "../controllers/courseController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/:id/enroll", protect, authorize("student"), enrollCourse);
router.patch("/:id/progress", protect, authorize("student"), updateProgress);

export default router;
