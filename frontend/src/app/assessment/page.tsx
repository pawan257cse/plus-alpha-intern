import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, FileQuestion, BarChart3 } from "lucide-react";

export default function AssessmentPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-bold">Assessment Center</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Quizzes, assignments, and project evaluations — track your internship progress after login.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          {
            icon: FileQuestion,
            title: "Weekly Quizzes",
            desc: "Domain-wise MCQs and short answers after each module.",
          },
          {
            icon: ClipboardList,
            title: "Project Submission",
            desc: "Upload GitHub links, reports, and demos via Submit Task.",
          },
          {
            icon: BarChart3,
            title: "Performance Report",
            desc: "Marks, attendance, and completion status on your dashboard.",
          },
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <item.icon className="mb-2 h-8 w-8 text-violet-400" />
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex gap-4">
        <Link href="/login">
          <Button>Login to Attempt</Button>
        </Link>
        <Link href="/submit-task">
          <Button variant="outline">
            Submit Task
          </Button>
        </Link>
      </div>
    </PageShell>
  );
}
