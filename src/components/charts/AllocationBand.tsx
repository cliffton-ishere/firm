"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { useInView } from "@/lib/hooks";
import type { PortfolioAllocation } from "@/lib/types";

/**
 * Stacked allocation band. Weight is read as length, conviction as opacity —
 * a portfolio at a glance without resorting to a pie chart.
 */

const TONE = [
  "var(--color-lime)",
  "rgba(199,255,74,0.72)",
  "rgba(184,189,185,0.9)",
  "rgba(184,189,185,0.66)",
  "rgba(184,189,185,0.46)",
  "rgba(255,255,255,0.2)",
  "rgba(255,255,255,0.12)",
];

export function AllocationBand({
  allocations,
  className,
  height = 10,
  showLabels = false,
  activeTicker,
  onHover,
}: {
  allocations: PortfolioAllocation[];
  className?: string;
  height?: number;
  showLabels?: boolean;
  activeTicker?: string | null;
  onHover?: (ticker: string | null) => void;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div className={cn("min-w-0", className)} ref={ref}>
      <div
        className="flex w-full gap-[2px] overflow-hidden rounded-full"
        style={{ height }}
        role="img"
        aria-label={`Allocation: ${allocations
          .map((a) => `${a.ticker} ${a.weight}%`)
          .join(", ")}`}
      >
        {allocations.map((a, i) => {
          const dim = activeTicker != null && activeTicker !== a.ticker;
          return (
            <span
              key={a.ticker}
              onMouseEnter={() => onHover?.(a.ticker)}
              onMouseLeave={() => onHover?.(null)}
              className="block h-full rounded-[2px] transition-[width,opacity] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                width: inView ? `${a.weight}%` : "0%",
                background:
                  a.kind === "stable"
                    ? "repeating-linear-gradient(115deg, rgba(255,255,255,0.28) 0 3px, rgba(255,255,255,0.1) 3px 6px)"
                    : TONE[Math.min(i, TONE.length - 1)],
                opacity: dim ? 0.28 : 1,
                transitionDelay: inView ? `${i * 55}ms` : "0ms",
              }}
            />
          );
        })}
      </div>

      {showLabels && (
        <ul className="mt-3.5 flex flex-wrap gap-x-4 gap-y-2">
          {allocations.map((a, i) => (
            <li
              key={a.ticker}
              className="flex items-center gap-1.5 text-[11.5px] text-mist"
            >
              <span
                aria-hidden
                className="size-[6px] shrink-0 rounded-[2px]"
                style={{
                  background:
                    a.kind === "stable"
                      ? "rgba(255,255,255,0.35)"
                      : TONE[Math.min(i, TONE.length - 1)],
                }}
              />
              <span className="text-titanium">{a.ticker}</span>
              <span className="num">{a.weight}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Compact three-position preview used on firm cards. */
export function TopAllocations({
  allocations,
  className,
}: {
  allocations: PortfolioAllocation[];
  className?: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const top = allocations.slice(0, 3);
  // Normalised against a 30% reference so the leading position is not always
  // pegged to a full bar — the reader sees real proportion, not just order.
  const max = Math.max(...top.map((a) => a.weight), 30);

  return (
    <div ref={ref} className={cn("space-y-2", className)}>
      {top.map((a, i) => (
        <div key={a.ticker} className="flex items-center gap-3">
          <span className="mono w-[46px] shrink-0 text-[11px] text-titanium">
            {a.ticker}
          </span>
          <span className="h-[4px] min-w-0 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-lime/55 to-lime transition-[width] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                width: inView ? `${(a.weight / max) * 100}%` : "0%",
                transitionDelay: inView ? `${120 + i * 90}ms` : "0ms",
              }}
            />
          </span>
          <span className="num w-[34px] shrink-0 text-right text-[11px] text-mist">
            {a.weight}%
          </span>
        </div>
      ))}
    </div>
  );
}
