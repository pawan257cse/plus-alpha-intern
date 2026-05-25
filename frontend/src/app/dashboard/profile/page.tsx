"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, User, GraduationCap, Award, Brain, Coins, Zap, Flame, FileText, Map, Target, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/api";
import { INTERNSHIP_DOMAINS } from "@/data/internship-domains";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    bio: "",
    college: "",
    university: "",
    degree: "",
    branch: "",
    year: "",
    passingYear: "",
    skills: "",
    linkedin: "",
    github: "",
    resumeUrl: "",
    profilePhoto: "",
    internshipDomain: "",
  });

  useEffect(() => {
    api
      .get("/users/profile")
      .then(({ data }) => {
        if (data.success) {
          const u = data.data;
          setForm({
            name: u.name || "",
            phone: u.phone || "",
            bio: u.bio || "",
            college: u.college || "",
            university: u.university || "",
            degree: u.degree || "",
            branch: u.branch || "",
            year: u.year || "",
            passingYear: u.passingYear?.toString() || "",
            skills: (u.skills || []).join(", "),
            linkedin: u.linkedin || "",
            github: u.github || "",
            resumeUrl: u.resumeUrl || "",
            profilePhoto: u.profilePhoto || u.avatar || "",
            internshipDomain: u.internshipDomain || u.selectedDomain || "",
          });
          updateUser(u);
        }
      })
      .finally(() => setFetching(false));
  }, [updateUser]);

  const domainTitle = INTERNSHIP_DOMAINS.find((d) => d.id === (user?.internshipDomain || form.internshipDomain))?.title;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.patch("/users/profile", {
        ...form,
        passingYear: form.passingYear ? Number(form.passingYear) : undefined,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      if (data.success) {
        updateUser(data.data);
        toast.success("Profile updated!");
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="h-7 w-7 text-violet-500" />
          Profile Settings
        </h1>
        {user?.approvedByAdmin && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-600 dark:text-emerald-300">
            <Award className="h-4 w-4" /> Approved
          </span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="sm:col-span-1">
          <CardContent className="pt-6 text-center">
            {form.profilePhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.profilePhoto}
                alt=""
                className="mx-auto h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-2xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
            <p className="mt-3 font-semibold">{user?.name}</p>
            <p className="text-sm pai-muted">{user?.email}</p>
            <div className="mt-4">
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all"
                  style={{ width: `${user?.profileCompletion ?? 0}%` }}
                />
              </div>
              <p className="mt-1 text-xs pai-muted">{user?.profileCompletion ?? 0}% complete</p>
            </div>
            {user?.approvedByAdmin && (
              <p className="mt-3 flex items-center justify-center gap-1 text-xs text-emerald-500">
                <Award className="h-4 w-4" /> Admin Approved
              </p>
            )}
            {domainTitle && (
              <p className="mt-2 text-xs text-violet-500">{domainTitle}</p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2 text-left text-xs">
              <div className="rounded-lg bg-violet-500/10 p-2">
                <p className="flex items-center gap-1 text-muted-foreground">
                  <Zap className="h-3 w-3" /> XP
                </p>
                <p className="font-bold text-violet-400">{user?.xp ?? 0}</p>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-2">
                <p className="flex items-center gap-1 text-muted-foreground">
                  <Coins className="h-3 w-3" /> Coins
                </p>
                <p className="font-bold text-amber-400">{user?.coins ?? 0}</p>
              </div>
              <div className="rounded-lg bg-white/5 p-2 col-span-2">
                <p className="text-muted-foreground">Today</p>
                <p className="font-medium">
                  {user?.dailyCoins ?? 0} coins · {user?.dailyXp ?? 0} XP
                </p>
              </div>
              <div className="rounded-lg bg-white/5 p-2 col-span-2">
                <p className="flex items-center gap-1 text-amber-500">
                  <Flame className="h-3 w-3" /> {user?.streak ?? 0} day login streak
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <GraduationCap className="h-5 w-5 text-violet-500" />
              Edit Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={save} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Full Name</Label>
                  <Input className="pai-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input className="pai-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>College</Label>
                  <Input className="pai-input" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>University</Label>
                  <Input className="pai-input" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input className="pai-input" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Input className="pai-input" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input className="pai-input" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Skills (comma separated)</Label>
                  <Input className="pai-input" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Bio</Label>
                  <Input className="pai-input" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <Input className="pai-input" placeholder="https://linkedin.com/in/..." value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  <Input className="pai-input" placeholder="https://github.com/..." value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Profile photo URL</Label>
                  <Input className="pai-input" placeholder="Image URL (Cloudinary, Drive, etc.)" value={form.profilePhoto} onChange={(e) => setForm({ ...form, profilePhoto: e.target.value })} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Resume URL</Label>
                  <Input className="pai-input" placeholder="Google Drive / PDF link" value={form.resumeUrl} onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })} />
                </div>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-violet-500" />
            AI Career Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Use AI tools to improve your profile. Each use earns +5 XP and +3 coins.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/dashboard/ai", icon: FileText, label: "Resume Analyzer" },
              { href: "/dashboard/ai", icon: Target, label: "Internship Match" },
              { href: "/dashboard/ai", icon: Map, label: "Career Roadmap" },
              { href: "/dashboard/ai", icon: Brain, label: "Skill Gap" },
              { href: "/dashboard/ai", icon: MessageCircle, label: "Mock Interview" },
            ].map((tool) => (
              <Link
                key={tool.label}
                href={tool.href}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-violet-500/30 hover:bg-violet-500/5"
              >
                <tool.icon className="h-5 w-5 text-violet-400" />
                <span className="text-sm font-medium">{tool.label}</span>
              </Link>
            ))}
          </div>
          <Link href="/dashboard/ai" className="mt-4 inline-block">
            <Button variant="outline" size="sm">
              Open all AI tools
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
