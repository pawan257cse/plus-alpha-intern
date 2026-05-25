import { SITE_CONFIG } from "@/data/site-content";
import { cn } from "@/lib/utils";

export function BrandGradientText({
  className,
  as: Tag = "span",
}: {
  className?: string;
  as?: "span" | "h1" | "h2" | "p";
}) {
  return (
    <Tag className={cn("pai-brand-text font-bold tracking-tight", className)}>
      {SITE_CONFIG.name}
    </Tag>
  );
}
