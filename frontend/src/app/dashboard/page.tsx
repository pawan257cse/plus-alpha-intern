"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  Brain,
  CheckCircle2,
  Clock,
  Coins,
  GraduationCap,
  IndianRupee,
  ShieldCheck,
  TrendingUp,
  Upload,
  User,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { INTERNSHIP_DOMAINS } from "@/data/internship-domains";
import api from "@/lib/api";


export default function DashboardPage() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<{ title: string; message: string }[]>([]);

  const domainId = user?.internshipDomain || user?.selectedDomain;
  const domainTitle =
    INTERNSHIP_DOMAINS.find((d) => d.id === domainId)?.title || domainId || "—";
  const approved = user?.approvedByAdmin;

  useEffect(() => {
    api
      .get("/users/notifications")
      .then(({ data }) => {
        if (data.success) setNotifications((data.data || []).slice(0, 5));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold md:text-3xl">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Track your registration and approval status
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {[
          {
            label: "Profile",
            value: `${user?.profileCompletion ?? 0}%`,
            sub: "Completion",
            icon: User,
          },
          {
            label: "Domain",
            value: domainTitle.length > 18 ? `${domainTitle.slice(0, 16)}…` : domainTitle,
            sub: "Your registration",
            icon: GraduationCap,
          },
          {
            label: "Registration",
            value: "Free",
            sub: "No signup fee",
            icon: IndianRupee,
            valueClass: "text-emerald-500",
          },
          {
            label: "Today",
            value: `${user?.dailyCoins ?? 0} coins`,
            sub: `${user?.dailyXp ?? 0} XP earned today`,
            icon: Coins,
          },
          {
            label: "Status",
            value: approved ? "Approved" : "Under review",
            sub: approved ? "Offers coming soon" : "Admin reviewing",
            icon: approved ? CheckCircle2 : Clock,
            valueClass: approved ? "text-emerald-500" : "text-amber-500",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15">
                  <stat.icon className="h-5 w-5 text-violet-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`truncate text-lg font-bold ${stat.valueClass || "text-violet-400"}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-transparent to-indigo-500/10">
        <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
              approved ? "bg-emerald-500/20" : "bg-amber-500/20"
            }`}
          >
            {approved ? (
              <ShieldCheck className="h-7 w-7 text-emerald-500" />
            ) : (
              <Clock className="h-7 w-7 text-amber-500" />
            )}
          </div>
          <div className="flex-1">
            {approved ? (
              <>
                <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                  You&apos;re approved!
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  You can submit your internship task now. Internship fee is paid only when
                  you submit your final task — registration was free.
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold">Registration under review</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your signup is complete. After admin approval, matching internship offers
                  will show on this dashboard. No need to pick a course or domain again.
                </p>
              </>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link href="/dashboard/profile">
              <Button variant="outline" size="sm">
                Edit profile
              </Button>
            </Link>
            {approved && (
              <Link href="/submit-task">
                <Button size="sm">
                  <Upload className="mr-1 h-4 w-4" />
                  Submit task
                </Button>
              </Link>
            )}
            <Link href="/dashboard/ai">
              <Button variant="outline" size="sm">
                <Brain className="mr-1 h-4 w-4" />
                AI tools
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <GraduationCap className="h-5 w-5 text-violet-400" />
              What you registered for
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{user?.name}</span>
            </div>
            <div className="flex justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Internship domain</span>
              <span className="max-w-[60%] text-right font-medium">{domainTitle}</span>
            </div>
            <div className="flex justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Registration fee</span>
              <span className="font-medium text-emerald-500">Free — not paid at signup</span>
            </div>
            <div className="flex justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Zap className="h-3.5 w-3.5" /> XP & coins
              </span>
              <span className="font-medium">
                {user?.xp ?? 0} XP · {user?.coins ?? 0} coins
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-violet-400" />
              Profile completion
            </CardTitle>
            <Link href="/dashboard/profile">
              <Button variant="ghost" size="sm">
                Update
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
                initial={{ width: 0 }}
                animate={{ width: `${user?.profileCompletion ?? 0}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Add skills and a resume link to reach 100%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick links</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            <Link href="/dashboard/internships" className="rounded-lg border border-white/10 p-3 text-sm hover:bg-white/5">
              Internship progress →
            </Link>
            <Link href="/dashboard/certificates" className="rounded-lg border border-white/10 p-3 text-sm hover:bg-white/5">
              My certificates →
            </Link>
            <Link href="/dashboard/notifications" className="rounded-lg border border-white/10 p-3 text-sm hover:bg-white/5">
              All notifications →
            </Link>
            <Link href="/dashboard/community" className="rounded-lg border border-white/10 p-3 text-sm hover:bg-white/5">
              Community →
            </Link>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-violet-400" />
              Notifications
            </CardTitle>
            <Link href="/dashboard/notifications">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No new notifications</p>
            ) : (
              notifications.map((n, i) => (
                <div key={i} className="rounded-lg bg-white/5 p-3 text-sm">
                  <p className="font-medium">{n.title}</p>
                  <p className="text-muted-foreground">{n.message}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
