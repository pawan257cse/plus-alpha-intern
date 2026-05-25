"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { INTERNSHIP_DOMAINS } from "@/data/internship-domains";

export function InternshipDomains({ limit }: { limit?: number }) {
  const domains = limit ? INTERNSHIP_DOMAINS.slice(0, limit) : INTERNSHIP_DOMAINS;

  return (
    <section id="domains" className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row md:text-left">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">Choose Your Domain</h2>
            <p className="mt-2 text-muted-foreground">
              {INTERNSHIP_DOMAINS.length} cutting-edge tracks — live projects & verified certificates
            </p>
          </div>
          <Link href="/domains">
            <Button variant="outline">View All Domains</Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {domains.map((domain, i) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 8) * 0.04 }}
            >
              <Card className="group h-full hover:border-violet-500/40">
                <CardContent className="flex h-full flex-col pt-5">
                  {domain.badge && (
                    <span className="mb-2 w-fit rounded-full bg-fuchsia-500/15 px-2 py-0.5 text-[10px] font-medium text-fuchsia-700 dark:text-fuchsia-300">
                      {domain.badge}
                    </span>
                  )}
                  <h3 className="font-semibold leading-snug text-foreground">{domain.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed pai-muted">{domain.description}</p>
                  <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-violet-400">
                    {domain.duration} · {domain.mode}
                  </p>
                  <ul className="mt-3 flex-1 space-y-1 text-xs pai-muted">
                    {domain.highlights.map((h) => (
                      <li key={h}>• {h}</li>
                    ))}
                  </ul>
                  <Link href={`/signup?domain=${domain.id}`} className="mt-4">
                    <Button size="sm" className="w-full">
                      Enroll Now
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
