"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/data/site-content";

export function CtaBanner() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-sky-500 p-8 text-center shadow-[0_20px_60px_rgba(34,211,238,0.30)] md:p-12">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Ready to start your {SITE_CONFIG.shortName} journey?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-cyan-50">
          Join thousands of students building real projects. Register free — pay only when you
          submit your final task.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white text-cyan-900 hover:bg-cyan-50"
            >
              Register Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/domains">
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:border-cyan-300/30">
              Browse All Domains
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
