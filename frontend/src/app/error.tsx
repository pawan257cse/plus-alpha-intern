"use client";

import { useEffect } from "react";
import { Loader2, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep the UI stable; logging in browser for easier debugging.
    // eslint-disable-next-line no-console
    console.error("App error:", error);
  }, [error]);

  return (
    <main className="mx-auto max-w-2xl px-4 pt-28 pb-20 md:pt-32">
      <div className="pai-surface rounded-2xl p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-cyan-400" />
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm pai-muted">Something went wrong.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}

