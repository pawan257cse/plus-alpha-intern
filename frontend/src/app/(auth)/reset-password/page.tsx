"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const email = params.get("email") || "";
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, token, newPassword: password });
      toast.success("Password updated! Please sign in.");
      router.push("/login");
    } catch {
      toast.error("Invalid or expired reset link");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <Card className="pai-gradient-border w-full">
        <CardContent className="py-8 text-center">
          <p className="pai-subtext">Invalid reset link.</p>
          <Link href="/forgot-password" className="mt-4 inline-block text-violet-500 hover:underline">
            Request a new link
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="pai-gradient-border border-white/10 bg-white/60 shadow-2xl backdrop-blur-2xl dark:bg-white/5 w-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/15">
          <KeyRound className="h-6 w-6 text-violet-500" />
        </div>
        <CardTitle>Set new password</CardTitle>
        <CardDescription className="pai-subtext">Choose a strong password for {email}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" className="pai-input" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
          </div>
          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input type="password" className="pai-input" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
          </Button>
        </form>
        <Link href="/login" className="mt-4 block text-center text-sm text-violet-500 hover:underline">
          Back to login
        </Link>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
