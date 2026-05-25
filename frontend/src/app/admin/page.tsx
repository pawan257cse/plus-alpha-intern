"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { toast } from "sonner";
import {
  Users,
  Briefcase,
  BookOpen,
  IndianRupee,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/api";

export default function AdminPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInternships: 0,
    activeInternships: 0,
    totalCourses: 0,
    certificatesIssued: 0,
    pendingApplications: 0,
    revenue: 0,
    userGrowth: [] as { _id: string; count: number }[],
  });
  const [students, setStudents] = useState<{ _id: string; name: string; email: string; approvedByAdmin?: boolean }[]>([]);
  const [approving, setApproving] = useState<string | null>(null);
  const [tasks, setTasks] = useState<
    {
      _id: string;
      weekNumber: string;
      title: string;
      submissionUrl: string;
      status: string;
      user: { name: string; email: string };
    }[]
  >([]);
  const [reviewingTask, setReviewingTask] = useState<string | null>(null);
  const [rejectingStudent, setRejectingStudent] = useState<string | null>(null);
  const [taskRejectNote, setTaskRejectNote] = useState<Record<string, string>>({});

  const loadTasks = () => {
    api.get("/admin/tasks", { params: { status: "pending" } }).then(({ data }) => {
      if (data.success) setTasks(data.data || []);
    });
  };

  useEffect(() => {
    if (!token || user?.role !== "admin") return;
    Promise.all([
      api.get("/admin/stats"),
      api.get("/admin/users?role=student&limit=10"),
    ])
      .then(([statsRes, usersRes]) => {
        if (statsRes.data.success) setStats(statsRes.data.data);
        if (usersRes.data.success) setStudents(usersRes.data.data.users);
      })
      .catch(() => {
        toast.error("Could not load admin data. Check that the backend is running.");
      });
    loadTasks();
  }, [token, user, router]);

  const reviewTask = async (id: string, status: "approved" | "rejected") => {
    setReviewingTask(id);
    try {
      const adminNote = status === "rejected" ? taskRejectNote[id]?.trim() : undefined;
      if (status === "rejected" && !adminNote) {
        toast.error("Add a rejection reason before rejecting");
        return;
      }
      const { data } = await api.patch(`/admin/tasks/${id}/review`, { status, adminNote });
      if (data.success) {
        toast.success(status === "approved" ? "Task approved" : "Task rejected");
        setTasks((prev) => prev.filter((t) => t._id !== id));
        setTaskRejectNote((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    } catch {
      toast.error("Review failed");
    } finally {
      setReviewingTask(null);
    }
  };

  const rejectStudent = async (id: string) => {
    const reason = window.prompt("Rejection reason (optional):");
    if (reason === null) return;
    setRejectingStudent(id);
    try {
      const { data } = await api.patch(`/admin/users/${id}/reject`, { reason });
      if (data.success) {
        toast.success("Student rejected");
        setStudents((prev) => prev.filter((s) => s._id !== id));
      }
    } catch {
      toast.error("Rejection failed");
    } finally {
      setRejectingStudent(null);
    }
  };

  const approveStudent = async (id: string) => {
    setApproving(id);
    try {
      const { data } = await api.patch(`/admin/users/${id}/approve`, {});
      if (data.success) {
        toast.success("Student approved & email sent!");
        setStudents((prev) =>
          prev.map((s) => (s._id === id ? { ...s, approvedByAdmin: true } : s))
        );
      }
    } catch {
      toast.error("Approval failed");
    } finally {
      setApproving(null);
    }
  };

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users },
    { label: "Active Internships", value: stats.activeInternships, icon: Briefcase },
    { label: "Certificates Issued", value: stats.certificatesIssued, icon: BookOpen },
    { label: "Revenue (₹)", value: stats.revenue, icon: IndianRupee },
    { label: "Pending Applications", value: stats.pendingApplications, icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Use the sidebar for full management panels</p>
      </div>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <c.icon className="h-8 w-8 text-violet-400" />
              <div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="text-2xl font-bold">{c.value.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Student Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="pai-subtext text-sm">No students yet.</p>
          ) : (
            <ul className="space-y-2">
              {students.map((s) => (
                <li key={s._id} className="flex items-center justify-between rounded-lg border border-white/10 p-3">
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs pai-muted">{s.email}</p>
                  </div>
                  {s.approvedByAdmin ? (
                    <span className="text-xs text-emerald-500 font-medium">Approved ✓</span>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={approving === s._id}
                        onClick={() => approveStudent(s._id)}
                      >
                        {approving === s._id ? "..." : "Approve"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={rejectingStudent === s._id}
                        onClick={() => rejectStudent(s._id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-violet-400" />
            Task submissions (pending review)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Students can submit tasks only after you approve them. Approve or reject each
            submission below.
          </p>
          {tasks.length === 0 ? (
            <p className="text-sm pai-subtext">No pending task submissions.</p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((t) => (
                <li
                  key={t._id}
                  className="rounded-lg border border-white/10 p-4 space-y-2"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{t.title}</p>
                      <p className="text-xs pai-muted">
                        {t.user?.name} · {t.user?.email}
                      </p>
                      <p className="text-xs text-violet-400">{t.weekNumber}</p>
                    </div>
                    <Button
                      size="sm"
                      disabled={reviewingTask === t._id}
                      onClick={() => reviewTask(t._id, "approved")}
                    >
                      Approve
                    </Button>
                  </div>
                  <Input
                    placeholder="Rejection reason (required to reject)"
                    className="mt-2 h-9 text-sm"
                    value={taskRejectNote[t._id] || ""}
                    onChange={(e) =>
                      setTaskRejectNote((prev) => ({ ...prev, [t._id]: e.target.value }))
                    }
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    disabled={reviewingTask === t._id}
                    onClick={() => reviewTask(t._id, "rejected")}
                  >
                    Reject with reason
                  </Button>
                  <a
                    href={t.submissionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-violet-500 hover:underline break-all"
                  >
                    {t.submissionUrl}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth (30 days)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="_id" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "Users", value: stats.totalUsers },
                  { name: "Jobs", value: stats.totalInternships },
                  { name: "Courses", value: stats.totalCourses },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
