"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

function AdminLoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const redirectTo = searchParams.get("redirect");

  useEffect(() => {
    if (token && user?.role === "admin") {
      router.replace(redirectTo?.startsWith("/admin") ? redirectTo : "/admin/dashboard");
    }
  }, [token, user, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: "admin",
      });
      if (data.success) {
        if (data.data.user.role !== "admin") {
          toast.error("This account is not authorized for admin access.");
          return;
        }
        setAuth(data.data.user, data.data.token, data.data.refreshToken);
        toast.success(`Welcome, ${data.data.user.name}`);

        const redirect =
          redirectTo && redirectTo.startsWith("/admin") && !redirectTo.startsWith("//")
            ? redirectTo
            : "/admin/dashboard";

        router.push(redirect);
      }
    } catch (err: unknown) {
      const res = (err as { response?: { data?: { message?: string } } })?.response?.data;
      toast.error(res?.message || "Admin login failed. Check email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="pai-gradient-border border-white/10 bg-white/60 shadow-2xl backdrop-blur-2xl dark:bg-white/5">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20">
          <Shield className="h-6 w-6 text-violet-500" />
        </div>
        <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
        <CardDescription className="pai-subtext">
          Authorized administrators only
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@plusalphaintern.com"
              className="pai-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative">
              <Input
                id="admin-password"
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
          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in as Admin"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm pai-subtext">
          Student account?{" "}
          <Link href="/login" className="font-medium text-violet-500 hover:underline">
            Student login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export function AdminLoginForm() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-violet-500" /></div>}>
      <AdminLoginFormInner />
    </Suspense>
  );
}
