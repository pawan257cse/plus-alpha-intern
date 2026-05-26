"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FOR_COLLEGES, SITE_CONFIG } from "@/data/site-content";

export function ForColleges() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="pai-gradient-border overflow-hidden rounded-3xl">
          <div className="grid gap-8 bg-cyan-950/35 p-8 md:grid-cols-2 md:p-12">
            <div>
              <Building2 className="h-10 w-10 text-cyan-300" />
              <h2 className="mt-4 text-2xl font-bold text-white md:text-3xl">
                For Colleges & Placement Cells
              </h2>
              <p className="mt-3 text-cyan-50">
                Partner with {SITE_CONFIG.name} for structured online internships your students
                can complete with verifiable certificates and transparent fees.
              </p>
              <Link href="/contact" className="mt-6 inline-block">
                <Button variant="accent">Request College Partnership</Button>
              </Link>
            </div>
            <ul className="space-y-3">
              {FOR_COLLEGES.map((line) => (
                <motion.li
                  key={line}
                  initial={{ opacity: 0, x: 8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex gap-3 text-sm text-cyan-50"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  {line}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
