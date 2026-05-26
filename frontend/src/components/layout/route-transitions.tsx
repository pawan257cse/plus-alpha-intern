"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function RouteTransitions({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const initialAnim = reduceMotion ? undefined : { opacity: 0, y: 10 };
  const exitAnim = reduceMotion ? undefined : { opacity: 0, y: -8 };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={initialAnim}
        animate={{ opacity: 1, y: 0 }}
        exit={exitAnim}
        transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

