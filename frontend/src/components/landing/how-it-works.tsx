"use client";

import { motion } from "framer-motion";
import { HOW_IT_WORKS } from "@/data/site-content";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            How it works
          </p>
          <h2 className="pai-section-title mt-2">
            <span className="pai-brand-text">Plus Alpha Intern</span> Journey
          </h2>
          <p className="mx-auto mt-3 max-w-xl pai-subtext">
            Register free, learn with mentors, pay only when you submit your final task
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HOW_IT_WORKS.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="pai-surface pai-card-hover group relative overflow-hidden rounded-2xl p-6"
            >
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-violet-500/10 blur-2xl transition group-hover:bg-fuchsia-500/10" />
              <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-violet-500/25">
                {item.step}
              </span>
              <h3 className="relative mt-4 font-semibold">{item.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed pai-muted">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
