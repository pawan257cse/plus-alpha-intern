"use client";

import { motion } from "framer-motion";

const companies = [
  "Google", "Microsoft", "Amazon", "Flipkart", "Swiggy", "Razorpay",
  "Zomato", "PhonePe", "Infosys", "TCS", "Wipro", "Accenture",
];

export function Companies() {
  return (
    <section className="border-y border-white/5 py-16">
      <p className="mb-8 text-center text-sm uppercase tracking-widest text-muted-foreground">
        Trusted by students placed at
      </p>
      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: [0, -1200] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...companies, ...companies].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-xl font-semibold text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
