"use client";

import { ArrowRight, ChevronDown, ChevronUp, Minus } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import * as React from "react";
import { Sigil } from "@/components/brand/Sigil";
import { Delta, RiskBadge } from "@/components/ui/Badge";
import { Segmented } from "@/components/ui/Field";
import { ChartSkeleton } from "@/components/ui/States";
import { cn } from "@/lib/cn";
import { FIRMS } from "@/lib/data/firms";
import { RANGES, type Range } from "@/lib/data/series";
import { formatPct, formatUsdg } from "@/lib/format";
import { useCycleIndex } from "@/lib/hooks";
import type { Firm } from "@/lib/types";

const LeagueChart = dynamic(() => import("@/components/charts/LeagueChart"), {
  ssr: false,
  loading: () => <ChartSkeleton className="h-[340px] w-full" />,
});

const COLS =
  "grid-cols-[44px_minmax(0,1.5fr)_86px_92px_84px_92px_90px_104px]";

export function LeagueBoard() {
  const [range, setRange] = React.useState<Range>("30D");
  const [focus, setFocus] = React.useState<string | null>(null);
  const ranked = React.useMemo(
    () => [...FIRMS].sort((a, b) => a.rank - b.rank),
    [],
  );

  // A recent decision highlights its league row, so the board visibly breathes.
  const pulseIndex = useCycleIndex(ranked.length, 5200);

  return (
    <div className="space-y-4">
      {/* ---------------- Chart ---------------- */}
      <section
        aria-label="Season performance"
        className="rounded-[18px] border border-white/[0.07] bg-[#0a0c0b]"
      >
        <header className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[15px] font-medium tracking-[-0.02em] text-gallery">
              Season performance
            </h2>
            <p className="mt-1.5 text-[12.5px] text-mist">
              {focus
                ? `Isolating ${FIRMS.find((f) => f.slug === focus)?.name}. Select again to release.`
                : "All nine firms on one axis. Select a firm to isolate its curve."}
            </p>
          </div>
          <Segmented
            size="sm"
            ariaLabel="Time range"
            value={range}
            onChange={setRange}
            options={RANGES.map((r) => ({ value: r, label: r }))}
          />
        </header>

        <div className="p-4 pr-5 sm:p-5">
          <LeagueChart range={range} focus={focus} />

          <div className="mt-5 flex flex-wrap gap-1.5">
            {ranked.map((f) => {
              const on = focus === f.slug;
              return (
                <button
                  key={f.slug}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFocus(on ? null : f.slug)}
                  className={cn(
                    "focus-ring inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-[11.5px] tracking-[-0.01em] transition-all duration-250",
                    on
                      ? "border-lime/40 bg-lime/[0.09] text-lime"
                      : "border-white/[0.08] text-mist hover:border-white/18 hover:text-gallery",
                  )}
                >
                  <Sigil id={f.slug} className="size-3.5" />
                  {f.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- Standings ---------------- */}
      <section
        aria-label="Standings"
        className="overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#0a0c0b]"
      >
        <header className="flex items-center justify-between gap-4 border-b border-white/[0.06] p-5">
          <h2 className="text-[15px] font-medium tracking-[-0.02em] text-gallery">
            Standings
          </h2>
          <span className="label text-slate">Risk-adjusted</span>
        </header>

        {/* Desktop */}
        <div className="hidden overflow-x-auto lg:block">
          <div className="min-w-[940px]">
            <div
              className={cn(
                "grid items-center gap-3 border-b border-white/[0.06] bg-white/[0.02] px-5 py-3",
                COLS,
              )}
            >
              {[
                "Rank",
                "Firm",
                "Risk score",
                "30D",
                "Drawdown",
                "Consistency",
                "Breaches",
                "Capital",
              ].map((h, i) => (
                <span
                  key={h}
                  className={cn("label text-slate", i >= 2 && "text-right")}
                >
                  {h}
                </span>
              ))}
            </div>

            {ranked.map((f, i) => (
              <LeagueRow
                key={f.slug}
                firm={f}
                highlighted={i === pulseIndex}
                onHover={() => setFocus(f.slug)}
              />
            ))}
          </div>
        </div>

        {/* Mobile */}
        <ul className="divide-y divide-white/[0.05] lg:hidden">
          {ranked.map((f, i) => (
            <li key={f.slug}>
              <LeagueCard firm={f} highlighted={i === pulseIndex} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function RankChange({ change }: { change: number }) {
  if (change === 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] text-slate">
        <Minus className="size-3" strokeWidth={1.8} />
      </span>
    );
  const up = change > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[11px]",
        up ? "text-active" : "text-coral",
      )}
      title={`${up ? "Up" : "Down"} ${Math.abs(change)} since last review`}
    >
      {up ? (
        <ChevronUp className="size-3" strokeWidth={2.2} />
      ) : (
        <ChevronDown className="size-3" strokeWidth={2.2} />
      )}
      {Math.abs(change)}
    </span>
  );
}

function LeagueRow({
  firm,
  highlighted,
  onHover,
}: {
  firm: Firm;
  highlighted: boolean;
  onHover: () => void;
}) {
  return (
    <Link
      href={`/firms/${firm.slug}`}
      onMouseEnter={onHover}
      className={cn(
        "group grid items-center gap-3 border-b border-white/[0.05] px-5 py-3.5 transition-colors duration-700 last:border-b-0 hover:bg-white/[0.035] focus-visible:bg-white/[0.04] focus-visible:outline-none",
        COLS,
        highlighted && "bg-lime/[0.035]",
      )}
    >
      <span className="flex items-center gap-1.5">
        <span className="num text-[15px] font-medium text-titanium">
          {firm.rank}
        </span>
        <RankChange change={firm.rankChange} />
      </span>

      <span className="flex min-w-0 items-center gap-3">
        <Sigil id={firm.slug} className="size-[22px] shrink-0 text-titanium" />
        <span className="min-w-0">
          <span className="block truncate text-[13.5px] font-medium tracking-[-0.015em] text-gallery">
            {firm.name}
          </span>
          <span className="mt-0.5 block truncate text-[11.5px] text-mist">
            {firm.strategy}
          </span>
        </span>
      </span>

      <span className="num text-right text-[13.5px] font-medium text-gallery">
        {firm.riskScore.toFixed(2)}
      </span>
      <span className="text-right">
        <Delta value={firm.return30d} size="sm" showGlyph={false} />
      </span>
      <span className="num text-right text-[12.5px] text-titanium">
        {formatPct(firm.maxDrawdown)}
      </span>
      <span className="flex items-center justify-end gap-2">
        <span className="h-[3px] w-10 overflow-hidden rounded-full bg-white/[0.07]">
          <span
            className="block h-full rounded-full bg-titanium/70"
            style={{ width: `${firm.consistency}%` }}
          />
        </span>
        <span className="num text-[12px] text-mist">{firm.consistency}</span>
      </span>
      <span
        className={cn(
          "num text-right text-[12.5px]",
          firm.mandateViolations > 0 ? "text-amber" : "text-slate",
        )}
      >
        {firm.mandateViolations}
      </span>
      <span className="num text-right text-[12.5px] text-mist">
        {formatUsdg(firm.capital, { compact: true })}
      </span>
    </Link>
  );
}

function LeagueCard({
  firm,
  highlighted,
}: {
  firm: Firm;
  highlighted: boolean;
}) {
  return (
    <Link
      href={`/firms/${firm.slug}`}
      className={cn(
        "focus-ring block px-5 py-4 transition-colors duration-700",
        highlighted && "bg-lime/[0.035]",
      )}
    >
      <div className="flex items-center gap-3">
        <span className="flex w-9 shrink-0 items-center gap-1">
          <span className="num text-[14px] font-medium text-titanium">
            {firm.rank}
          </span>
          <RankChange change={firm.rankChange} />
        </span>
        <Sigil id={firm.slug} className="size-6 shrink-0 text-titanium" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13.5px] font-medium tracking-[-0.015em] text-gallery">
            {firm.name}
          </span>
          <span className="mt-0.5 block truncate text-[11.5px] text-mist">
            {firm.strategy}
          </span>
        </span>
        <span className="text-right">
          <span className="num block text-[14px] font-medium text-gallery">
            {firm.riskScore.toFixed(2)}
          </span>
          <span className="label mt-1 block text-slate">Risk score</span>
        </span>
      </div>

      <dl className="mt-3.5 grid grid-cols-4 gap-3 border-t border-white/[0.06] pt-3">
        {[
          { l: "30D", v: <Delta value={firm.return30d} size="sm" showGlyph={false} /> },
          { l: "Drawdown", v: formatPct(firm.maxDrawdown) },
          { l: "Consistency", v: firm.consistency },
          {
            l: "Breaches",
            v: (
              <span className={firm.mandateViolations > 0 ? "text-amber" : undefined}>
                {firm.mandateViolations}
              </span>
            ),
          },
        ].map((m) => (
          <div key={m.l}>
            <dt className="label text-slate">{m.l}</dt>
            <dd className="num mt-1.5 text-[12.5px] text-titanium">{m.v}</dd>
          </div>
        ))}
      </dl>
    </Link>
  );
}

/* ---------------- Matchup ---------------- */

const METRICS = [
  { key: "return30d", label: "30D return", format: (v: number) => formatPct(v), higher: true },
  { key: "volatility", label: "Volatility", format: (v: number) => `${v.toFixed(1)}%`, higher: false },
  { key: "maxDrawdown", label: "Max drawdown", format: (v: number) => formatPct(v), higher: true },
  { key: "turnover", label: "Turnover", format: (v: number) => `${v}%`, higher: false },
  { key: "concentration", label: "Concentration", format: (v: number) => `${v}%`, higher: false },
  { key: "decisionsPerWeek", label: "Decisions / week", format: (v: number) => String(v), higher: true },
] as const;

export function Matchup({ a, b }: { a: Firm; b: Firm }) {
  return (
    <section
      aria-label={`${a.name} versus ${b.name}`}
      className="overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#0a0c0b]"
    >
      <header className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="label text-slate">Matchup</p>
          <h2 className="mt-2.5 text-[17px] font-medium tracking-[-0.02em] text-gallery">
            {a.name} <span className="text-slate">vs</span> {b.name}
          </h2>
        </div>
        <Link
          href={`/firms/${a.slug}`}
          className="focus-ring inline-flex items-center gap-1.5 self-start rounded-[9px] border border-white/12 px-3 py-2 text-[12.5px] text-titanium transition-colors hover:border-white/22 hover:text-gallery sm:self-auto"
        >
          Open matchup
          <ArrowRight className="size-3.5" strokeWidth={1.6} />
        </Link>
      </header>

      <div className="grid grid-cols-3 items-center gap-3 border-b border-white/[0.06] px-5 py-4">
        <Side firm={a} align="left" />
        <span className="label text-center text-slate">Season to date</span>
        <Side firm={b} align="right" />
      </div>

      <dl className="px-5 pb-5">
        {METRICS.map((m) => {
          const av = a[m.key] as number;
          const bv = b[m.key] as number;
          const aWins = m.higher ? av > bv : av < bv;
          const bWins = m.higher ? bv > av : bv < av;
          const total = Math.abs(av) + Math.abs(bv) || 1;
          return (
            <div
              key={m.key}
              className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-b border-white/[0.05] py-3.5 last:border-b-0"
            >
              <div className="flex items-center justify-end gap-3">
                <span
                  className={cn(
                    "num text-[13px]",
                    aWins ? "text-gallery" : "text-mist",
                  )}
                >
                  {m.format(av)}
                </span>
                <span className="h-[3px] w-full max-w-[110px] overflow-hidden rounded-full bg-white/[0.06]">
                  <span
                    className={cn(
                      "ml-auto block h-full rounded-full",
                      aWins ? "bg-lime/80" : "bg-titanium/40",
                    )}
                    style={{ width: `${(Math.abs(av) / total) * 100}%` }}
                  />
                </span>
              </div>
              <dt className="label whitespace-nowrap text-center text-slate">
                {m.label}
              </dt>
              <div className="flex items-center gap-3">
                <span className="h-[3px] w-full max-w-[110px] overflow-hidden rounded-full bg-white/[0.06]">
                  <span
                    className={cn(
                      "block h-full rounded-full",
                      bWins ? "bg-lime/80" : "bg-titanium/40",
                    )}
                    style={{ width: `${(Math.abs(bv) / total) * 100}%` }}
                  />
                </span>
                <span
                  className={cn(
                    "num text-[13px]",
                    bWins ? "text-gallery" : "text-mist",
                  )}
                >
                  {m.format(bv)}
                </span>
              </div>
            </div>
          );
        })}
      </dl>
    </section>
  );
}

function Side({ firm, align }: { firm: Firm; align: "left" | "right" }) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3",
        align === "right" && "flex-row-reverse text-right",
      )}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-[11px] border border-white/[0.09] bg-white/[0.025] text-titanium">
        <Sigil id={firm.slug} className="size-6" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13.5px] font-medium tracking-[-0.015em] text-gallery">
          {firm.name}
        </span>
        <span className="mt-1 block">
          <RiskBadge risk={firm.risk} showBars={false} />
        </span>
      </span>
    </div>
  );
}
