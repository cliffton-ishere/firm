"use client";

import dynamic from "next/dynamic";
import * as React from "react";
import { Delta } from "@/components/ui/Badge";
import { Segmented } from "@/components/ui/Field";
import { ChartSkeleton } from "@/components/ui/States";
import { RANGES, returnFor, type Range } from "@/lib/data/series";
import { BENCHMARK } from "@/lib/data/firms";
import { cn } from "@/lib/cn";
import { formatPct } from "@/lib/format";
import type { Firm } from "@/lib/types";

/** Recharts is loaded on demand so the first paint stays light. */
const PerformanceChart = dynamic(
  () => import("@/components/charts/PerformanceChart"),
  { ssr: false, loading: () => <ChartSkeleton className="h-[300px] w-full" /> },
);

export function PerformancePanel({
  firm,
  className,
  height = 300,
}: {
  firm: Firm;
  className?: string;
  height?: number;
}) {
  const [range, setRange] = React.useState<Range>("30D");
  const [compare, setCompare] = React.useState(true);

  const value = returnFor(firm, range);
  const bench = returnFor(BENCHMARK, range);
  const isBenchmark = firm.slug === BENCHMARK.slug;
  const spread = value - bench;

  return (
    <section
      className={cn(
        "rounded-[18px] border border-white/[0.07] bg-[#0a0c0b]",
        className,
      )}
      aria-label="Performance"
    >
      <header className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="label text-slate">Performance · {range}</h2>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <Delta value={value} size="xl" />
            {!isBenchmark && (
              <span className="text-[12.5px] text-mist">
                Benchmark{" "}
                <span className="num text-titanium">{formatPct(bench)}</span>
                <span aria-hidden className="mx-2 text-slate">
                  ·
                </span>
                Spread{" "}
                <span
                  className={cn(
                    "num",
                    spread >= 0 ? "text-active" : "text-coral",
                  )}
                >
                  {formatPct(spread)}
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Segmented
            size="sm"
            ariaLabel="Time range"
            value={range}
            onChange={setRange}
            options={RANGES.map((r) => ({ value: r, label: r }))}
          />
          {!isBenchmark && (
            <button
              type="button"
              aria-pressed={compare}
              onClick={() => setCompare((c) => !c)}
              className={cn(
                "focus-ring inline-flex h-7 items-center gap-2 rounded-[8px] border px-2.5 text-[11.5px] tracking-[-0.01em] transition-colors",
                compare
                  ? "border-white/16 bg-white/[0.07] text-gallery"
                  : "border-white/[0.08] bg-transparent text-mist hover:text-titanium",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "h-px w-3.5",
                  compare ? "bg-titanium" : "bg-slate",
                )}
                style={{
                  backgroundImage: compare
                    ? "repeating-linear-gradient(to right, currentColor 0 3px, transparent 3px 6px)"
                    : undefined,
                }}
              />
              BENCHMARK-01
            </button>
          )}
        </div>
      </header>

      <div className="p-4 pr-5 sm:p-5">
        <PerformanceChart
          firm={firm}
          range={range}
          compare={compare && !isBenchmark}
          height={height}
        />
      </div>

      <footer className="border-t border-white/[0.06] px-5 py-3">
        <p className="text-[11px] leading-relaxed text-slate">
          Genesis League tracked strategy performance. Figures describe the
          firm&rsquo;s mandate portfolio and are not a record of customer
          deposits or a projection of future results.
        </p>
      </footer>
    </section>
  );
}
