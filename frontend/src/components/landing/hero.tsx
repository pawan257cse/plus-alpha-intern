"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandGradientText } from "@/components/brand/brand-gradient-text";
import { HERO_HIGHLIGHTS, SITE_CONFIG } from "@/data/site-content";

const perks = ["Free Registration", "Pay on Task Submit", "Verified Certificates"];

export function Hero() {
  return (
    <section className="relative px-4 pb-16 pt-32 md:pt-36">
      <div className="pai-hero-glow pointer-events-none absolute inset-x-0 top-0 h-96" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-wrap items-center justify-center gap-3"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-800 dark:text-cyan-200">
            <Sparkles className="h-3.5 w-3.5 text-cyan-500 dark:text-emerald-300" />
            {SITE_CONFIG.name}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-200">
            <IndianRupee className="h-3.5 w-3.5" />
            Pay only when you submit task
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="pai-tnr text-center text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Launch Your Career with
          <br />
          <BrandGradientText className="mt-2 inline-block" />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="pai-tnr mx-auto mt-4 max-w-none whitespace-nowrap px-2 text-center text-lg font-medium pai-subtext"
        >
          {SITE_CONFIG.tagline}
        </motion.p>

        {SITE_CONFIG.heroSubtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mx-auto mt-4 max-w-3xl text-center text-base leading-relaxed pai-subtext md:text-lg"
          >
            {SITE_CONFIG.heroSubtitle}
          </motion.p>
        )}

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="mx-auto mt-8 grid max-w-3xl gap-2 sm:grid-cols-2"
        >
          {HERO_HIGHLIGHTS.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm pai-subtext">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              {h}
            </li>
          ))}
        </motion.ul>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {perks.map((p) => (
            <li
              key={p}
              className="pai-stat-pill flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium pai-subtext"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              {p}
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link href="/signup">
            <Button size="lg" variant="accent" className="group w-full min-w-[200px] sm:w-auto">
              Register Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/login?redirect=%2Fsubmit-task">
            <Button size="lg" variant="outline" className="w-full min-w-[200px] sm:w-auto">
              Submit Task & Pay
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.38 }}
          className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-3"
        >
          {[
            { label: "Registration", value: "₹0", sub: "Always free — no card needed" },
            { label: "Internship Fee", value: "On Submit", sub: "Pay with final task only" },
            { label: "Certificate", value: "Verified", sub: "Public ID + admin approved" },
          ].map((item) => (
            <div
              key={item.label}
              className="pai-surface pai-card-hover rounded-2xl p-5 text-center"
            >
              <p className="pai-brand-text text-2xl font-bold">{item.value}</p>
              <p className="mt-1 font-semibold text-foreground">{item.label}</p>
              <p className="mt-0.5 text-xs pai-muted">{item.sub}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
