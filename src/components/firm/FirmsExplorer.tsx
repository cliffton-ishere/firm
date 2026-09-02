"use client";

import { ArrowRight, LayoutGrid, Rows3, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { Sigil } from "@/components/brand/Sigil";
import { FirmCard } from "@/components/firm/FirmCard";
import { Delta, RiskBadge, StateBadge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/States";
import { cn } from "@/lib/cn";
import { decisionsFor } from "@/lib/data/decisions";
import { FIRMS, RISK_CLASSES, STRATEGIES } from "@/lib/data/firms";
import { formatPct, formatUsdg, relativeTime } from "@/lib/format";
import { useCycleIndex } from "@/lib/hooks";
import type { Firm } from "@/lib/types";

type Sort = "rank" | "return" | "drawdown" | "capital" | "newest";
type View = "grid" | "table";

const SORTS: { value: Sort; label: string }[] = [
  { value: "rank", label: "Rank" },
  { value: "return", label: "Return" },
  { value: "drawdown", label: "Drawdown" },
  { value: "capital", label: "Capital" },
  { value: "newest", label: "Newest" },
];

const STATUSES = [
  "Evaluating",
  "Simulating",
  "Rebalancing",
  "Observing",
  "Reviewing",
  "Tracking",
] as const;

const lastDecisionMinutes = (slug: string) =>
  decisionsFor(slug)[0]?.minutesAgo ?? 0;

export function FirmsExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const q = params.get("q") ?? "";
  const strategy = params.get("strategy") ?? "all";
  const risk = params.get("risk") ?? "all";
  const status = params.get("status") ?? "all";
  const sort = (params.get("sort") as Sort) ?? "rank";
  const view = (params.get("view") as View) ?? "grid";

  /** Query state lives in the URL so a filtered market can be shared. */
  const setParam = React.useCallback(
    (key: string, value: string, fallback: string) => {
      const next = new URLSearchParams(params.toString());
      if (value === fallback || value === "") next.delete(key);
      else next.set(key, value);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = FIRMS.filter((f) => {
      if (
        needle &&
        !`${f.name} ${f.strategy} ${f.state.label} ${f.tagline}`
          .toLowerCase()
          .includes(needle)
      )
        return false;
      if (strategy !== "all" && f.strategy !== strategy) return false;
      if (risk !== "all" && f.risk !== risk) return false;
      if (status !== "all" && !f.stateCycle.some((s) => s.kind === status))
        return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "return":
          return b.return30d - a.return30d;
        case "drawdown":
          return b.maxDrawdown - a.maxDrawdown;
        case "capital":
          return b.capital - a.capital;
        case "newest":
          return (
            FIRMS.findIndex((f) => f.slug === b.slug) -
            FIRMS.findIndex((f) => f.slug === a.slug)
          );
        default:
          return a.rank - b.rank;
      }
    });
    return list;
  }, [q, strategy, risk, status, sort]);

  const active =
    q !== "" || strategy !== "all" || risk !== "all" || status !== "all";

  const clear = () => router.replace(pathname, { scroll: false });

  return (
    <div>
      {/* ---------------- Controls ---------------- */}
      <div className="sticky top-[var(--nav-h)] z-30 -mx-5 border-b border-white/[0.06] bg-[#080909]/88 px-5 py-3.5 backdrop-blur-2xl sm:-mx-7 sm:px-7 lg:-mx-10 lg:px-10">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative min-w-0 flex-1 sm:max-w-[280px]">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-slate"
              strokeWidth={1.6}
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setParam("q", e.target.value, "")}
              placeholder="Search firms and mandates"
              aria-label="Search firms"
              className="focus-ring h-9 w-full rounded-[10px] border border-white/10 bg-white/[0.028] pl-9 pr-3 text-[13px] tracking-[-0.01em] text-gallery outline-none transition-colors hover:border-white/16"
            />
          </div>

          <Select
            size="sm"
            ariaLabel="Filter by strategy"
            value={strategy}
            onChange={(v) => setParam("strategy", v, "all")}
            className="w-[150px]"
            options={[
              { value: "all", label: "All strategies" },
              ...STRATEGIES.map((s) => ({ value: s, label: s })),
            ]}
          />

          <Select
            size="sm"
            ariaLabel="Filter by risk class"
            value={risk}
            onChange={(v) => setParam("risk", v, "all")}
            className="w-[132px]"
            options={[
              { value: "all", label: "All risk" },
              ...RISK_CLASSES.map((r) => ({ value: r, label: r })),
            ]}
          />

          <Select
            size="sm"
            ariaLabel="Filter by status"
            value={status}
            onChange={(v) => setParam("status", v, "all")}
            className="w-[128px]"
            options={[
              { value: "all", label: "All states" },
              ...STATUSES.map((s) => ({ value: s, label: s })),
            ]}
          />

          <Select
            size="sm"
            ariaLabel="Sort firms"
            value={sort}
            onChange={(v) => setParam("sort", v, "rank")}
            className="ml-auto w-[152px]"
            options={SORTS.map((s) => ({
              value: s.value,
              label: `Sort · ${s.label}`,
            }))}
          />

          {/* View toggle */}
          <div
            role="group"
            aria-label="View"
            className="hidden items-center gap-0.5 rounded-[10px] border border-white/[0.08] bg-white/[0.025] p-0.5 md:flex"
          >
            {(
              [
                { v: "grid" as View, Icon: LayoutGrid, label: "Grid view" },
                { v: "table" as View, Icon: Rows3, label: "Table view" },
              ]
            ).map(({ v, Icon, label }) => (
              <button
                key={v}
                type="button"
                aria-label={label}
                aria-pressed={view === v}
                onClick={() => setParam("view", v, "grid")}
                className={cn(
                  "focus-ring grid size-8 place-items-center rounded-[8px] transition-colors",
                  view === v
                    ? "bg-white/[0.1] text-gallery"
                    : "text-mist hover:text-titanium",
                )}
              >
                <Icon className="size-3.5" strokeWidth={1.6} />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <p className="text-[11.5px] text-slate">
            <span className="num text-titanium">{filtered.length}</span> of{" "}
            <span className="num">{FIRMS.length}</span> firms
          </p>
          {active && (
            <button
              type="button"
              onClick={clear}
              className="focus-ring inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-1 text-[11px] text-mist transition-colors hover:border-white/20 hover:text-gallery"
            >
              <X className="size-3" strokeWidth={1.8} />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ---------------- Results ---------------- */}
      <div className="pb-24 pt-9">
        {filtered.length === 0 ? (
          <EmptyState
            title="No firms match these filters"
            body="Try widening the mandate, risk class or state, or clear the filters to see all nine Genesis Firms."
            action={{ label: "Clear filters", onClick: clear }}
          />
        ) : view === "table" ? (
          <FirmTable firms={filtered} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((f, i) => (
              <FirmCard key={f.slug} firm={f} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Table view ---------------- */

const COLS =
  "grid-cols-[46px_minmax(150px,1.5fr)_minmax(120px,1.1fr)_minmax(150px,1.3fr)_88px_96px_84px_110px_92px_100px]";

function FirmTable({ firms }: { firms: Firm[] }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-[16px] border border-white/[0.07] lg:block">
        <div className="min-w-[1120px]">
          <div
            role="row"
            className={cn(
              "grid items-center gap-3 border-b border-white/[0.07] bg-white/[0.02] px-4 py-3",
              COLS,
            )}
          >
            {[
              "Rank",
              "Firm",
              "Mandate",
              "State",
              "30D",
              "Max DD",
              "Risk",
              "Capital",
              "Updated",
              "",
            ].map((h, i) => (
              <span
                key={h || i}
                className={cn("label text-slate", i >= 4 && "text-right")}
              >
                {h}
              </span>
            ))}
          </div>

          {firms.map((f, i) => (
            <FirmRow key={f.slug} firm={f} index={i} />
          ))}
        </div>
      </div>

      {/* Compact cards below the table breakpoint */}
      <ul className="space-y-2.5 lg:hidden">
        {firms.map((f, i) => (
          <li key={f.slug}>
            <CompactRow firm={f} index={i} />
          </li>
        ))}
      </ul>
    </>
  );
}

function FirmRow({ firm, index }: { firm: Firm; index: number }) {
  const i = useCycleIndex(firm.stateCycle.length, 7500, index * 800);
  const state = firm.stateCycle[i] ?? firm.state;
  const live = state.kind === "Evaluating" || state.kind === "Simulating";

  return (
    <Link
      href={`/firms/${firm.slug}`}
      className={cn(
        "group grid items-center gap-3 border-b border-white/[0.05] px-4 py-3.5 transition-colors last:border-b-0 hover:bg-white/[0.03] focus-visible:bg-white/[0.04] focus-visible:outline-none",
        COLS,
      )}
    >
      <span className="num text-[14px] font-medium text-titanium">
        {firm.rank}
      </span>

      <span className="flex min-w-0 items-center gap-2.5">
        <Sigil
          id={firm.slug}
          active={live}
          className="size-[22px] shrink-0 text-titanium"
        />
        <span className="truncate text-[13.5px] font-medium tracking-[-0.015em] text-gallery">
          {firm.name}
        </span>
      </span>

      <span className="truncate text-[12.5px] text-mist">{firm.strategy}</span>

      <span className="min-w-0">
        <StateBadge label={state.label} kind={state.kind} compact />
      </span>

      <span className="text-right">
        <Delta value={firm.return30d} size="sm" showGlyph={false} />
      </span>

      <span className="num text-right text-[12.5px] text-titanium">
        {formatPct(firm.maxDrawdown)}
      </span>

      <span className="num text-right text-[12.5px] text-gallery">
        {firm.riskScore.toFixed(2)}
      </span>

      <span className="num text-right text-[12.5px] text-mist">
        {formatUsdg(firm.capital, { compact: true })}
      </span>

      <span className="mono text-right text-[11.5px] text-slate">
        {relativeTime(lastDecisionMinutes(firm.slug))}
      </span>

      <span className="flex justify-end">
        <span className="inline-flex items-center gap-1 text-[12px] text-titanium transition-colors group-hover:text-gallery">
          Inspect
          <ArrowRight
            className="size-3 transition-transform duration-300 group-hover:translate-x-0.5"
            strokeWidth={1.6}
          />
        </span>
      </span>
    </Link>
  );
}

function CompactRow({ firm, index }: { firm: Firm; index: number }) {
  const i = useCycleIndex(firm.stateCycle.length, 7500, index * 800);
  const state = firm.stateCycle[i] ?? firm.state;
  const live = state.kind === "Evaluating" || state.kind === "Simulating";

  return (
    <Link
      href={`/firms/${firm.slug}`}
      className="focus-ring block rounded-[14px] border border-white/[0.07] bg-[#0a0c0b] p-4 transition-colors hover:border-white/[0.15] hover:bg-[#0d0f0e]"
    >
      <div className="flex items-center gap-3">
        <span className="mono w-5 shrink-0 text-[12px] text-slate">
          {firm.rank}
        </span>
        <Sigil
          id={firm.slug}
          active={live}
          className="size-6 shrink-0 text-titanium"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13.5px] font-medium tracking-[-0.015em] text-gallery">
            {firm.name}
          </span>
          <span className="mt-1 block truncate text-[11.5px] text-mist">
            {firm.strategy}
          </span>
        </span>
        <Delta value={firm.return30d} size="sm" />
      </div>

      <div className="mt-3.5 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
        <StateBadge label={state.label} kind={state.kind} compact />
        <span className="flex shrink-0 items-center gap-3">
          <RiskBadge risk={firm.risk} showBars={false} />
          <span className="num text-[11.5px] text-slate">
            {formatPct(firm.maxDrawdown)}
          </span>
        </span>
      </div>
    </Link>
  );
}
