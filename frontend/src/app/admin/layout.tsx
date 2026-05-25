"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || isLoginPage) return;

    if (!token) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user && user.role !== "admin") {
      router.replace("/admin/login");
    }
  }, [hydrated, token, user, router, pathname, isLoginPage]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (!isLoginPage && (!token || (user && user.role !== "admin"))) {
    return null;
  }

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
