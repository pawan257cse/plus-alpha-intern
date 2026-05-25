"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PageShell } from "@/components/layout/page-shell";
import { RequireAuth } from "@/components/auth/require-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, IndianRupee, CheckCircle2, Clock, Lock } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/api";
import { INTERNSHIP_DOMAINS } from "@/data/internship-domains";
import { usePaymentFlow } from "@/hooks/use-payment-flow";

interface TaskRow {
  _id: string;
  weekNumber: string;
  title: string;
  status: string;
  createdAt: string;
}

interface AssignedTask {
  _id: string;
  weekNumber: string;
  title: string;
  description?: string;
  dueDate?: string;
  feeAmount?: number;
}

function SubmitTaskForm() {
  const { user, updateUser } = useAuthStore();
  const { loading: paymentLoading, paying, status, pay, taskPaid } = usePaymentFlow();
  const [submitting, setSubmitting] = useState(false);
  const [myTasks, setMyTasks] = useState<TaskRow[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<AssignedTask[]>([]);
  const [form, setForm] = useState({
    weekNumber: "",
    title: "",
    submissionUrl: "",
    notes: "",
    domain: user?.internshipDomain || user?.selectedDomain || "",
    linkedin: "",
    github: "",
    resumeUrl: "",
  });

  const approved = user?.approvedByAdmin;
  const taskFee = status?.fees.taskFee ?? 0;
  const needsPayment = status && !taskPaid;

  useEffect(() => {
    if (!approved) return;
    api.get("/users/tasks/me").then(({ data }) => {
      if (data.success) setMyTasks(data.data || []);
    }).catch(() => {});
    api
      .get("/users/domain-tasks", {
        params: { domainId: form.domain },
      })
      .then(({ data }) => {
        if (data.success) setAssignedTasks(data.data.tasks || []);
      })
      .catch(() => {});
  }, [approved, form.domain]);

  const pickAssignedTask = (t: AssignedTask) => {
    setForm((f) => ({
      ...f,
      weekNumber: t.weekNumber,
      title: t.title,
      notes: t.description || f.notes,
    }));
    toast.info(`Selected: ${t.title}`);
  };

  if (!approved) {
    return (
      <div className="mx-auto max-w-lg text-center space-y-4 py-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
          <Lock className="h-8 w-8 text-amber-500" />
        </div>
        <h2 className="text-xl font-bold">Task submission locked</h2>
        <p className="text-sm text-muted-foreground">
          Submit Task unlocks after admin approves your registration. Check your dashboard for
          approval status.
        </p>
        <Link href="/dashboard">
          <Button>Back to dashboard</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (needsPayment) {
      const paid = await pay("task");
      if (!paid) return;
    }

    setSubmitting(true);
    try {
      await api.patch("/users/profile", {
        linkedin: form.linkedin,
        github: form.github,
        resumeUrl: form.resumeUrl,
      });

      const { data } = await api.post("/users/tasks/submit", {
        weekNumber: form.weekNumber,
        title: form.title,
        submissionUrl: form.submissionUrl,
        notes: form.notes,
        domain: form.domain,
      });

      if (data.success) {
        updateUser({ xp: (user.xp || 0) + 25, coins: (user.coins || 0) + 10 });
        toast.success("Task submitted! Admin will review within 48 hours.");
        setMyTasks((prev) => [data.data, ...prev]);
        setForm({
          weekNumber: "",
          title: "",
          submissionUrl: "",
          notes: "",
          domain: form.domain,
          linkedin: form.linkedin,
          github: form.github,
          resumeUrl: form.resumeUrl,
        });
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || "Failed to submit task");
    } finally {
      setSubmitting(false);
    }
  };

  const submitLabel = needsPayment
    ? `Pay ₹${taskFee} & Submit Task`
    : submitting
      ? "Submitting..."
      : "Submit Task";

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="pai-gradient-border rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
        <div className="flex items-start gap-3">
          <IndianRupee className="mt-0.5 h-6 w-6 shrink-0 text-violet-400" />
          <div>
            <h2 className="font-semibold text-foreground">
              Registration was <span className="text-emerald-500">free</span> — pay on task only
            </h2>
            <p className="mt-1 text-sm pai-subtext">
              Logged in as <strong>{user?.email}</strong>. Internship fee (₹{taskFee || "—"}) is
              collected only when you submit your final task, not at signup.
            </p>
            {taskPaid && (
              <p className="mt-2 flex items-center gap-1 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Task fee paid — ready to submit
              </p>
            )}
          </div>
        </div>
      </div>

      {assignedTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tasks assigned for your domain</CardTitle>
            <CardDescription className="pai-subtext">
              Admin-assigned schedule — click a task to fill the form
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {assignedTasks.map((t) => (
              <button
                key={t._id}
                type="button"
                onClick={() => pickAssignedTask(t)}
                className="w-full rounded-lg border border-violet-500/20 bg-violet-500/5 p-3 text-left text-sm hover:border-violet-500/40"
              >
                <p className="font-medium text-violet-300">
                  {t.weekNumber} — {t.title}
                </p>
                {t.description && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{t.description}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {t.dueDate &&
                    `Due: ${new Date(t.dueDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}`}
                  {t.feeAmount != null && t.feeAmount > 0 && ` · Fee: ₹${t.feeAmount}`}
                </p>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {myTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your submissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {myTasks.map((t) => (
              <div
                key={t._id}
                className="flex items-center justify-between rounded-lg border border-white/10 p-3 text-sm"
              >
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.weekNumber}</p>
                </div>
                <span
                  className={
                    t.status === "approved"
                      ? "text-emerald-500"
                      : t.status === "rejected"
                        ? "text-red-400"
                        : "text-amber-500"
                  }
                >
                  {t.status === "approved" && <CheckCircle2 className="inline h-3 w-3 mr-1" />}
                  {t.status === "pending" && <Clock className="inline h-3 w-3 mr-1" />}
                  {t.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="pai-gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Upload className="h-6 w-6 text-violet-400" />
            Submit Internship Task
          </CardTitle>
          <CardDescription className="pai-subtext">
            Upload your final project link after admin approval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium pai-subtext">Internship domain</label>
              <select
                className="pai-input flex h-11 w-full rounded-xl px-4 text-sm text-foreground"
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
              >
                {INTERNSHIP_DOMAINS.map((d) => (
                  <option key={d.id} value={d.id} className="bg-slate-900">
                    {d.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 space-y-3">
              <p className="text-sm font-semibold text-violet-600 dark:text-violet-300">
                Profile details (required)
              </p>
              <Input
                placeholder="LinkedIn URL"
                value={form.linkedin}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                required
              />
              <Input
                placeholder="GitHub URL"
                value={form.github}
                onChange={(e) => setForm({ ...form, github: e.target.value })}
                required
              />
              <Input
                placeholder="Resume link (Google Drive / PDF)"
                value={form.resumeUrl}
                onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
                required
              />
            </div>
            <Input
              placeholder="Week number (e.g. Week 4 — Final)"
              value={form.weekNumber}
              onChange={(e) => setForm({ ...form, weekNumber: e.target.value })}
              required
            />
            <Input
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <Input
              placeholder="Google Drive / GitHub / Live demo link"
              value={form.submissionUrl}
              onChange={(e) => setForm({ ...form, submissionUrl: e.target.value })}
              required
            />
            <textarea
              className="pai-input flex min-h-[80px] w-full rounded-xl p-4 text-sm text-foreground"
              placeholder="Notes for mentor (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={submitting || paying || paymentLoading}
            >
              {paying || submitting ? "Please wait..." : submitLabel}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SubmitTaskPage() {
  return (
    <PageShell>
      <RequireAuth>
        <SubmitTaskForm />
      </RequireAuth>
    </PageShell>
  );
}
