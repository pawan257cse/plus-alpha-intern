import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

const openings = [
  { title: "Senior Full Stack Developer", type: "Full-time", location: "Remote / Hybrid" },
  { title: "UI/UX Designer", type: "Contract", location: "Remote" },
  { title: "DevOps Engineer", type: "Full-time", location: "On-site" },
  { title: "Technical Mentor (Internship)", type: "Part-time", location: "Remote" },
];

export default function CareersPage() {
  return (
    <PageShell>
      <div className="mb-10 text-center md:text-left">
        <p className="text-sm font-medium uppercase tracking-widest text-violet-400">Careers</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">Professional Openings</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Join Plus Alpha Intern to build enterprise solutions and mentor the next generation of talent.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {openings.map((job) => (
          <Card key={job.title}>
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/15">
                <Briefcase className="h-6 w-6 text-violet-400" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold">{job.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {job.type} · {job.location}
                </p>
                <Link href="/contact">
                  <Button size="sm" className="mt-4">
                    Apply Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
