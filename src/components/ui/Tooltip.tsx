"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/cn";

export function Tooltip({
  content,
  children,
  side = "top",
  className,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom";
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={open ? id : undefined} className="inline-flex">
        {children}
      </span>
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: side === "top" ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: side === "top" ? 3 : -3 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "pointer-events-none absolute left-1/2 z-50 w-max max-w-[240px] -translate-x-1/2",
              "rounded-lg border border-white/12 bg-[#0d100f]/96 px-2.5 py-2 backdrop-blur-xl",
              "text-[11.5px] leading-relaxed text-titanium",
              "shadow-[0_20px_44px_-24px_rgba(0,0,0,0.95)]",
              side === "top" ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]",
            )}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export function InfoDot({ content }: { content: React.ReactNode }) {
  return (
    <Tooltip content={content}>
      <button
        type="button"
        aria-label="More information"
        className="focus-ring grid size-4 place-items-center rounded-full text-slate transition-colors hover:text-titanium"
      >
        <Info className="size-3.5" strokeWidth={1.6} />
      </button>
    </Tooltip>
  );
}
