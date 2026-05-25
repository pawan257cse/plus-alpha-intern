import { GoogleGenerativeAI } from "@google/generative-ai";

const normalizeGeminiKey = (raw?: string): string | undefined => {
  if (!raw) return undefined;
  let key = raw.trim();
  // Common typo: extra leading "A" (AAIzaSy... → AIzaSy...)
  if (key.startsWith("AAIza")) key = key.slice(1);
  if (!key.startsWith("AIza")) return undefined;
  return key;
};

const getModel = () => {
  const apiKey = normalizeGeminiKey(process.env.GEMINI_API_KEY);
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing or invalid. Get a key from Google AI Studio — it should start with AIza."
    );
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
};

export const isGeminiConfigured = (): boolean =>
  !!normalizeGeminiKey(process.env.GEMINI_API_KEY);

const generateText = async (prompt: string): Promise<string> => {
  const model = getModel();
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  if (!text?.trim()) throw new Error("Empty response from Gemini");
  return text;
};

export const analyzeResume = async (resumeText: string): Promise<string> => {
  const prompt = `You are an expert career coach. Analyze this resume and provide:
1. Overall score (0-100)
2. Strengths (bullet points)
3. Weaknesses (bullet points)
4. Specific improvements
5. ATS optimization tips

Resume:
${resumeText}

Format as clear markdown sections.`;

  return generateText(prompt);
};

export const recommendInternships = async (
  skills: string[],
  interests: string
): Promise<string> => {
  const prompt = `Based on skills: ${skills.join(", ")} and interests: ${interests},
recommend 5 internship domains/roles with:
- Role title
- Why it fits
- Skills to develop
- Estimated timeline

Format as markdown.`;

  return generateText(prompt);
};

export const generateCareerRoadmap = async (
  goal: string,
  currentSkills: string[]
): Promise<string> => {
  const prompt = `Create a detailed 6-month career roadmap for goal: "${goal}".
Current skills: ${currentSkills.join(", ")}.

Include monthly milestones, courses, projects, and certifications.
Format as markdown with phases.`;

  return generateText(prompt);
};

export const skillGapAnalysis = async (
  targetRole: string,
  currentSkills: string[]
): Promise<string> => {
  const prompt = `Analyze skill gap for target role: "${targetRole}".
Current skills: ${currentSkills.join(", ")}.

Provide:
1. Missing critical skills
2. Nice-to-have skills
3. Learning priority order
4. Resource recommendations

Format as markdown.`;

  return generateText(prompt);
};

export const careerChat = async (message: string, context?: string): Promise<string> => {
  const prompt = `You are a friendly career assistant for students on Plus Alpha Intern platform.
Help with internships, skills, resumes, and interview prep. Keep answers concise and actionable.

${context ? `Student context: ${context}\n` : ""}
Student: ${message}
Assistant:`;

  return generateText(prompt);
};

export const mockInterviewReply = async (
  role: string,
  question: string,
  answer: string
): Promise<string> => {
  const prompt = `You are interviewing for: ${role}.
Question: ${question}
Candidate answer: ${answer}

Provide constructive feedback: score (1-10), what was good, what to improve, and a model answer snippet.
Keep response concise and encouraging.`;

  return generateText(prompt);
};
