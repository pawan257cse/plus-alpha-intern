"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export function RequireAuth({
  children,
  loginPath = "/login",
}: {
  children: React.ReactNode;
  loginPath?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const finish = () => setHydrated(true);
    if (useAuthStore.persist.hasHydrated()) {
      finish();
      return;
    }
    return useAuthStore.persist.onFinishHydration(finish);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      const next = encodeURIComponent(pathname);
      router.replace(`${loginPath}?redirect=${next}`);
    }
  }, [hydrated, user, router, pathname, loginPath]);

  if (!hydrated || !user) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 pai-subtext">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        <p className="text-sm">Checking login…</p>
      </div>
    );
  }

  return <>{children}</>;
}
