"use client";

import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "signal";
type Size = "sm" | "md" | "lg";
type Ground = "dark" | "light";

const SIZE: Record<Size, string> = {
  sm: "h-8 px-3 text-[12.5px] gap-1.5 rounded-[8px]",
  md: "h-10 px-4 text-[13.5px] gap-2 rounded-[10px]",
  lg: "h-12 px-6 text-[15px] gap-2.5 rounded-[12px]",
};

function variantClasses(v: Variant, ground: Ground) {
  if (ground === "light") {
    switch (v) {
      case "primary":
        return "bg-ink text-gallery border border-ink/80 hover:bg-ink-3 active:bg-ink active:scale-[0.985] shadow-[0_1px_2px_rgba(8,9,9,0.18),0_10px_24px_-14px_rgba(8,9,9,0.55)]";
      case "secondary":
        return "glass-light text-ink hover:bg-white/85 active:scale-[0.985]";
      case "outline":
        return "border border-ink/15 text-ink hover:bg-ink/[0.04] active:scale-[0.985]";
      case "signal":
        return "bg-lime text-[#111a00] border border-lime-dim/60 hover:brightness-[1.06] active:scale-[0.985] shadow-[0_1px_2px_rgba(8,9,9,0.16),0_12px_28px_-16px_rgba(158,203,53,0.75)]";
      case "ghost":
        return "text-ink/70 hover:text-ink hover:bg-ink/[0.045]";
    }
  }
  switch (v) {
    case "primary":
      return "bg-gallery text-ink border border-white/20 hover:bg-white active:scale-[0.985] shadow-[0_1px_2px_rgba(0,0,0,0.5)]";
    case "secondary":
      return "glass text-gallery hover:bg-white/[0.075] active:scale-[0.985]";
    case "outline":
      return "border border-white/14 text-gallery hover:bg-white/[0.05] hover:border-white/22 active:scale-[0.985]";
    case "signal":
      return "bg-lime text-[#111a00] border border-lime/30 hover:brightness-[1.07] active:scale-[0.985] shadow-[0_10px_30px_-16px_rgba(199,255,74,0.7)]";
    case "ghost":
      return "text-titanium hover:text-gallery hover:bg-white/[0.05]";
  }
}

const BASE =
  "relative inline-flex items-center justify-center font-medium tracking-[-0.01em] whitespace-nowrap select-none transition-[background,color,border-color,transform,box-shadow,filter] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:pointer-events-none disabled:opacity-30 disabled:saturate-[0.35]";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  ground?: Ground;
  loading?: boolean;
  iconOnly?: boolean;
}

export function Button({
  variant = "secondary",
  size = "md",
  ground = "dark",
  loading = false,
  iconOnly = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        BASE,
        SIZE[size],
        variantClasses(variant, ground),
        ground === "light" ? "focus-ring-light" : "focus-ring",
        iconOnly && "px-0 aspect-square",
        className,
      )}
    >
      {loading && (
        <span
          aria-hidden
          className="mr-1.5 size-3 animate-spin rounded-full border-[1.5px] border-current border-t-transparent opacity-70"
        />
      )}
      {children}
    </button>
  );
}

export interface ButtonLinkProps
  extends React.ComponentPropsWithoutRef<typeof Link> {
  variant?: Variant;
  size?: Size;
  ground?: Ground;
}

export function ButtonLink({
  variant = "secondary",
  size = "md",
  ground = "dark",
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      {...rest}
      className={cn(
        BASE,
        SIZE[size],
        variantClasses(variant, ground),
        ground === "light" ? "focus-ring-light" : "focus-ring",
        className,
      )}
    >
      {children}
    </Link>
  );
}
