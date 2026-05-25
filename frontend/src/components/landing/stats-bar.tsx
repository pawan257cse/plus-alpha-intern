"use client";

import { motion } from "framer-motion";
import { HERO_STATS } from "@/data/site-content";

export function StatsBar() {
  return (
    <section className="border-y border-violet-500/10 bg-gradient-to-r from-violet-500/5 via-transparent to-fuchsia-500/5 px-4 py-12">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
        {HERO_STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="pai-stat-pill rounded-2xl px-4 py-5 text-center"
          >
            <p className="pai-brand-text text-2xl font-extrabold md:text-3xl">{s.value}</p>
            <p className="mt-1 text-sm font-medium text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
