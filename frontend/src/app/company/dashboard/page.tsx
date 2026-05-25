"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Briefcase, Users, Loader2, Plus, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/api";

export default function CompanyDashboardPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [data, setData] = useState<{
    stats: { totalInternships: number; totalApplications: number };
    internships: { title: string; _id: string }[];
    company: { name?: string; verified: boolean };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.replace("/login?tab=company");
      return;
    }
    if (user?.role !== "company") {
      router.replace("/dashboard");
      return;
    }
    api
      .get("/company/dashboard")
      .then(({ data: res }) => {
        if (res.success) setData(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, user, router]);

  if (!token || user?.role !== "company") return null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="h-7 w-7 text-violet-500" />
              {user.companyName || "Company"} Dashboard
            </h1>
            <p className="pai-subtext mt-1">
              {data?.company?.verified ? (
                <span className="text-emerald-500 flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" /> Verified company
                </span>
              ) : (
                "Pending admin verification"
              )}
            </p>
          </div>
          <Link href="/internships">
            <Button>
              <Plus className="h-4 w-4" /> Post Internship
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium pai-muted">Active Internships</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{data?.stats.totalInternships ?? 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium pai-muted flex items-center gap-1">
                    <Users className="h-4 w-4" /> Applicants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{data?.stats.totalApplications ?? 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium pai-muted flex items-center gap-1">
                    <Briefcase className="h-4 w-4" /> Company
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold truncate">{user.email}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Your Internship Listings</CardTitle>
              </CardHeader>
              <CardContent>
                {data?.internships?.length ? (
                  <ul className="space-y-2">
                    {data.internships.map((i) => (
                      <li key={i._id} className="flex items-center justify-between rounded-lg border border-white/10 p-3">
                        <span>{i.title}</span>
                        <Link href={`/internships`} className="text-sm text-violet-500 hover:underline">
                          View
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="pai-subtext text-center py-8">No internships posted yet. Create your first listing!</p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
