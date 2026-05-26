"use client";

import { motion } from "framer-motion";
import { Shield, GraduationCap, FileCheck, Eye } from "lucide-react";
import { SITE_CONFIG, TRUST_BADGES } from "@/data/site-content";

const icons = [GraduationCap, Shield, FileCheck, Eye];

export function TrustSection() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300/90">
            Trusted · Student-First
          </p>
          <h2 className="pai-section-title mt-2">Why Choose Plus Alpha Intern?</h2>
          <p className="mx-auto mt-3 max-w-2xl pai-subtext">
            Powered by{" "}
            <strong className="pai-brand-text font-bold">{SITE_CONFIG.poweredBy}</strong> — structured
            programs with verified certificates for your college records.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_BADGES.map((b, i) => {
            const Icon = icons[i] || Shield;
            return (
              <motion.div
                key={b.title}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 12 }}
                viewport={{ once: true }}
                className="pai-surface pai-card-hover rounded-2xl p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/10">
                  <Icon className="h-6 w-6 text-cyan-300" />
                </div>
                <h3 className="font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed pai-muted">{b.desc}</p>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-10 text-center text-xs text-muted-foreground">{SITE_CONFIG.disclaimer}</p>
      </div>
    </section>
  );
}
