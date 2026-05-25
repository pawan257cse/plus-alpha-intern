"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, Clock, CheckCircle2, XCircle, Loader2, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/api";

interface Application {
  _id: string;
  status: string;
  appliedAt: string;
  internship: {
    _id: string;
    title: string;
    company: string;
    domain: string;
    location: string;
  };
}

const statusColor: Record<string, string> = {
  pending: "text-amber-500",
  reviewing: "text-blue-400",
  accepted: "text-emerald-500",
  rejected: "text-red-400",
};

export default function DashboardInternshipsPage() {
  const { user } = useAuthStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/internships/applications/me")
      .then(({ data }) => {
        if (data.success) setApplications(data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const active = applications.filter((a) =>
    ["pending", "reviewing", "accepted"].includes(a.status)
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Briefcase className="h-7 w-7 text-violet-500" />
          Internship Hub
        </h1>
        <Link href="/internships">
          <Button>Browse & apply</Button>
        </Link>
      </div>

      {user?.approvedByAdmin && (
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
            <div>
              <p className="font-semibold text-emerald-500">Active program</p>
              <p className="text-sm text-muted-foreground">
                You are approved — submit weekly tasks to complete your internship.
              </p>
            </div>
            <Link href="/submit-task">
              <Button size="sm">
                <Upload className="mr-1 h-4 w-4" />
                Submit task
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Application status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {applications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No applications yet.{" "}
              <Link href="/internships" className="text-violet-400 hover:underline">
                Find internships
              </Link>
            </p>
          ) : (
            applications.map((app) => (
              <div
                key={app._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 p-4"
              >
                <div>
                  <p className="font-medium">{app.internship?.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {app.internship?.company} · {app.internship?.domain}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Applied {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`flex items-center gap-1 text-sm font-medium capitalize ${statusColor[app.status] || ""}`}
                >
                  {app.status === "accepted" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : app.status === "rejected" ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                  {app.status}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {active.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {active.length} active application{active.length > 1 ? "s" : ""} in progress
        </p>
      )}
    </div>
  );
}
