"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Menu,
  X,
  LogOut,
  IndianRupee,
  Brain,
  Trophy,
  Upload,
  Coins,
  Briefcase,
  Award,
  Bell,
  MessageSquare,
} from "lucide-react";
import { LogoMark } from "@/components/brand/logo-mark";
import { SITE_CONFIG } from "@/data/site-content";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

const baseLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
  { href: "/dashboard/internships", icon: Briefcase, label: "Internships" },
  { href: "/dashboard/certificates", icon: Award, label: "Certificates" },
  { href: "/dashboard/ai", icon: Brain, label: "AI Tools" },
  { href: "/dashboard/community", icon: MessageSquare, label: "Community" },
  { href: "/dashboard/notifications", icon: Bell, label: "Notifications" },
  { href: "/dashboard/leaderboard", icon: Trophy, label: "Leaderboard" },
  { href: "/dashboard/payments", icon: IndianRupee, label: "Payments" },
];

export function DashboardSidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const links = user?.approvedByAdmin
    ? [...baseLinks, { href: "/submit-task", icon: Upload, label: "Submit Task" }]
    : baseLinks;

  const NavContent = () => (
    <>
      <div className="flex items-center gap-2 px-2 py-4">
        <LogoMark size={36} />
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold leading-tight">{SITE_CONFIG.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.name}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                active
                  ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-violet-300"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-2 space-y-2">
        <div className="rounded-xl bg-white/5 p-3 text-center">
          <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Coins className="h-3 w-3" /> Today
          </p>
          <p className="text-sm font-bold text-violet-400">
            {user?.dailyCoins ?? 0} coins · {user?.dailyXp ?? 0} XP
          </p>
          <p className="text-xs text-muted-foreground">
            Total: {user?.coins ?? 0} coins · {user?.xp ?? 0} XP
          </p>
        </div>
        {user?.approvedByAdmin ? (
          <p className="rounded-xl bg-emerald-500/10 px-3 py-2 text-center text-xs text-emerald-500">
            Approved — submit tasks unlocked
          </p>
        ) : (
          <p className="rounded-xl bg-amber-500/10 px-3 py-2 text-center text-xs text-amber-500">
            Pending admin review
          </p>
        )}
        <Button variant="ghost" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-background/50 backdrop-blur-xl lg:flex">
        <NavContent />
      </aside>

      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 right-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X /> : <Menu />}
      </Button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-white/10 bg-background lg:hidden"
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
