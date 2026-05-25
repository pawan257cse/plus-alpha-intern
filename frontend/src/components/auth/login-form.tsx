"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const redirectTo = searchParams.get("redirect");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", {
        ...form,
        role: "student",
      });
      if (data.success) {
        if (data.data.user.role !== "student") {
          toast.error("This account cannot use student login.");
          return;
        }
        setAuth(data.data.user, data.data.token, data.data.refreshToken);
        if (remember) localStorage.setItem("remember_email", form.email);
        toast.success(`Welcome back, ${data.data.user.name}!`);

        const redirect =
          redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")
            ? redirectTo
            : "/dashboard";

        router.push(redirect);
      }
    } catch (err: unknown) {
      const res = (err as { response?: { data?: { message?: string; data?: { requiresVerification?: boolean; email?: string } } } })
        ?.response?.data;
      if (res?.data?.requiresVerification && res.data.email) {
        toast.info("Please verify your email first");
        router.push(`/verify-otp?email=${encodeURIComponent(res.data.email)}`);
        return;
      }
      toast.error(res?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="pai-gradient-border border-white/10 bg-white/60 shadow-2xl backdrop-blur-2xl dark:bg-white/5">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription className="pai-subtext">
          Sign in to your Plus Alpha Intern student account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@email.com"
              className="pai-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pai-input pr-10"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm pai-subtext cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-white/20"
              />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-sm text-violet-500 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm pai-subtext">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-violet-500 hover:underline">
            Create account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-violet-500" /></div>}>
      <LoginFormInner />
    </Suspense>
  );
}
