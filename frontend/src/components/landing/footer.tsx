import Link from "next/link";
import { Mail, MapPin, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { SITE_CONFIG } from "@/data/site-content";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/domains", label: "Domains" },
  { href: "/about", label: "About" },
  { href: "#faq", label: "FAQ" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refund", label: "Refund Policy" },
];

const talentLinks = [
  { href: "/internship", label: "Internship Program" },
  { href: "/assessment", label: "Assessment" },
  { href: "/certificates/verify", label: "Verify Certificate" },
  { href: "/submit-task", label: "Submit Task" },
];

const linkClass =
  "text-sm text-slate-300 transition hover:text-white hover:underline underline-offset-4";

export function Footer() {
  return (
    <footer className="pai-footer relative border-t border-violet-500/25 px-4 py-16">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <BrandLogo size={40} className="items-start" />
          <p className="mt-4 text-sm leading-relaxed text-slate-300">{SITE_CONFIG.tagline}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-violet-200">
            <Sparkles className="h-3 w-3 text-fuchsia-300" />
            Free registration · Pay on task submit
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-violet-300">
            Quick Links
          </h4>
          <ul className="space-y-2.5">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-violet-300">
            Program
          </h4>
          <ul className="space-y-2.5">
            {talentLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-6 space-y-2">
            {legalLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-xs text-slate-400 transition hover:text-slate-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-violet-300">
            Contact
          </h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
              {SITE_CONFIG.address}
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-slate-200 underline-offset-4 hover:text-white hover:underline"
              >
                {SITE_CONFIG.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-violet-500/20 pt-8 text-center">
        <p className="text-sm text-slate-300">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-white">{SITE_CONFIG.name}</span> ·{" "}
          {SITE_CONFIG.msmeNote}
        </p>
        <p className="mt-2 text-xs text-slate-400">{SITE_CONFIG.disclaimer}</p>
      </div>
    </footer>
  );
}
