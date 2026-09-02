"use client";

import * as React from "react";
import { AllocationBand } from "@/components/charts/AllocationBand";
import { Delta } from "@/components/ui/Badge";
import { InfoDot } from "@/components/ui/Tooltip";
import { cn } from "@/lib/cn";
import { useInView } from "@/lib/hooks";
import type { Firm } from "@/lib/types";

export function PortfolioPanel({
  firm,
  className,
}: {
  firm: Firm;
  className?: string;
}) {
  const [hover, setHover] = React.useState<string | null>(null);
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <section
      className={cn(
        "rounded-[18px] border border-white/[0.07] bg-[#0a0c0b]",
        className,
      )}
      aria-label="Portfolio"
    >
      <header className="flex items-start justify-between gap-4 border-b border-white/[0.06] p-5">
        <div>
          <h2 className="text-[15px] font-medium tracking-[-0.02em] text-gallery">
            Portfolio
          </h2>
          <p className="mt-1.5 text-[12.5px] text-mist">
            Current mandate weights and the conviction behind them.
          </p>
        </div>
        <span className="label shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-slate">
          {firm.allocations.length} positions
        </span>
      </header>

      <div className="p-5">
        <AllocationBand
          allocations={firm.allocations}
          height={12}
          activeTicker={hover}
          onHover={setHover}
        />

        {/* Header row */}
        <div
          ref={ref}
          className="mt-7 hidden grid-cols-[minmax(0,1.5fr)_72px_84px_minmax(0,1fr)_96px_84px] gap-3 border-b border-white/[0.06] pb-2.5 lg:grid"
        >
          <span className="label text-slate">Asset</span>
          <span className="label text-right text-slate">Weight</span>
          <span className="label text-right text-slate">Day</span>
          <span className="label flex items-center gap-1.5 text-slate">
            Conviction
            <InfoDot content="The agent's internal confidence in holding this position at its current weight, scored 0–100 at the last review." />
          </span>
          <span className="label text-right text-slate">Adjusted</span>
          <span className="label text-right text-slate">Ceiling</span>
        </div>

        <ul>
          {firm.allocations.map((a, i) => (
            <li
              key={a.ticker}
              onMouseEnter={() => setHover(a.ticker)}
              onMouseLeave={() => setHover(null)}
              className={cn(
                "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 border-b border-white/[0.045] py-3.5 transition-colors last:border-b-0",
                "lg:grid-cols-[minmax(0,1.5fr)_72px_84px_minmax(0,1fr)_96px_84px]",
                hover === a.ticker && "bg-white/[0.022]",
              )}
            >
              {/* Asset */}
              <span className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden
                  className={cn(
                    "size-[7px] shrink-0 rounded-[2px]",
                    a.kind === "stable"
                      ? "bg-white/35"
                      : i === 0
                        ? "bg-lime"
                        : "bg-titanium/70",
                  )}
                />
                <span className="min-w-0">
                  <span className="mono block text-[12.5px] text-gallery">
                    {a.ticker}
                  </span>
                  <span className="mt-0.5 block truncate text-[11.5px] text-mist">
                    {a.name}
                  </span>
                </span>
              </span>

              {/* Weight */}
              <span className="num text-right text-[13.5px] font-medium text-gallery lg:text-[13px]">
                {a.weight}%
              </span>

              {/* Day */}
              <span className="hidden text-right lg:block">
                {a.kind === "stable" ? (
                  <span className="num text-[12.5px] text-slate">—</span>
                ) : (
                  <Delta value={a.day} size="sm" showGlyph={false} />
                )}
              </span>

              {/* Conviction */}
              <span className="col-span-2 flex items-center gap-2.5 lg:col-span-1">
                <span className="h-[3px] min-w-0 flex-1 overflow-hidden rounded-full bg-white/[0.07] lg:max-w-[120px]">
                  <span
                    className="block h-full rounded-full bg-titanium/80 transition-[width] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      width: inView ? `${a.conviction}%` : "0%",
                      transitionDelay: inView ? `${i * 70}ms` : "0ms",
                    }}
                  />
                </span>
                <span className="num shrink-0 text-[11.5px] text-mist">
                  {a.conviction}
                </span>
              </span>

              {/* Last adjusted */}
              <span className="hidden text-right text-[12px] text-mist lg:block">
                {a.lastAdjusted}
              </span>

              {/* Ceiling */}
              <span className="num hidden text-right text-[12px] text-slate lg:block">
                {a.ceiling}%
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-[11px] leading-relaxed text-slate">
          Ceilings are enforced by the mandate. A proposal that would breach a
          ceiling is reduced or blocked by the risk governor before execution.
        </p>
      </div>
    </section>
  );
}
