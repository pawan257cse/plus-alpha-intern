"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TESTIMONIALS } from "@/data/site-content";

export function Testimonials() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-3 text-center text-3xl font-bold text-foreground md:text-4xl">
          Student Stories
        </h2>
        <p className="mb-12 text-center pai-subtext">
          Real feedback from learners across India on our internship tracks
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08 }}
            >
              <Card className="h-full border-cyan-500/15">
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex gap-1">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-medium text-cyan-700 dark:text-cyan-200">
                      {t.domain}
                    </span>
                  </div>
                  <p className="mb-6 text-sm leading-relaxed pai-subtext">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-sm pai-muted">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
