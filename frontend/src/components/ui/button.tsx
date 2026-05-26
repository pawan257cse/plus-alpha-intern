import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-500 text-white shadow-[0_4px_24px_rgba(34,211,238,0.42)] hover:shadow-[0_8px_32px_rgba(34,211,238,0.55)] hover:brightness-110 active:scale-[0.98]",
        outline:
          "rounded-xl border border-cyan-400/30 bg-cyan-500/5 text-foreground backdrop-blur-xl hover:border-cyan-400/50 hover:bg-cyan-500/10",
        ghost: "rounded-xl hover:bg-cyan-500/10 hover:text-cyan-100",
        glass:
          "rounded-xl border border-white/12 bg-white/5 text-foreground backdrop-blur-xl hover:border-cyan-400/35 hover:bg-cyan-500/10",
        accent:
          "rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-[0_4px_20px_rgba(52,211,153,0.35)] hover:brightness-110 active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base rounded-2xl",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
