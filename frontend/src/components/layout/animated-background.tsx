"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-30%,rgba(34,211,238,0.10),transparent_55%)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-30%,rgba(34,211,238,0.20),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_100%_40%,rgba(52,211,153,0.05),transparent_50%)] dark:bg-[radial-gradient(ellipse_80%_50%_at_100%_40%,rgba(52,211,153,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_0%_90%,rgba(96,165,250,0.06),transparent_50%)] dark:bg-[radial-gradient(ellipse_60%_40%_at_0%_90%,rgba(96,165,250,0.14),transparent_50%)]" />
      <div className="pai-grid-bg absolute inset-0" />
      <motion.div
        className="absolute -left-32 top-20 h-[26rem] w-[26rem] rounded-full bg-cyan-500/10 blur-[120px] dark:bg-cyan-500/20"
        animate={{ x: [0, 80, 0], y: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-32 top-1/3 h-72 w-72 rounded-full bg-emerald-500/12 blur-[110px]"
        animate={{ x: [0, -60, 0], y: [0, 30, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-500/10 blur-[95px]"
        animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.68, 0.35] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
