"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { INTERNSHIP_DOMAINS } from "@/data/internship-domains";

const STEPS = ["Basic Info", "Education"];

function SignupWizardInner() {
  const router = useRouter();
  const params = useSearchParams();
  const domainId = params.get("domain") || "";
  const setAuth = useAuthStore((s) => s.setAuth);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    college: "",
    university: "",
    degree: "",
    branch: "",
    year: "",
    passingYear: "",
    internshipDomain: domainId,
    role: "student",
  });

  const selectedDomain = INTERNSHIP_DOMAINS.find((d) => d.id === form.internshipDomain);

  const validateStep = (): boolean => {
    if (step === 0) {
      if (!form.name || !form.email || !form.password || !form.phone) {
        toast.error("Please fill all required fields");
        return false;
      }
      if (form.password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return false;
      }
      if (form.password !== form.confirmPassword) {
        toast.error("Passwords do not match");
        return false;
      }
    }
    if (step === 1) {
      if (!form.college || !form.degree || !form.branch || !form.year) {
        toast.error("Please complete education details");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        college: form.college,
        university: form.university,
        degree: form.degree,
        branch: form.branch,
        year: form.year,
        passingYear: form.passingYear ? Number(form.passingYear) : undefined,
        internshipDomain: form.internshipDomain,
        role: form.role,
      });

      if (data.success) {
        if (data.data.requiresVerification) {
          toast.success("Check your email for OTP!");
          router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);
        } else if (data.data.token) {
          setAuth(data.data.user, data.data.token, data.data.refreshToken);
          toast.success("Welcome to Plus Alpha Intern! 🚀");
          router.push("/dashboard");
        }
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="pai-gradient-border border-white/10 bg-white/60 shadow-2xl backdrop-blur-2xl dark:bg-white/5">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
        <CardDescription className="pai-subtext">
          {selectedDomain
            ? `Enrolling in: ${selectedDomain.title}`
            : "Start your internship journey in 2 easy steps"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  i <= step
                    ? "bg-violet-600 text-white"
                    : "bg-white/10 text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`hidden sm:inline text-xs font-medium ${i <= step ? "text-foreground" : "pai-muted"}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-8 ${i < step ? "bg-violet-500" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={step === STEPS.length - 1 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input className="pai-input" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" className="pai-input" placeholder="you@college.edu" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input type="tel" className="pai-input" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Password *</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="pai-input pr-10"
                      placeholder="Min 8 characters"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      minLength={8}
                      required
                    />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password *</Label>
                  <Input type="password" className="pai-input" placeholder="Repeat password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>Internship Domain</Label>
                  <select
                    className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm backdrop-blur-xl pai-input"
                    value={form.internshipDomain}
                    onChange={(e) => setForm({ ...form, internshipDomain: e.target.value })}
                  >
                    <option value="">Select domain</option>
                    {INTERNSHIP_DOMAINS.map((d) => (
                      <option key={d.id} value={d.id}>{d.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>College Name *</Label>
                  <Input className="pai-input" placeholder="Your college" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>University Name</Label>
                  <Input className="pai-input" placeholder="Affiliated university" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Degree *</Label>
                    <Input className="pai-input" placeholder="B.Tech" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Branch *</Label>
                    <Input className="pai-input" placeholder="CSE" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Current Year *</Label>
                    <select
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm pai-input"
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      required
                    >
                      <option value="">Year</option>
                      {["1st", "2nd", "3rd", "4th", "Graduate"].map((y) => (
                        <option key={y} value={y}>{y} Year</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Passing Year</Label>
                    <Input type="number" className="pai-input" placeholder="2026" value={form.passingYear} onChange={(e) => setForm({ ...form, passingYear: e.target.value })} min={2020} max={2040} />
                  </div>
                </div>
                <p className="text-xs pai-muted rounded-lg bg-violet-500/10 border border-violet-500/20 p-3">
                  LinkedIn, GitHub, resume & profile photo can be added when you submit your internship task.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex gap-3">
            {step > 0 && (
              <Button type="button" variant="outline" className="flex-1 border-white/10" onClick={() => setStep((s) => s - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            )}
            <Button type="submit" className="flex-1 h-11" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : step < STEPS.length - 1 ? (
                <>Next <ChevronRight className="h-4 w-4 ml-1" /></>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm pai-subtext">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-violet-500 hover:underline">Sign in</Link>
        </p>
      </CardContent>
    </Card>
  );
}

export function SignupWizard() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-violet-500" /></div>}>
      <SignupWizardInner />
    </Suspense>
  );
}
