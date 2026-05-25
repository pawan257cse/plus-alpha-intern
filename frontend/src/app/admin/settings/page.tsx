"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/api";

export default function AdminSettingsPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    internshipTotalFee: 999,
    supportEmail: "plusalphaintern@gmail.com",
    supportPhone: "",
    address: "Jaipur, Rajasthan, India",
    razorpayEnabled: true,
    upiId: "",
    upiPayeeName: "Plus Alpha Intern",
    paymentInstructions:
      "Pay via UPI using the ID below, then submit your transaction ID for verification.",
  });

  useEffect(() => {
    if (!token || user?.role !== "admin") return;
    api.get("/admin/settings").then(({ data }) => {
      if (data.success) {
        const s = data.data.settings;
        setForm({
          internshipTotalFee: s.internshipTotalFee,
          supportEmail: s.supportEmail,
          supportPhone: s.supportPhone || "",
          address: s.address,
          razorpayEnabled: s.razorpayEnabled,
          upiId: s.upiId || "",
          upiPayeeName: s.upiPayeeName || "Plus Alpha Intern",
          paymentInstructions: s.paymentInstructions || "",
        });
      }
    }).finally(() => setLoading(false));
  }, [token, user, router]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put("/admin/settings", {
        ...form,
        registrationFeePercent: 0,
        taskFeePercent: 100,
      });
      if (data.success) toast.success("Fee updated — 100% charged on task submit");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Link href="/admin" className="mb-6 inline-flex items-center gap-2 text-sm text-violet-400">
        <ArrowLeft className="h-4 w-4" /> Admin
      </Link>
      <h1 className="mb-2 text-2xl font-bold">
        Fee Settings — <span className="pai-brand-text">Plus Alpha Intern</span>
      </h1>
      <p className="mb-8 text-muted-foreground">
        Students pay <strong>only when submitting their final task</strong>. Registration is always free.
      </p>

      <Card className="mx-auto max-w-lg pai-gradient-border">
        <CardHeader>
          <CardTitle>Internship fee (₹)</CardTitle>
          <CardDescription>
            This full amount is collected at task submission — not at registration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <Input
              type="number"
              min={1}
              value={form.internshipTotalFee}
              onChange={(e) =>
                setForm({ ...form, internshipTotalFee: Number(e.target.value) })
              }
            />
            <Input
              value={form.supportEmail}
              onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
              placeholder="Support email"
            />
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Address"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.razorpayEnabled}
                onChange={(e) => setForm({ ...form, razorpayEnabled: e.target.checked })}
              />
              Enable Razorpay (online checkout)
            </label>

            <div className="border-t border-white/10 pt-4 space-y-3">
              <p className="text-sm font-medium">UPI for manual payments</p>
              <Input
                value={form.upiId}
                onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                placeholder="UPI ID (e.g. name@paytm)"
              />
              <Input
                value={form.upiPayeeName}
                onChange={(e) => setForm({ ...form, upiPayeeName: e.target.value })}
                placeholder="Payee name shown to students"
              />
              <textarea
                className="min-h-[80px] w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm"
                value={form.paymentInstructions}
                onChange={(e) =>
                  setForm({ ...form, paymentInstructions: e.target.value })
                }
                placeholder="Payment instructions for students"
              />
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
