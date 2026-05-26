"use client";

import { motion } from "framer-motion";
import { BrandLogo } from "@/components/brand/logo";
import { AnimatedBackground } from "@/components/layout/animated-background";
import { Sparkles, Shield, Building2, GraduationCap } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const features = [
  { icon: GraduationCap, text: "Industry-ready internship programs" },
  { icon: Shield, text: "Verified certificates & mentor support" },
  { icon: Building2, text: "500+ partner companies hiring interns" },
  { icon: Sparkles, text: "AI-powered learning & task tracking" },
];

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Left panel — branding */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex lg:w-[48%] xl:w-[52%] flex-col justify-between p-12 xl:p-16"
        >
          <div>
            <BrandLogo size={44} />
          </div>
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-foreground">
                Launch your career with{" "}
                <span className="pai-brand-text">real internships</span>
              </h1>
              <p className="mt-4 text-lg pai-subtext max-w-md">
                Join thousands of students building portfolios, earning certificates, and landing offers through Plus Alpha Intern.
              </p>
            </div>
            <ul className="space-y-4">
              {features.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-foreground/80">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-500 dark:text-cyan-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs pai-muted">© {new Date().getFullYear()} Plus Alpha Intern. All rights reserved.</p>
        </motion.div>

        {/* Right panel — form */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 lg:py-16">
          <div className="mb-6 flex justify-center lg:hidden">
            <BrandLogo size={40} />
          </div>
          {(title || subtitle) && (
            <div className="mb-6 text-center lg:hidden max-w-md">
              {title && <h2 className="text-2xl font-bold">{title}</h2>}
              {subtitle && <p className="mt-1 text-sm pai-subtext">{subtitle}</p>}
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full max-w-md"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
