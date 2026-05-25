import { Router } from "express";
import {
  resumeAnalyzer,
  internshipRecommendation,
  careerRoadmap,
  skillGap,
  mockInterview,
  aiChatbot,
  interviewQuestions,
  getAiStatus,
} from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/status", getAiStatus);
router.post("/resume-analyzer", resumeAnalyzer);
router.post("/internship-recommendation", internshipRecommendation);
router.post("/career-roadmap", careerRoadmap);
router.post("/skill-gap", skillGap);
router.post("/mock-interview", mockInterview);
router.post("/chat", aiChatbot);
router.post("/interview-questions", interviewQuestions);

export default router;
