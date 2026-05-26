"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Award,
  IndianRupee,
  Settings,
  Bell,
  FileText,
  Brain,
  BarChart3,
  ListTodo,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

export const adminLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/internships", icon: Briefcase, label: "Internships" },
  { href: "/admin/certificates", icon: Award, label: "Certificates" },
  { href: "/admin/payments", icon: IndianRupee, label: "Payments" },
  { href: "/admin/student-fees", icon: IndianRupee, label: "Student Fees" },
  { href: "/admin/domain-tasks", icon: ListTodo, label: "Domain Tasks" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/content", icon: FileText, label: "Content" },
  { href: "/admin/notifications", icon: Bell, label: "Notifications" },
  { href: "/admin/ai-settings", icon: Brain, label: "AI Settings" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-white/10 bg-background/80 lg:flex">
      <div className="border-b border-white/10 p-4">
        <p className="font-bold text-violet-400">Admin Panel</p>
        <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
      </div>
      <nav className="flex-1 space-y-0.5 p-2">
        {adminLinks.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
                active
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-muted-foreground hover:bg-white/5"
              )}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-2">
        <Button variant="ghost" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
