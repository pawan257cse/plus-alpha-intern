"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Briefcase,
  GraduationCap,
  Trophy,
  MessageSquare,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Briefcase,
    title: "Premium Internships",
    description: "Apply to curated internships from top companies with one-click applications.",
  },
  {
    icon: Brain,
    title: "AI Career Coach",
    description: "Resume analyzer, skill gap analysis, mock interviews powered by Gemini AI.",
  },
  {
    icon: GraduationCap,
    title: "Learn & Certify",
    description: "Video courses, quizzes, assignments, and verified certificates.",
  },
  {
    icon: Trophy,
    title: "Gamification",
    description: "Earn XP, badges, streaks, and climb the leaderboard.",
  },
  {
    icon: MessageSquare,
    title: "Real-time Chat",
    description: "Connect with companies and mentors instantly.",
  },
  {
    icon: Shield,
    title: "Verified Certificates",
    description: "Blockchain-style verification IDs for every achievement.",
  },
];

export function Features() {
  return (
    <section id="features" className="px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold md:text-5xl">
            Everything to{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              accelerate your career
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Built for students who want more than just another job board.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="group h-full hover:-translate-y-1 hover:shadow-cyan-500/10">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600/20 to-emerald-600/20 transition-colors group-hover:from-cyan-600/40 group-hover:to-emerald-600/40">
                    <feature.icon className="h-6 w-6 text-cyan-300" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
