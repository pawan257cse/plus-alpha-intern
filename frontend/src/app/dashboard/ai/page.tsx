"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, FileText, Map, MessageCircle, Target, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

const tools = [
  {
    id: "resume",
    title: "Resume Analyzer",
    description: "Get AI feedback on your resume",
    icon: FileText,
    endpoint: "/ai/resume-analyzer",
    field: "resumeText",
    placeholder: "Paste your resume text here...",
    multiline: true,
  },
  {
    id: "recommend",
    title: "Internship Recommendations",
    description: "AI-matched internship domains",
    icon: Target,
    endpoint: "/ai/internship-recommendation",
    field: "interests",
    placeholder: "Your interests (e.g. web dev, startups)...",
  },
  {
    id: "roadmap",
    title: "Career Roadmap",
    description: "6-month personalized plan",
    icon: Map,
    endpoint: "/ai/career-roadmap",
    field: "goal",
    placeholder: "Target role (e.g. Full Stack Developer)...",
  },
  {
    id: "skillgap",
    title: "Skill Gap Analysis",
    description: "What to learn for your dream role",
    icon: Brain,
    endpoint: "/ai/skill-gap",
    field: "targetRole",
    placeholder: "Target role...",
  },
  {
    id: "interview",
    title: "Mock Interview",
    description: "Practice with AI feedback",
    icon: MessageCircle,
    endpoint: "/ai/mock-interview",
    fields: ["role", "question", "answer"],
  },
];

export default function AIToolsPage() {
  const { user } = useAuthStore();
  const [active, setActive] = useState(tools[0].id);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [aiReady, setAiReady] = useState<boolean | null>(null);
  const [aiStatusMsg, setAiStatusMsg] = useState("");

  useEffect(() => {
    api.get("/ai/status").then(({ data }) => {
      if (data.success) {
        setAiReady(data.data.configured);
        setAiStatusMsg(data.data.message);
      }
    }).catch(() => setAiReady(false));
  }, []);
  const [form, setForm] = useState({
    resumeText: "",
    interests: "",
    goal: "",
    targetRole: "",
    role: "",
    question: "",
    answer: "",
  });

  const current = tools.find((t) => t.id === active)!;

  const runAI = async () => {
    setLoading(true);
    setResult("");
    try {
      let body: Record<string, string> = {};
      if (current.id === "interview") {
        body = { role: form.role, question: form.question, answer: form.answer };
      } else if (current.field) {
        body = { [current.field]: form[current.field as keyof typeof form] as string };
      }
      body.skills = user?.skills?.join(", ") || "";

      const { data } = await api.post(current.endpoint, body);
      if (data.success) {
        const text =
          data.data.analysis ||
          data.data.recommendations ||
          data.data.roadmap ||
          data.data.feedback ||
          JSON.stringify(data.data, null, 2);
        setResult(text);
        toast.success("Analysis complete!");
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "AI request failed. Check GEMINI_API_KEY in backend .env (must start with AIza).";
      toast.error(msg);
      setResult(`## Error\n\n${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">AI Career Tools</h1>
        <p className="text-muted-foreground">Powered by Google Gemini</p>
        {aiReady === false && (
          <p className="mt-2 text-sm text-amber-400">
            {aiStatusMsg ||
              "AI is not configured. Admin: set GEMINI_API_KEY in backend .env (from Google AI Studio, starts with AIza)."}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <motion.button
            key={tool.id}
            onClick={() => {
              setActive(tool.id);
              setResult("");
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`cursor-pointer text-left transition-all ${
                active === tool.id ? "border-violet-500/50 ring-1 ring-violet-500/30" : ""
              }`}
            >
              <CardHeader className="pb-2">
                <tool.icon className="mb-2 h-6 w-6 text-violet-400" />
                <CardTitle className="text-base">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
            </Card>
          </motion.button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{current.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {current.id === "interview" ? (
            <>
              <Input placeholder="Role (e.g. Frontend Developer)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              <Input placeholder="Interview question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
              <textarea
                className="flex min-h-[100px] w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm backdrop-blur-xl"
                placeholder="Your answer..."
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
              />
            </>
          ) : current.multiline ? (
            <textarea
              className="flex min-h-[150px] w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm backdrop-blur-xl"
              placeholder={current.placeholder}
              value={form[current.field as keyof typeof form] as string}
              onChange={(e) => setForm({ ...form, [current.field!]: e.target.value })}
            />
          ) : (
            <Input
              placeholder={current.placeholder}
              value={form[current.field as keyof typeof form] as string}
              onChange={(e) => setForm({ ...form, [current.field!]: e.target.value })}
            />
          )}
          <Button onClick={runAI} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Run Analysis"}
          </Button>
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose prose-invert max-w-none rounded-xl border border-white/10 bg-white/5 p-6 text-sm whitespace-pre-wrap"
            >
              {result}
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Career Chatbot</CardTitle>
          <CardDescription>Ask anything about internships, skills, or interviews</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChatbotPanel />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interview Questions Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InterviewQuestionsPanel />
        </CardContent>
      </Card>
    </div>
  );
}

function ChatbotPanel() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!message.trim()) return;
    const userMsg = message.trim();
    setMessage("");
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const { data } = await api.post("/ai/chat", { message: userMsg });
      if (data.success) {
        setMessages((m) => [...m, { role: "ai", text: data.data.reply }]);
      }
    } catch {
      toast.error("Chat failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">Start a conversation...</p>
        )}
        {messages.map((m, i) => (
          <p key={i} className={`text-sm ${m.role === "user" ? "text-violet-300" : ""}`}>
            <strong>{m.role === "user" ? "You" : "AI"}:</strong> {m.text}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          className="pai-input flex-1"
          placeholder="Ask about careers, resumes, internships..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <Button onClick={send} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
        </Button>
      </div>
    </>
  );
}

function InterviewQuestionsPanel() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!role.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/ai/interview-questions", { role });
      if (data.success) setQuestions(data.data.questions);
    } catch {
      toast.error("Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Input
          className="pai-input flex-1"
          placeholder="Target role (e.g. Data Analyst)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <Button onClick={generate} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
        </Button>
      </div>
      {questions && (
        <pre className="whitespace-pre-wrap rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
          {questions}
        </pre>
      )}
    </>
  );
}
