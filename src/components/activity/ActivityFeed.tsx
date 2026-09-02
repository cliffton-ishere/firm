"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Sigil } from "@/components/brand/Sigil";
import { Segmented } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/States";
import { cn } from "@/lib/cn";
import { ACTIVITY_EVENTS, INCOMING_EVENTS } from "@/lib/data/decisions";
import { FIRM_MAP } from "@/lib/data/firms";
import { relativeTime } from "@/lib/format";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { ActivityEvent, ActivityKind } from "@/lib/types";

type Filter = "all" | "decisions" | "risk" | "execution" | "research" | "system";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "decisions", label: "Decisions" },
  { value: "risk", label: "Risk" },
  { value: "execution", label: "Execution" },
  { value: "research", label: "Research" },
  { value: "system", label: "System" },
];

const GROUP: Record<Filter, ActivityKind[]> = {
  all: [],
  decisions: ["decision", "allocation"],
  risk: ["risk", "mandate"],
  execution: ["execution"],
  research: ["research"],
  system: ["version", "rank", "letter"],
};

const KIND_LABEL: Record<ActivityKind, string> = {
  decision: "Decision committed",
  mandate: "Mandate check",
  risk: "Risk governor",
  research: "Research",
  execution: "Execution",
  allocation: "Allocation",
  version: "Firm version",
  rank: "League rank",
  letter: "Weekly letter",
};

const KIND_TONE: Record<ActivityKind, string> = {
  decision: "text-lime border-lime/22 bg-lime/[0.06]",
  allocation: "text-lime border-lime/22 bg-lime/[0.06]",
  mandate: "text-active border-active/22 bg-active/[0.06]",
  risk: "text-amber border-amber/22 bg-amber/[0.06]",
  research: "text-[#a9c8ff] border-[#8fb6ff]/22 bg-[#8fb6ff]/[0.06]",
  execution: "text-active border-active/22 bg-active/[0.06]",
  version: "text-mist border-white/10 bg-white/[0.03]",
  rank: "text-titanium border-white/12 bg-white/[0.04]",
  letter: "text-titanium border-white/12 bg-white/[0.04]",
};

const SOURCE_LABEL = {
  "strategy-preview": "Strategy preview",
  "network-read": "Network read",
  wallet: "Wallet event",
} as const;

export function ActivityFeed({ className }: { className?: string }) {
  const [filter, setFilter] = React.useState<Filter>("all");
  const [incoming, setIncoming] = React.useState<ActivityEvent[]>([]);
  const reduced = usePrefersReducedMotion();

  // New showcase events arrive on a slow timer so the feed visibly operates.
  React.useEffect(() => {
    if (reduced) return;
    let n = 0;
    const id = window.setInterval(() => {
      const source = INCOMING_EVENTS[n % INCOMING_EVENTS.length];
      const stamped: ActivityEvent = {
        ...source,
        id: `${source.id}-${n}`,
        minutesAgo: 0,
      };
      n += 1;
      setIncoming((list) => [stamped, ...list].slice(0, 6));
    }, 9000);
    return () => window.clearInterval(id);
  }, [reduced]);

  const events = React.useMemo(() => {
    const all = [...incoming, ...ACTIVITY_EVENTS];
    if (filter === "all") return all;
    const kinds = GROUP[filter];
    return all.filter((e) => kinds.includes(e.kind));
  }, [filter, incoming]);

  return (
    <section aria-label="Activity" className={cn("min-w-0", className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="no-scrollbar -mx-5 min-w-0 max-w-full overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <Segmented
            ariaLabel="Filter activity"
            value={filter}
            onChange={setFilter}
            options={FILTERS}
          />
        </div>
        <p className="flex items-center gap-2 text-[11.5px] text-slate">
          <span
            aria-hidden
            className="pulse-dot relative size-[5px] rounded-full bg-lime text-lime"
          />
          Streaming
        </p>
      </div>

      {events.length === 0 ? (
        <EmptyState
          className="mt-6"
          title="No events in this category yet"
          body="Switch to another category, or select All to see everything the network has committed."
          action={{ label: "Show all", onClick: () => setFilter("all") }}
        />
      ) : (
        <ul className="mt-5 space-y-2">
          <AnimatePresence initial={false}>
            {events.map((e) => (
              <motion.li
                key={e.id}
                layout={!reduced}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <EventRow event={e} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}

function EventRow({ event }: { event: ActivityEvent }) {
  const [open, setOpen] = React.useState(false);
  const firm = FIRM_MAP[event.firm];
  const id = React.useId();

  return (
    <div
      className={cn(
        "rounded-[14px] border border-white/[0.07] bg-[#0a0c0b] transition-colors duration-300",
        open && "border-white/[0.14] bg-[#0d0f0e]",
      )}
    >
      <div className="flex items-start gap-3.5 p-4">
        <span className="grid size-8 shrink-0 place-items-center rounded-[9px] border border-white/[0.08] bg-white/[0.025] text-titanium">
          <Sigil id={event.firm} className="size-[19px]" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <span
              className={cn(
                "label rounded-md border px-1.5 py-1",
                KIND_TONE[event.kind],
              )}
            >
              {KIND_LABEL[event.kind]}
            </span>
            <Link
              href={`/firms/${event.firm}`}
              className="focus-ring rounded text-[12.5px] text-titanium transition-colors hover:text-gallery"
            >
              {firm?.name ?? event.firm}
            </Link>
            <span className="mono ml-auto shrink-0 text-[11px] text-slate">
              {relativeTime(event.minutesAgo)}
            </span>
          </div>

          <p className="mt-2.5 text-[13.5px] font-medium tracking-[-0.015em] text-gallery">
            {event.title}
          </p>
          <p className="mt-1.5 max-w-[82ch] text-[12.5px] leading-relaxed text-mist">
            {event.detail}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="label rounded-full border border-white/[0.08] px-2 py-1 text-slate">
              {SOURCE_LABEL[event.source]}
            </span>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={id}
              onClick={() => setOpen((o) => !o)}
              className="focus-ring inline-flex items-center gap-1 rounded text-[11.5px] text-mist transition-colors hover:text-gallery"
            >
              Technical details
              <ChevronDown
                aria-hidden
                className={cn(
                  "size-3 transition-transform duration-300",
                  open && "rotate-180",
                )}
                strokeWidth={1.8}
              />
            </button>
          </div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-white/[0.06] pt-4 sm:grid-cols-3 lg:grid-cols-5">
                  {event.values.map((v) => (
                    <div key={v.label} className="min-w-0">
                      <dt className="label text-slate">{v.label}</dt>
                      <dd className="mono mt-2 truncate text-[12px] text-titanium">
                        {v.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
