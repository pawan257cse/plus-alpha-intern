import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 pt-28 pb-20 md:pt-32">
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-7 w-7 animate-spin text-cyan-400" />
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="pai-surface rounded-2xl p-5 animate-pulse"
            aria-hidden="true"
          >
            <div className="h-4 w-3/5 rounded bg-white/10" />
            <div className="mt-3 h-3 w-4/5 rounded bg-white/8" />
            <div className="mt-5 h-28 w-full rounded-xl bg-white/5" />
            <div className="mt-4 flex gap-2">
              <div className="h-8 w-20 rounded bg-white/8" />
              <div className="h-8 flex-1 rounded bg-white/6" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

