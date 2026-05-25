"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Plus, Trash2, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/api";
import { INTERNSHIP_DOMAINS } from "@/data/internship-domains";

interface DomainTaskRow {
  _id: string;
  domainId: string;
  weekNumber: string;
  title: string;
  description: string;
  dueDate?: string;
  feeAmount?: number;
  sortOrder: number;
  isActive: boolean;
}

const emptyForm = {
  domainId: INTERNSHIP_DOMAINS[0]?.id || "",
  weekNumber: "",
  title: "",
  description: "",
  dueDate: "",
  feeAmount: "",
  sortOrder: "0",
};

export default function AdminDomainTasksPage() {
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<DomainTaskRow[]>([]);
  const [filterDomain, setFilterDomain] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get("/admin/domain-tasks", {
        params: filterDomain ? { domainId: filterDomain } : {},
      })
      .then(({ data }) => {
        if (data.success) setTasks(data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!token || user?.role !== "admin") return;
    load();
  }, [token, user, filterDomain]);

  const domainTitle = (id: string) =>
    INTERNSHIP_DOMAINS.find((d) => d.id === id)?.title || id;

  const resetForm = () => {
    setForm({ ...emptyForm, domainId: filterDomain || emptyForm.domainId });
    setEditingId(null);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.weekNumber.trim() || !form.title.trim()) {
      toast.error("Week and title are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        domainId: form.domainId,
        weekNumber: form.weekNumber,
        title: form.title,
        description: form.description,
        dueDate: form.dueDate || undefined,
        feeAmount: form.feeAmount ? Number(form.feeAmount) : undefined,
        sortOrder: Number(form.sortOrder) || 0,
        isActive: true,
      };
      if (editingId) {
        await api.put(`/admin/domain-tasks/${editingId}`, payload);
        toast.success("Task updated");
      } else {
        await api.post("/admin/domain-tasks", payload);
        toast.success("Task assigned to domain");
      }
      resetForm();
      load();
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (t: DomainTaskRow) => {
    setEditingId(t._id);
    setForm({
      domainId: t.domainId,
      weekNumber: t.weekNumber,
      title: t.title,
      description: t.description || "",
      dueDate: t.dueDate ? new Date(t.dueDate).toISOString().slice(0, 10) : "",
      feeAmount: t.feeAmount != null ? String(t.feeAmount) : "",
      sortOrder: String(t.sortOrder),
    });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this domain task?")) return;
    try {
      await api.delete(`/admin/domain-tasks/${id}`);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  const formatDue = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Link href="/admin" className="mb-6 inline-flex items-center gap-2 text-sm text-violet-400">
        <ArrowLeft className="h-4 w-4" /> Admin
      </Link>

      <h1 className="mb-2 text-2xl font-bold">Domain Task Assignment</h1>
      <p className="mb-6 text-muted-foreground">
        Assign tasks per internship domain — week, title, due date, and optional fee. Students
        see tasks for their domain on Submit Task.
      </p>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5" />
              {editingId ? "Edit task" : "Add task to domain"}
            </CardTitle>
            <CardDescription>Which domain, which week, how much (optional)</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={save} className="space-y-3">
              <select
                className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm"
                value={form.domainId}
                onChange={(e) => setForm({ ...form, domainId: e.target.value })}
              >
                {INTERNSHIP_DOMAINS.map((d) => (
                  <option key={d.id} value={d.id} className="bg-slate-900">
                    {d.title}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Week (e.g. Week 1)"
                value={form.weekNumber}
                onChange={(e) => setForm({ ...form, weekNumber: e.target.value })}
              />
              <Input
                placeholder="Task title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                className="min-h-[80px] w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm"
                placeholder="Description / instructions"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Fee ₹ (optional)"
                  value={form.feeAmount}
                  onChange={(e) => setForm({ ...form, feeAmount: e.target.value })}
                />
              </div>
              <Input
                type="number"
                placeholder="Sort order"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? "Update" : "Add task"}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter by domain</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm"
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
            >
              <option value="" className="bg-slate-900">
                All domains
              </option>
              {INTERNSHIP_DOMAINS.map((d) => (
                <option key={d.id} value={d.id} className="bg-slate-900">
                  {d.title}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
      ) : tasks.length === 0 ? (
        <p className="text-muted-foreground">No tasks assigned yet. Add one above.</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((t) => (
            <Card key={t._id}>
              <CardContent className="flex flex-wrap items-start justify-between gap-3 pt-6">
                <div>
                  <p className="text-xs text-violet-400">{domainTitle(t.domainId)} · {t.weekNumber}</p>
                  <p className="font-semibold">{t.title}</p>
                  {t.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    Due: {formatDue(t.dueDate)}
                    {t.feeAmount != null && t.feeAmount > 0 && (
                      <> · Fee: ₹{t.feeAmount}</>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(t)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => remove(t._id)}>
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
