"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, ChevronDown, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { SITE_CONFIG } from "@/data/site-content";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/internship", label: "Internship" },
  { href: "/domains", label: "Domains" },
  { href: "/assessment", label: "Assessment" },
];

const resourceLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/certificates/verify", label: "Verify Certificate" },
  { href: "/dashboard/ai", label: "AI Tools" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuthStore();

  const submitTaskHref = user ? "/submit-task" : "/login?redirect=%2Fsubmit-task";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setResourcesOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!resourcesOpen) return;
    const close = () => setResourcesOpen(false);
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [resourcesOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navLinkClass = (href: string, highlight?: boolean) =>
    cn(
      "pai-nav-link whitespace-nowrap rounded-xl px-2.5 py-2 text-[13px] font-medium xl:px-3 xl:text-sm",
      isActive(href)
        ? "pai-nav-link-active text-white"
        : highlight
          ? "text-fuchsia-200 hover:bg-fuchsia-500/15 hover:text-white"
          : "text-slate-200 hover:bg-white/10 hover:text-white"
    );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2 pt-2 sm:px-4 sm:pt-3 md:px-5 md:pt-4">
      <div
        className={cn(
          "pai-nav-shell relative mx-auto max-w-7xl rounded-2xl transition-shadow duration-300 md:rounded-[1.35rem]",
          scrolled && "shadow-[0_12px_48px_rgba(0,0,0,0.5)]"
        )}
      >
        <div className="pai-announce-bar hidden items-center justify-center gap-2 px-4 py-1.5 text-[11px] font-medium text-slate-200 sm:flex">
          <Sparkles className="h-3 w-3 shrink-0 text-violet-300" />
          <span className="text-center">
            <strong className="pai-brand-text text-xs font-bold">{SITE_CONFIG.name}</strong>
            <span className="mx-2 opacity-50">|</span>
            Free registration · Pay only on task submit
          </span>
        </div>

        <nav className="flex min-h-[4.25rem] flex-wrap items-center justify-between gap-2 px-2 py-2 sm:px-4 md:px-5">
          <BrandLogo size={42} className="shrink-0" />

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setResourcesOpen(false)}
                className={navLinkClass(link.href)}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href={submitTaskHref}
              className={cn(
                navLinkClass("/submit-task", true),
                "ml-0.5 border border-fuchsia-400/40 bg-fuchsia-500/10"
              )}
            >
              Submit Task
            </Link>

            <div ref={resourcesRef} className="relative ml-0.5">
              <button
                type="button"
                aria-expanded={resourcesOpen}
                className={cn(
                  "pai-nav-link flex items-center gap-1 rounded-xl px-2.5 py-2 text-[13px] font-medium xl:px-3 xl:text-sm",
                  resourcesOpen
                    ? "pai-nav-link-active text-white"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                )}
                onClick={() => setResourcesOpen((o) => !o)}
              >
                More
                <ChevronDown
                  className={cn("h-4 w-4 transition-transform", resourcesOpen && "rotate-180")}
                />
              </button>
              <AnimatePresence>
                {resourcesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="pai-nav-dropdown absolute right-0 top-[calc(100%+0.5rem)] z-[100] min-w-[220px] rounded-2xl p-1.5"
                  >
                    {resourceLinks.map((r) => (
                      <Link
                        key={r.href}
                        href={r.href}
                        className="block rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-violet-500/25 hover:text-white"
                        onClick={() => setResourcesOpen(false)}
                      >
                        {r.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="hidden text-slate-200 hover:text-white sm:flex"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:block"
                >
                  <Button variant="glass" size="sm" className="text-slate-100">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden text-slate-200 hover:text-white sm:flex"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="hidden items-center gap-1.5 sm:flex">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-slate-100 hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="accent" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-100 lg:hidden"
              onClick={() => {
                setResourcesOpen(false);
                setMobileOpen(!mobileOpen);
              }}
              aria-label="Menu"
            >
              {mobileOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-violet-500/20 lg:hidden"
            >
              <div className="max-h-[75vh] space-y-0.5 overflow-y-auto p-3">
                {[...navLinks, { href: submitTaskHref, label: "Submit Task" }].map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    className={cn(
                      "block rounded-xl px-4 py-3 text-sm font-medium",
                      isActive(link.href.startsWith("/login") ? "/submit-task" : link.href)
                        ? "bg-violet-500/25 text-white"
                        : "text-slate-200 hover:bg-white/10 hover:text-white"
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {resourceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <div className="flex gap-2 pt-3">
                    <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full border-slate-500 text-slate-100">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button variant="accent" className="w-full">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
