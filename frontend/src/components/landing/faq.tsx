"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQ_ITEMS, SITE_CONFIG } from "@/data/site-content";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-2 text-center text-3xl font-bold text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="mb-10 text-center pai-subtext">
          {FAQ_ITEMS.length}+ answers about {SITE_CONFIG.name} programs, payments, and certificates
        </p>
        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-violet-500/20 bg-violet-500/5"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 p-5 text-left font-medium text-foreground"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {faq.q}
                <ChevronDown
                  className={cn("h-5 w-5 shrink-0 text-violet-400 transition", open === i && "rotate-180")}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <p className="border-t border-violet-500/15 px-5 pb-5 pt-3 text-sm leading-relaxed pai-subtext">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
