"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export const DOC_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "smart-firms", label: "Smart Firms" },
  { id: "decision-lifecycle", label: "Decision lifecycle" },
  { id: "mandates", label: "Mandates" },
  { id: "risk-governor", label: "Risk Governor" },
  { id: "agent-committee", label: "Agent Committee" },
  { id: "reputation", label: "Reputation" },
  { id: "machine-league", label: "Machine League" },
  { id: "robinhood-chain", label: "Robinhood Chain" },
  { id: "wallet-permissions", label: "Wallet permissions" },
  { id: "architecture", label: "Architecture" },
  { id: "disclosures", label: "Disclosures" },
] as const;

export function DocsNav() {
  const [active, setActive] = React.useState<string>(DOC_SECTIONS[0].id);

  React.useEffect(() => {
    const els = DOC_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!els.length || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Documentation sections"
      className="lg:sticky lg:top-[calc(var(--nav-h)+24px)] lg:self-start"
    >
      <p className="label mb-4 hidden text-slate lg:block">Contents</p>
      <ol className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 lg:mx-0 lg:block lg:space-y-0.5 lg:overflow-visible lg:px-0">
        {DOC_SECTIONS.map((s) => {
          const on = active === s.id;
          return (
            <li key={s.id} className="shrink-0 lg:shrink">
              <a
                href={`#${s.id}`}
                aria-current={on ? "true" : undefined}
                className={cn(
                  "focus-ring block whitespace-nowrap rounded-[8px] px-2.5 py-2 text-[12.5px] tracking-[-0.01em] transition-colors duration-300 lg:whitespace-normal",
                  on
                    ? "bg-white/[0.06] text-gallery"
                    : "text-mist hover:bg-white/[0.03] hover:text-titanium",
                )}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
