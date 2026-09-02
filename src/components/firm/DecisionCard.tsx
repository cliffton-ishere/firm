"use client";

import * as React from "react";
import { Sigil } from "@/components/brand/Sigil";
import { Verdict } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/cn";
import { relativeTime } from "@/lib/format";
import type { DecisionReceipt } from "@/lib/types";

const KIND_LABEL: Record<DecisionReceipt["kind"], string> = {
  allocation: "Allocation",
  risk: "Risk",
  research: "Research",
  execution: "Execution",
  review: "Review",
  system: "System",
};

const KIND_TONE: Record<DecisionReceipt["kind"], string> = {
  allocation: "text-lime border-lime/22 bg-lime/[0.06]",
  risk: "text-amber border-amber/22 bg-amber/[0.06]",
  research: "text-[#a9c8ff] border-[#8fb6ff]/22 bg-[#8fb6ff]/[0.06]",
  execution: "text-active border-active/22 bg-active/[0.06]",
  review: "text-titanium border-white/12 bg-white/[0.04]",
  system: "text-mist border-white/10 bg-white/[0.03]",
};

export function DecisionCard({
  decision,
  className,
}: {
  decision: DecisionReceipt;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative rounded-[14px] border border-white/[0.07] bg-[#0a0c0b] p-4 transition-colors duration-[420ms] hover:border-white/[0.14] hover:bg-[#0d0f0e] sm:p-5",
        className,
      )}
    >
      <div className="flex items-start gap-3.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-[9px] border border-white/[0.08] bg-white/[0.025] text-titanium">
          <Sigil id={decision.firm} className="size-[19px]" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <span
              className={cn(
                "label rounded-md border px-1.5 py-1",
                KIND_TONE[decision.kind],
              )}
            >
              {KIND_LABEL[decision.kind]}
            </span>
            <h3 className="text-[13.5px] font-medium tracking-[-0.015em] text-gallery">
              {decision.title}
            </h3>
            <span className="mono ml-auto shrink-0 text-[11px] text-slate">
              {relativeTime(decision.minutesAgo)}
            </span>
          </div>

          <p className="mt-2.5 max-w-[76ch] text-[13px] leading-relaxed text-mist">
            {decision.body}
          </p>

          <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
            {decision.confidence !== undefined && (
              <Field label="Confidence" value={`${decision.confidence}%`} mono />
            )}
            {decision.riskImpact !== undefined && (
              <Field
                label="Risk impact"
                value={`${decision.riskImpact > 0 ? "+" : decision.riskImpact < 0 ? "−" : ""}${Math.abs(decision.riskImpact).toFixed(1)}`}
                mono
              />
            )}
            {decision.holdingPeriod && (
              <Field label="Holding period" value={decision.holdingPeriod} />
            )}
            <Field
              label="Mandate check"
              value={<Verdict value={decision.mandateCheck} />}
              raw
            />
            <Field
              label="Simulation"
              value={<Verdict value={decision.simulation} />}
              raw
            />
            <Field
              label="Decision ID"
              mono
              value={
                <Tooltip content="A deterministic preview identifier for this decision record. It is not a transaction hash and does not resolve on Blockscout.">
                  <span className="cursor-help border-b border-dashed border-white/15">
                    {decision.id}
                  </span>
                </Tooltip>
              }
              raw
            />
          </dl>
        </div>
      </div>
    </article>
  );
}

function Field({
  label,
  value,
  mono,
  raw,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  raw?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="label text-slate">{label}</dt>
      <dd
        className={cn(
          "mt-2 min-w-0 text-[12.5px] text-titanium",
          !raw && "truncate",
          mono && "mono",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
