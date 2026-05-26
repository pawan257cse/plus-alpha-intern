"use client";

import { motion } from "framer-motion";
import { WHAT_YOU_GET } from "@/data/site-content";
import { Gift } from "lucide-react";

export function WhatYouGet() {
  return (
    <section className="border-y border-cyan-500/10 bg-cyan-500/5 px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Program Benefits
          </p>
          <h2 className="pai-section-title mt-2">What You Get With Plus Alpha Intern</h2>
          <p className="mx-auto mt-3 max-w-2xl pai-subtext">
            Everything included from day one — no hidden upsells at registration
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHAT_YOU_GET.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="pai-surface pai-card-hover rounded-2xl p-6"
            >
              <Gift className="mb-3 h-8 w-8 text-cyan-400" />
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed pai-subtext">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
