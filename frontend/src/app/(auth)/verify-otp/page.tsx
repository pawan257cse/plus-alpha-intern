"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

function VerifyOTPForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";
  const setAuth = useAuthStore((s) => s.setAuth);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp });
      if (data.success) {
        setAuth(data.data.user, data.data.token, data.data.refreshToken);
        toast.success("Email verified!");
        const role = data.data.user.role;
        router.push(
          role === "admin" ? "/admin/dashboard" : role === "company" ? "/company/dashboard" : "/dashboard"
        );
      }
    } catch {
      toast.error("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      await api.post("/auth/resend-otp", { email });
      toast.success("OTP resent!");
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <Card className="pai-gradient-border border-white/10 bg-white/60 shadow-2xl backdrop-blur-2xl dark:bg-white/5 w-full">
      <CardHeader className="text-center">
        <CardTitle>Verify your email</CardTitle>
        <CardDescription className="pai-subtext">Enter the 6-digit code sent to {email}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          <Input
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="pai-input text-center text-2xl tracking-[0.5em]"
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Continue"}
          </Button>
        </form>
        <button type="button" onClick={resendOTP} className="mt-4 w-full text-center text-sm text-violet-500 hover:underline">
          Resend OTP
        </button>
        <Link href="/login" className="mt-4 block text-center text-sm pai-muted hover:underline">
          Back to login
        </Link>
      </CardContent>
    </Card>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto text-violet-500" />}>
      <VerifyOTPForm />
    </Suspense>
  );
}
