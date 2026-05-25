import Image from "next/image";
import { SITE_CONFIG } from "@/data/site-content";
import { cn } from "@/lib/utils";

/** Plain logo image — no glow ring or circle behind it */
export function LogoMark({
  size = 44,
  className,
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={SITE_CONFIG.logoSrc}
        alt={`${SITE_CONFIG.name} logo`}
        fill
        className="object-contain"
        sizes={`${size}px`}
        priority={priority}
      />
    </div>
  );
}
