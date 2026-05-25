import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import {
  analyzeResume,
  recommendInternships,
  generateCareerRoadmap,
  skillGapAnalysis,
  mockInterviewReply,
  careerChat,
  isGeminiConfigured,
} from "../services/ai/gemini.js";
import { awardActivity } from "../utils/gamification.js";

export const getAiStatus = async (
  _req: AuthRequest,
  res: Response
): Promise<Response> => {
  return sendSuccess(res, {
    configured: isGeminiConfigured(),
    message: isGeminiConfigured()
      ? "Gemini AI is ready"
      : "Set GEMINI_API_KEY in backend .env (starts with AIza, from Google AI Studio)",
  });
};

const aiErrorMessage = (err: unknown): string => {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("API key") || msg.includes("GEMINI") || msg.includes("AIza")) {
    return "Invalid GEMINI_API_KEY. Use a key from Google AI Studio (starts with AIza, no extra characters).";
  }
  if (msg.includes("404") || msg.includes("not found")) {
    return "Gemini model unavailable. Check your API key and billing on Google AI Studio.";
  }
  return "AI request failed. Check GEMINI_API_KEY and try again.";
};

const rewardAiUse = async (req: AuthRequest) => {
  if (req.user) {
    awardActivity(req.user, 5, 3);
    await req.user.save();
  }
};

export const resumeAnalyzer = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { resumeText } = req.body;
    if (!resumeText?.trim()) return sendError(res, "Resume text required", 400);
    const analysis = await analyzeResume(resumeText);
    await rewardAiUse(req);
    return sendSuccess(res, { analysis });
  } catch (err) {
    console.error(err);
    return sendError(res, aiErrorMessage(err), 500);
  }
};

export const internshipRecommendation = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const skills = req.body.skills || req.user?.skills || [];
    const interests = req.body.interests || "";
    const recommendations = await recommendInternships(skills, interests);
    await rewardAiUse(req);
    return sendSuccess(res, { recommendations });
  } catch (err) {
    console.error(err);
    return sendError(res, aiErrorMessage(err), 500);
  }
};

export const careerRoadmap = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { goal } = req.body;
    const skills = req.body.skills || req.user?.skills || [];
    if (!goal) return sendError(res, "Career goal required", 400);
    const roadmap = await generateCareerRoadmap(goal, skills);
    await rewardAiUse(req);
    return sendSuccess(res, { roadmap });
  } catch (err) {
    console.error(err);
    return sendError(res, aiErrorMessage(err), 500);
  }
};

export const skillGap = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { targetRole } = req.body;
    const skills = req.body.skills || req.user?.skills || [];
    if (!targetRole) return sendError(res, "Target role required", 400);
    const analysis = await skillGapAnalysis(targetRole, skills);
    await rewardAiUse(req);
    return sendSuccess(res, { analysis });
  } catch (err) {
    console.error(err);
    return sendError(res, aiErrorMessage(err), 500);
  }
};

export const aiChatbot = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { message } = req.body;
    if (!message?.trim()) return sendError(res, "Message required", 400);
    const skills = req.user?.skills?.join(", ") || "";
    const domain = req.user?.internshipDomain || req.user?.selectedDomain || "";
    const context = `Name: ${req.user?.name}, Domain: ${domain}, Skills: ${skills}`;
    const reply = await careerChat(message.trim(), context);
    await rewardAiUse(req);
    return sendSuccess(res, { reply });
  } catch (err) {
    console.error(err);
    return sendError(res, aiErrorMessage(err), 500);
  }
};

export const interviewQuestions = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { role } = req.body;
    if (!role?.trim()) return sendError(res, "Role required", 400);
    const questions = await careerChat(
      `Generate 8 common interview questions for the role: ${role}. Number them 1-8.`
    );
    await rewardAiUse(req);
    return sendSuccess(res, { questions });
  } catch (err) {
    console.error(err);
    return sendError(res, aiErrorMessage(err), 500);
  }
};

export const mockInterview = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { role, question, answer } = req.body;
    if (!role || !question || !answer) {
      return sendError(res, "Role, question, and answer required", 400);
    }
    const feedback = await mockInterviewReply(role, question, answer);
    await rewardAiUse(req);
    return sendSuccess(res, { feedback });
  } catch (err) {
    console.error(err);
    return sendError(res, aiErrorMessage(err), 500);
  }
};
