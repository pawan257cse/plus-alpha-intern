"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    revenue: 0,
    certificatesIssued: 0,
    activeInternships: 0,
    userGrowth: [] as { _id: string; count: number }[],
    usersByRole: [] as { _id: string; count: number }[],
  });

  useEffect(() => {
    api.get("/admin/stats").then(({ data }) => {
      if (data.success) setStats(data.data);
    });
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <BarChart3 className="h-7 w-7 text-violet-400" />
        Analytics Panel
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "User growth (30d)", value: stats.totalUsers },
          { label: "Revenue (₹)", value: stats.revenue },
          { label: "Certificates", value: stats.certificatesIssued },
          { label: "Active internships", value: stats.activeInternships },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold">{s.value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>User growth</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="_id" stroke="#888" fontSize={10} />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8b5cf6" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Users by role</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.usersByRole}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="_id" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
