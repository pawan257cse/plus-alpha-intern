import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { Course } from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";
import { Certificate } from "../models/Certificate.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const getCourses = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { category, level, search } = req.query;
    const filter: Record<string, unknown> = { isPublished: true };
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) {
      filter.$or = [
        { title: new RegExp(search as string, "i") },
        { description: new RegExp(search as string, "i") },
      ];
    }
    const courses = await Course.find(filter).sort({ enrolledCount: -1 });
    return sendSuccess(res, courses);
  } catch {
    return sendError(res, "Failed to fetch courses", 500);
  }
};

export const getCourseById = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return sendError(res, "Course not found", 404);
    return sendSuccess(res, course);
  } catch {
    return sendError(res, "Failed to fetch course", 500);
  }
};

export const enrollCourse = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const courseId = req.params.id;
    const existing = await CourseProgress.findOne({
      user: req.user._id,
      course: courseId,
    });
    if (existing) return sendSuccess(res, existing, "Already enrolled");

    const progress = await CourseProgress.create({
      user: req.user._id,
      course: courseId,
    });
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });
    return sendSuccess(res, progress, "Enrolled", 201);
  } catch {
    return sendError(res, "Enrollment failed", 500);
  }
};

export const updateProgress = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const { lessonIndex, quizScore } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return sendError(res, "Course not found", 404);

    let progress = await CourseProgress.findOne({
      user: req.user._id,
      course: course._id,
    });
    if (!progress) return sendError(res, "Not enrolled", 400);

    if (lessonIndex !== undefined && !progress.completedLessons.includes(lessonIndex)) {
      progress.completedLessons.push(lessonIndex);
    }
    if (quizScore !== undefined) progress.quizScore = quizScore;

    const total = course.lessons.length || 1;
    progress.progress = Math.round(
      (progress.completedLessons.length / total) * 100
    );

    if (progress.progress >= 100 && !progress.completedAt) {
      progress.completedAt = new Date();
      await Certificate.create({
        user: req.user._id,
        course: course._id,
        title: `${course.title} — Completion Certificate`,
      });
      req.user.xp += 100;
      await req.user.save();
    }

    await progress.save();
    return sendSuccess(res, progress);
  } catch {
    return sendError(res, "Progress update failed", 500);
  }
};
