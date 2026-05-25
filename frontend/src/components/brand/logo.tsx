import Link from "next/link";
import { SITE_CONFIG } from "@/data/site-content";
import { cn } from "@/lib/utils";
import { LogoMark } from "./logo-mark";

export function BrandLogo({
  showName = true,
  className,
  size = 44,
}: {
  showName?: boolean;
  className?: string;
  size?: number;
}) {
  return (
    <Link href="/" className={cn("group flex min-w-0 items-center gap-3", className)}>
      <LogoMark size={size} priority />
      {showName && (
        <div className="hidden min-w-0 flex-col sm:flex">
          <span className="pai-brand-text text-sm font-extrabold leading-tight tracking-tight md:text-[1.05rem]">
            {SITE_CONFIG.name}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-400/70">
            Learn · Build · Certify
          </span>
        </div>
      )}
    </Link>
  );
}
