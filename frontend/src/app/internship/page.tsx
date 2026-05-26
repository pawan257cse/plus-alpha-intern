import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  HOW_IT_WORKS,
  INTERNSHIP_BENEFITS,
  PROGRAM_JOURNEY,
  SITE_CONFIG,
  WHAT_YOU_GET,
} from "@/data/site-content";
import { CheckCircle2 } from "lucide-react";
import { InternshipDomains } from "@/components/landing/internship-domains";

export default function InternshipProgramPage() {
  return (
    <PageShell>
      <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
        Internship Program
      </p>
      <h1 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
        Industry-Oriented Online Internship
      </h1>
      {SITE_CONFIG.heroSubtitle && (
        <p className="mt-4 max-w-3xl text-lg pai-subtext">{SITE_CONFIG.heroSubtitle}</p>
      )}

      <h2 className="mb-6 mt-12 text-xl font-bold text-foreground">Program Benefits</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {INTERNSHIP_BENEFITS.map((item) => (
          <Card key={item}>
            <CardContent className="flex items-center gap-3 pt-5">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              <span className="text-sm font-medium pai-subtext">{item}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mb-6 mt-16 text-2xl font-bold text-foreground">How It Works</h2>
      <div className="space-y-4">
        {HOW_IT_WORKS.map((step) => (
          <div
            key={step.step}
            className="flex gap-4 rounded-xl border border-violet-500/15 bg-violet-500/5 p-5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
              {step.step}
            </span>
            <div>
              <p className="font-semibold text-foreground">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed pai-muted">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-6 mt-16 text-2xl font-bold text-foreground">Timeline</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROGRAM_JOURNEY.map((j) => (
          <Card key={j.step}>
            <CardContent className="pt-5">
              <p className="text-xs font-bold uppercase text-violet-400">Step {j.step}</p>
              <p className="mt-1 font-semibold text-foreground">{j.title}</p>
              <p className="mt-1 text-xs text-fuchsia-300">{j.time}</p>
              <p className="mt-2 text-sm pai-muted">{j.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mb-6 mt-16 text-2xl font-bold text-foreground">Included in Every Track</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {WHAT_YOU_GET.map((w) => (
          <div key={w.title} className="pai-surface rounded-2xl p-5">
            <p className="font-semibold text-foreground">{w.title}</p>
            <p className="mt-2 text-sm pai-muted">{w.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <InternshipDomains />
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link href="/signup">
          <Button size="lg" variant="accent">Register Free</Button>
        </Link>
        <Link href="/login?redirect=%2Fsubmit-task">
          <Button size="lg" variant="outline">
            Submit Task (Login Required)
          </Button>
        </Link>
      </div>
    </PageShell>
  );
}
