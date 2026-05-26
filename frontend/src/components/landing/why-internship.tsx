"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { WHY_INTERNSHIP } from "@/data/site-content";

export function WhyInternship() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Why Internship Experience Matters Today
        </h2>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-400">With internship experience</h3>
            {WHY_INTERNSHIP.withExp.map((item) => (
              <motion.div
                key={item.title}
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -12 }}
                viewport={{ once: true }}
                className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-medium">{item.title}</p>
                  <span className="text-lg font-bold text-emerald-400">{item.stat}</span>
                </div>
                <p className="mt-1 text-sm pai-muted">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-400">Without internship experience</h3>
            <ul className="space-y-3">
              {WHY_INTERNSHIP.withoutExp.map((line) => (
                <li
                  key={line}
                  className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm pai-muted"
                >
                  {line}
                </li>
              ))}
            </ul>
            <Link href="/signup">
              <Button variant="accent" className="mt-4 w-full sm:w-auto" size="lg">
                Secure My Internship Spot
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
