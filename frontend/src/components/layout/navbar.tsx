"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, ChevronDown } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

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

  const isResourceActive = () => resourceLinks.some((r) => isActive(r.href));

  const navLinkClass = (href: string, highlight?: boolean) =>
    cn(
      "pai-nav-link group whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium tracking-[0.01em] xl:px-4 xl:text-sm",
      isActive(href)
        ? "pai-nav-link-active text-white"
        : highlight
          ? "text-slate-700 dark:text-slate-200 hover:bg-white/80 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
          : "text-slate-700 dark:text-slate-200 hover:bg-white/80 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
    );

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "pai-nav-shell relative w-full transition-shadow duration-300",
          scrolled && "shadow-[0_16px_46px_rgba(0,0,0,0.42)]"
        )}
      >
        <nav className="mx-auto flex min-h-[4.25rem] max-w-7xl flex-col gap-2 px-3 py-2 sm:px-5 md:px-6 lg:min-h-[5rem] lg:flex-row lg:items-center lg:justify-between lg:gap-3 lg:px-8">
          <div className="flex w-full items-center justify-between gap-3 lg:min-w-0 lg:flex-1 lg:justify-start">
            <BrandLogo size={42} className="shrink-0" />

            <div className="flex items-center gap-1 sm:gap-1.5 lg:hidden">
              {mounted ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="pai-nav-icon-button text-slate-200 hover:text-white"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              ) : (
                <span className="h-9 w-9" aria-hidden="true" />
              )}

              <Button
                variant="ghost"
                size="icon"
                className="pai-nav-menu-button text-slate-100"
                onClick={() => {
                  setResourcesOpen(false);
                  setMobileOpen(!mobileOpen);
                }}
                aria-label="Menu"
              >
                {mobileOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>

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
                "ml-0.5 border border-cyan-400/25 bg-gradient-to-r from-cyan-400/12 via-emerald-500/10 to-cyan-500/12 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_10px_30px_rgba(14,165,233,0.12)]"
              )}
            >
              Submit Task
            </Link>

            <div ref={resourcesRef} className="relative ml-0.5">
              <button
                type="button"
                aria-expanded={resourcesOpen}
                aria-haspopup="menu"
                aria-controls="resources-menu"
                className={cn(
                  "pai-nav-link flex items-center gap-1 rounded-full px-3 py-2 text-[13px] font-medium tracking-[0.01em] xl:px-4 xl:text-sm",
                  resourcesOpen || isResourceActive()
                    ? "pai-nav-link-active text-white"
                    : "text-slate-700 dark:text-slate-200 hover:bg-white/5 hover:text-white dark:hover:bg-white/5"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setResourcesOpen((o) => !o);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setResourcesOpen(false);
                }}
              >
                More
                <ChevronDown className={cn("h-4 w-4 transition-transform", resourcesOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {resourcesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    id="resources-menu"
                    role="menu"
                    className="pai-nav-dropdown absolute right-0 top-[calc(100%+0.5rem)] z-[1000] min-w-[220px] rounded-2xl p-1.5"
                  >
                    {resourceLinks.map((r) => (
                      <Link
                        key={r.href}
                        href={r.href}
                        className="block rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 transition hover:bg-white/5 hover:text-white"
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

          <div className="hidden items-center gap-1.5 sm:flex lg:justify-end">
            {mounted ? (
              <Button
                variant="ghost"
                size="icon"
                className="pai-nav-icon-button text-slate-200 hover:text-white"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            ) : (
              <span className="h-9 w-9" aria-hidden="true" />
            )}

            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="glass" size="sm" className="pai-nav-secondary-button text-slate-100">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="pai-nav-icon-button text-slate-200 hover:text-white"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="pai-nav-login-button text-slate-100 hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="accent" size="sm" className="pai-nav-register-button">
                    Register
                  </Button>
                </Link>
              </div>
            )}

          </div>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pai-nav-mobile-panel border-t border-cyan-500/20 lg:hidden"
            >
              <div className="max-h-[75vh] space-y-0.5 overflow-y-auto p-3">
                {[...navLinks, { href: submitTaskHref, label: "Submit Task" }].map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    className={cn(
                      "pai-nav-mobile-link block rounded-xl px-4 py-3 text-sm font-medium",
                      isActive(link.href.startsWith("/login") ? "/submit-task" : link.href)
                        ? "bg-cyan-500/20 text-white"
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
                      <Button variant="outline" className="pai-nav-login-button w-full border-slate-500 text-slate-100">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button variant="accent" className="pai-nav-register-button w-full">
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
