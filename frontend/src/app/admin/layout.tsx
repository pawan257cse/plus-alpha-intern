"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { AdminSidebar, adminLinks } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token } = useAuthStore();
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isLoginPage = pathname === "/admin/login";

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
    <div className="flex min-h-screen flex-col lg:flex-row">
      <MobileAdminNav />
      <AdminSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

function MobileAdminNav() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/90 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-violet-400">Admin Panel</p>
          <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button variant="glass" size="icon" aria-label="Open admin menu">
              <Menu className="h-5 w-5" />
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <Dialog.Content className="fixed right-0 top-0 z-50 flex h-full w-[86vw] max-w-xs flex-col border-l border-white/10 bg-background/95 p-4 shadow-2xl outline-none">
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <Dialog.Title className="text-lg font-semibold text-foreground">
                    Admin Menu
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-muted-foreground">
                    Navigate between admin sections
                  </Dialog.Description>
                </div>
                <Dialog.Close asChild>
                  <Button variant="ghost" size="icon" aria-label="Close admin menu">
                    <X className="h-5 w-5" />
                  </Button>
                </Dialog.Close>
              </div>

              <nav className="flex-1 space-y-1 py-4">
                {adminLinks.map((link) => {
                  const active =
                    pathname === link.href ||
                    (link.href !== "/admin" && pathname.startsWith(link.href));
                  return (
                    <Dialog.Close asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition",
                          active
                            ? "bg-violet-500/20 text-violet-200"
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        )}
                      >
                        <link.icon className="h-4 w-4 shrink-0" />
                        {link.label}
                      </Link>
                    </Dialog.Close>
                  );
                })}
              </nav>

              <div className="border-t border-white/10 pt-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    logout();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
