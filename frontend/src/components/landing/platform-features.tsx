"use client";

import { PLATFORM_FEATURES } from "@/data/site-content";

export function PlatformFeatures() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="pai-section-title text-center text-foreground">
          Everything on One Platform
        </h2>
        <p className="mb-12 mt-3 text-center pai-subtext">
          Built for students, mentors, admins, and colleges — all features live today
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PLATFORM_FEATURES.map((f) => (
            <div
              key={f.title}
              className="pai-surface pai-card-hover rounded-2xl p-5 transition"
            >
              <span className="text-3xl">{f.emoji}</span>
              <p className="mt-3 font-semibold text-foreground">{f.title}</p>
              <p className="mt-2 text-xs leading-relaxed pai-muted">{f.desc}</p>
              <span
                className={`mt-3 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  f.status === "Live"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-cyan-500/15 text-cyan-400"
                }`}
              >
                {f.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
