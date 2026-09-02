"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/cn";

export function Disclosure({
  summary,
  meta,
  children,
  defaultOpen = false,
  className,
}: {
  summary: React.ReactNode;
  meta?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const id = React.useId();

  return (
    <div className={cn("border-b border-white/[0.07]", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="focus-ring group flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="min-w-0 flex-1 text-[14px] font-medium tracking-[-0.015em] text-gallery">
          {summary}
        </span>
        {meta && (
          <span className="hidden shrink-0 text-[12px] text-mist sm:block">
            {meta}
          </span>
        )}
        <Plus
          aria-hidden
          strokeWidth={1.5}
          className={cn(
            "size-4 shrink-0 text-slate transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-titanium",
            open && "rotate-45",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 pr-8 text-[13px] leading-relaxed text-mist">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
