"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

export default function AdminNotificationsPage() {
  const [form, setForm] = useState({
    title: "",
    message: "",
    role: "student",
    link: "/dashboard/notifications",
  });
  const [sending, setSending] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data } = await api.post("/admin/notifications/broadcast", form);
      if (data.success) {
        toast.success(`Sent to ${data.data.sent} users`);
        setForm({ title: "", message: "", role: "student", link: "/dashboard/notifications" });
      }
    } catch {
      toast.error("Broadcast failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold">
        <Bell className="h-7 w-7 text-violet-400" />
        Notification System
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Send in-app notification</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={send} className="max-w-lg space-y-4">
            <div className="space-y-1">
              <Label>Target role</Label>
              <select
                className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="student">Students</option>
                <option value="company">Companies</option>
                <option value="">All users</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-1">
              <Label>Message</Label>
              <Input value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </div>
            <div className="space-y-1">
              <Label>Link (optional)</Label>
              <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
            </div>
            <p className="text-xs text-muted-foreground">
              Email/SMS: configure SMTP in Settings. Push notifications can be added via a service like Firebase.
            </p>
            <Button type="submit" disabled={sending}>
              {sending ? "Sending..." : "Broadcast"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
