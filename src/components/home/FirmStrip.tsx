"use client";

import Link from "next/link";
import * as React from "react";
import { Sigil } from "@/components/brand/Sigil";
import { Delta, StateBadge } from "@/components/ui/Badge";
import { FIRMS } from "@/lib/data/firms";
import { cn } from "@/lib/cn";
import { useCycleIndex, usePrefersReducedMotion } from "@/lib/hooks";
import type { Firm } from "@/lib/types";

/**
 * A slow, user-controllable strip of live firm states.
 * It drifts rather than marquees: hovering, focusing or touching it stops the
 * drift entirely and hands control back to the reader.
 */
export function FirmStrip({ className }: { className?: string }) {
  const scroller = React.useRef<HTMLDivElement>(null);
  const [paused, setPaused] = React.useState(false);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    if (reduced || paused) return;
    const el = scroller.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;
      const half = el.scrollWidth / 2;
      el.scrollLeft += dt * 0.022;
      if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, reduced]);

  const items = [...FIRMS, ...FIRMS];

  return (
    <div className={cn("relative", className)}>
      {/* Edge fades keep the strip inside the composition */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent sm:w-28"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent sm:w-28"
      />
      <div
        ref={scroller}
        role="region"
        aria-label="Live firm states"
        tabIndex={0}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        className="no-scrollbar focus-ring flex gap-3 overflow-x-auto rounded-[14px] py-1"
      >
        {items.map((firm, i) => (
          <StripCard key={`${firm.slug}-${i}`} firm={firm} index={i} />
        ))}
      </div>
    </div>
  );
}

function StripCard({ firm, index }: { firm: Firm; index: number }) {
  const i = useCycleIndex(firm.stateCycle.length, 8000, index * 640);
  const state = firm.stateCycle[i] ?? firm.state;
  const live = state.kind === "Evaluating" || state.kind === "Simulating";

  return (
    <Link
      href={`/firms/${firm.slug}`}
      className={cn(
        "focus-ring group flex w-[268px] shrink-0 items-center gap-3.5 rounded-[13px] border border-white/[0.07] bg-white/[0.022] px-3.5 py-3",
        "transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/[0.16] hover:bg-white/[0.05]",
      )}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-[10px] border border-white/[0.08] text-titanium",
          live && "border-lime/20",
        )}
      >
        <Sigil id={firm.slug} active={live} className="size-[22px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[13px] font-medium tracking-[-0.015em] text-gallery">
            {firm.name}
          </span>
          <Delta value={firm.return30d} size="sm" showGlyph={false} />
        </span>
        <span className="mt-1.5 block">
          <StateBadge label={state.label} kind={state.kind} compact />
        </span>
      </span>
    </Link>
  );
}
