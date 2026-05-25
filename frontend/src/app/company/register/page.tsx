"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Building2 } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

export default function CompanyRegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    companyName: "",
    companyWebsite: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/company/register", form);
      if (data.success) {
        setAuth(data.data.user, data.data.token, data.data.refreshToken);
        toast.success("Company registered! Awaiting verification.");
        router.push("/company/dashboard");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="pai-gradient-border border-white/10 bg-white/60 shadow-2xl backdrop-blur-2xl dark:bg-white/5 w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/15">
            <Building2 className="h-6 w-6 text-violet-500" />
          </div>
          <CardTitle>Register your company</CardTitle>
          <CardDescription className="pai-subtext">Post internships and hire talented students</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Company Name *</Label>
              <Input className="pai-input" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Contact Person *</Label>
              <Input className="pai-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Work Email *</Label>
              <Input type="email" className="pai-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input className="pai-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input className="pai-input" placeholder="https://company.com" value={form.companyWebsite} onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Password *</Label>
              <Input type="password" className="pai-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={8} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Company Account"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm pai-subtext">
            Already registered?{" "}
            <Link href="/login?tab=company" className="text-violet-500 hover:underline font-medium">
              Company login
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
