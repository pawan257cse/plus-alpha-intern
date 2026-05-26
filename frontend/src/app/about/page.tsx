import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import {
  ABOUT_FEATURES,
  ABOUT_SECTIONS,
  SITE_CONFIG,
  TRUST_BADGES,
} from "@/data/site-content";
import { CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <PageShell>
      <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">About Us</p>
      <h1 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
        About {SITE_CONFIG.name}
      </h1>
      {SITE_CONFIG.heroSubtitle && (
        <p className="mt-4 max-w-3xl text-lg pai-subtext">{SITE_CONFIG.heroSubtitle}</p>
      )}

      <div className="mt-12 space-y-10">
        {ABOUT_SECTIONS.map((section) => (
          <div key={section.title} className="pai-surface rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
            <p className="mt-3 leading-relaxed pai-subtext">{section.body}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-6 mt-16 text-2xl font-bold text-foreground">Platform Capabilities</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {ABOUT_FEATURES.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-xl border border-cyan-500/15 bg-cyan-500/5 px-4 py-3 text-sm pai-subtext"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            {item}
          </li>
        ))}
      </ul>

      <h2 className="mb-6 mt-16 text-2xl font-bold text-foreground">Why Students Trust Us</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TRUST_BADGES.map((b) => (
          <div key={b.title} className="pai-surface rounded-2xl p-5">
            <h3 className="font-semibold text-foreground">{b.title}</h3>
            <p className="mt-2 text-sm pai-muted">{b.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link href="/signup">
          <Button size="lg" variant="accent">Register Free</Button>
        </Link>
        <Link href="/domains">
          <Button size="lg" variant="outline">
            View Domains
          </Button>
        </Link>
        <Link href="/contact">
          <Button size="lg" variant="ghost">
            Contact Us
          </Button>
        </Link>
      </div>

      <p className="mt-12 text-xs pai-muted">{SITE_CONFIG.disclaimer}</p>
    </PageShell>
  );
}
