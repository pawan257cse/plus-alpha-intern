"use client";

import { motion } from "framer-motion";
import { PROGRAM_JOURNEY } from "@/data/site-content";

export function ProgramJourney() {
  return (
    <section className="border-t border-violet-500/10 bg-gradient-to-b from-violet-500/5 to-transparent px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="pai-section-title">Registration to Certification</h2>
          <p className="mt-2 pai-subtext">Your complete journey on one platform</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAM_JOURNEY.map((j, i) => (
            <motion.div
              key={j.step}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="pai-surface pai-card-hover rounded-2xl p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  Step {j.step}
                </span>
                <span className="rounded-full bg-fuchsia-500/15 px-2.5 py-0.5 text-xs font-medium text-fuchsia-700 dark:text-fuchsia-300">
                  {j.time}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{j.title}</h3>
              <p className="mt-1 text-sm pai-muted">{j.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
