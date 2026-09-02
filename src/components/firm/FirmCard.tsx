"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Sigil } from "@/components/brand/Sigil";
import { Sparkline } from "@/components/charts/Sparkline";
import { TopAllocations } from "@/components/charts/AllocationBand";
import { Delta, RiskBadge, StateBadge } from "@/components/ui/Badge";
import { sparkFor } from "@/lib/data/series";
import { cn } from "@/lib/cn";
import { formatPct, formatUsdg } from "@/lib/format";
import { useCycleIndex } from "@/lib/hooks";
import type { Firm } from "@/lib/types";

export function FirmCard({
  firm,
  index = 0,
  className,
}: {
  firm: Firm;
  index?: number;
  className?: string;
}) {
  const i = useCycleIndex(firm.stateCycle.length, 7000, index * 900);
  const state = firm.stateCycle[i] ?? firm.state;
  const spark = React.useMemo(() => sparkFor(firm), [firm]);
  const live = state.kind === "Evaluating" || state.kind === "Simulating";

  return (
    <Link
      href={`/firms/${firm.slug}`}
      className={cn(
        "focus-ring group relative flex flex-col overflow-hidden rounded-[16px] border border-white/[0.075] bg-[#0b0d0c] p-5",
        "transition-[transform,border-color,background-color,box-shadow] duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-[2px] hover:border-white/[0.16] hover:bg-[#0e100f]",
        "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_28px_60px_-34px_rgba(0,0,0,0.95)]",
        className,
      )}
    >
      {/* Optical highlight along the top edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Header */}
      <div className="flex items-start gap-3.5">
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-[12px] border border-white/[0.09] bg-white/[0.03] text-titanium transition-colors duration-500",
            live && "border-lime/20 text-gallery",
          )}
        >
          <Sigil id={firm.slug} active={live} className="size-7" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="truncate text-[15px] font-medium tracking-[-0.02em] text-gallery">
              {firm.name}
            </h3>
            <span className="mono ml-auto shrink-0 text-[10.5px] text-slate">
              #{firm.rank}
            </span>
          </div>
          <p className="mt-1 truncate text-[12px] text-mist">{firm.strategy}</p>
        </div>
      </div>

      {/* State */}
      <div className="mt-4 flex min-h-[18px] items-center">
        <StateBadge label={state.label} kind={state.kind} />
      </div>

      {/* Performance */}
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <div className="label text-slate">30D</div>
          <Delta value={firm.return30d} size="lg" className="mt-1.5" />
        </div>
        <div className="h-[34px] w-[112px] shrink-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100">
          <Sparkline
            values={spark}
            id={firm.slug}
            positive={firm.return30d >= 0}
            className="h-full w-full"
          />
        </div>
      </div>

      {/* Risk row */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3.5">
        <RiskBadge risk={firm.risk} />
        <span className="num text-[11.5px] text-mist">
          Drawdown{" "}
          <span className="text-titanium">{formatPct(firm.maxDrawdown)}</span>
        </span>
      </div>

      {/* Allocations */}
      <div className="mt-4">
        <div className="label mb-3 text-slate">Top positions</div>
        <TopAllocations allocations={firm.allocations} />
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3.5">
        <span className="num text-[11.5px] text-slate">
          {formatUsdg(firm.capital, { compact: true })}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[12px] text-titanium transition-colors duration-300 group-hover:text-gallery">
          Inspect firm
          <ArrowRight
            className="size-3.5 transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5"
            strokeWidth={1.6}
          />
        </span>
      </div>
    </Link>
  );
}
