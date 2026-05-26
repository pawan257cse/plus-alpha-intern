"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [method, setMethod] = useState<"otp" | "link">("link");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "" });

  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email: form.email });
      if (data.success) {
        const m = data.data?.method || "link";
        setMethod(m);
        if (m === "otp") {
          toast.success("OTP sent to your email");
          setStep("reset");
        } else {
          toast.success("Reset link sent! Check your email (and spam folder).");
        }
      }
    } catch {
      toast.error("Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/reset-password", form);
      toast.success("Password reset! Please login.");
      router.push("/login");
    } catch {
      toast.error("Reset failed — check OTP or try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="pai-gradient-border border-white/10 bg-white/60 shadow-2xl backdrop-blur-2xl dark:bg-[rgba(8,10,22,0.55)] w-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/15">
          <Mail className="h-6 w-6 text-cyan-500" />
        </div>
        <CardTitle>Reset password</CardTitle>
        <CardDescription className="pai-subtext">
          {step === "email"
            ? "We'll send reset instructions to your email"
            : method === "otp"
              ? "Enter OTP and new password"
              : "Check your inbox for the reset link"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "email" ? (
          <form onSubmit={sendReset} className="space-y-4">
            <div className="space-y-2">
              <Label>Email address</Label>
              <Input
                type="email"
                className="pai-input"
                placeholder="you@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset instructions"}
            </Button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label>OTP Code</Label>
              <Input
                className="pai-input text-center tracking-widest"
                placeholder="000000"
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value })}
                maxLength={6}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                className="pai-input"
                placeholder="Min 8 characters"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                minLength={8}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset password"}
            </Button>
          </form>
        )}
        <Link href="/login" className="mt-4 block text-center text-sm text-cyan-400 hover:underline dark:text-cyan-300">
          Back to login
        </Link>
      </CardContent>
    </Card>
  );
}
