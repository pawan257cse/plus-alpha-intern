"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Briefcase, Loader2, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

interface Internship {
  _id: string;
  title: string;
  company: string;
  domain: string;
  location: string;
  stipend: number;
  status: string;
}

const empty = {
  title: "",
  company: "",
  domain: "Web Development",
  location: "",
  stipend: 0,
  duration: "3 months",
  description: "",
  isRemote: false,
};

export default function AdminInternshipsPage() {
  const [list, setList] = useState<Internship[]>([]);
  const [apps, setApps] = useState<{ _id: string; status: string; applicant: { name: string }; internship: { title: string } }[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [creating, setCreating] = useState(false);

  const load = () => {
    Promise.all([
      api.get("/admin/internships"),
      api.get("/admin/applications"),
    ]).then(([intRes, appRes]) => {
      if (intRes.data.success) setList(intRes.data.data || []);
      if (appRes.data.success) setApps(appRes.data.data || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data } = await api.post("/admin/internships", {
        ...form,
        stipend: Number(form.stipend),
        requirements: [],
        skills: [],
      });
      if (data.success) {
        toast.success("Internship created");
        setForm(empty);
        load();
      }
    } catch {
      toast.error("Create failed");
    } finally {
      setCreating(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete internship?")) return;
    await api.delete(`/admin/internships/${id}`);
    toast.success("Deleted");
    load();
  };

  const updateAppStatus = async (id: string, status: string) => {
    await api.patch(`/internships/applications/${id}/status`, { status });
    toast.success("Application updated");
    load();
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <Briefcase className="h-7 w-7 text-violet-400" />
        Internship Management
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" /> Create internship
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={create} className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-1">
              <Label>Company</Label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
            </div>
            <div className="space-y-1">
              <Label>Domain</Label>
              <Input value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Location</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <Button type="submit" disabled={creating}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Posted internships</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          ) : (
            <ul className="space-y-2">
              {list.map((j) => (
                <li key={j._id} className="flex justify-between rounded-lg border border-white/10 p-3">
                  <div>
                    <p className="font-medium">{j.title}</p>
                    <p className="text-xs text-muted-foreground">{j.company} · {j.domain} · {j.status}</p>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => remove(j._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Approve applications</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {apps.map((a) => (
            <div key={a._id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 p-3">
              <div>
                <p className="text-sm font-medium">{a.applicant?.name}</p>
                <p className="text-xs text-muted-foreground">{a.internship?.title} · {a.status}</p>
              </div>
              <div className="flex gap-1">
                {["accepted", "rejected", "reviewing"].map((s) => (
                  <Button key={s} size="sm" variant="outline" onClick={() => updateAppStatus(a._id, s)}>
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
