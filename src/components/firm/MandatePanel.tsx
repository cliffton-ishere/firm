"use client";

import { ShieldCheck } from "lucide-react";
import * as React from "react";
import { Disclosure } from "@/components/ui/Disclosure";
import { cn } from "@/lib/cn";
import type { Firm } from "@/lib/types";

function machineReadable(firm: Firm) {
  const m = firm.mandate;
  return {
    firm: firm.name,
    version: firm.version,
    chain: { name: "Robinhood Chain", chainId: 4663, settlement: "USDG" },
    universe: m.universe,
    limits: {
      maxSinglePositionPct: m.maxSinglePosition,
      maxSectorExposurePct: m.maxSectorExposure,
      maxPortfolioTurnoverPct: m.maxTurnover,
      minReservePct: m.minReserve,
    },
    prohibited: { leverage: m.leverage, derivatives: m.derivatives },
    rebalance: { interval: m.rebalanceInterval },
    drawdown: { response: m.drawdownResponse },
    authority: { emergencyPause: m.pauseAuthority },
    enforcement: "onchain",
  };
}

export function MandatePanel({
  firm,
  className,
}: {
  firm: Firm;
  className?: string;
}) {
  const m = firm.mandate;
  const json = React.useMemo(() => machineReadable(firm), [firm]);

  const rows: { label: string; value: React.ReactNode; tone?: "off" }[] = [
    { label: "Approved universe", value: m.universe },
    { label: "Maximum single position", value: `${m.maxSinglePosition}%` },
    { label: "Maximum sector exposure", value: `${m.maxSectorExposure}%` },
    { label: "Maximum portfolio turnover", value: `${m.maxTurnover}% / quarter` },
    { label: "Minimum USDG reserve", value: `${m.minReserve}%` },
    { label: "Leverage", value: "Disabled", tone: "off" },
    { label: "Derivatives", value: "Disabled", tone: "off" },
    { label: "Rebalance interval", value: m.rebalanceInterval },
    { label: "Drawdown response", value: m.drawdownResponse },
    { label: "Emergency pause authority", value: m.pauseAuthority },
  ];

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#0a0c0b]",
        className,
      )}
      aria-label="Mandate"
    >
      <header className="flex items-start justify-between gap-4 border-b border-white/[0.06] p-5">
        <div>
          <h2 className="text-[15px] font-medium tracking-[-0.02em] text-gallery">
            Mandate
          </h2>
          <p className="mt-1.5 max-w-[54ch] text-[12.5px] leading-relaxed text-mist">
            The policy the firm operates under. The model proposes; the mandate
            constrains; the contracts enforce.
          </p>
        </div>
        <span className="label inline-flex shrink-0 items-center gap-1.5 rounded-full border border-active/25 bg-active/[0.07] px-2.5 py-1 text-active">
          <ShieldCheck className="size-3" strokeWidth={1.8} />
          Enforced
        </span>
      </header>

      <dl className="px-5">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex flex-col gap-1.5 border-b border-white/[0.05] py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
          >
            <dt className="shrink-0 text-[12.5px] text-mist sm:w-[42%]">
              {r.label}
            </dt>
            <dd
              className={cn(
                "min-w-0 text-[13px] leading-relaxed text-gallery sm:flex-1 sm:text-right",
                r.tone === "off" && "text-slate",
              )}
            >
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="px-5">
        <Disclosure
          summary="View machine-readable mandate"
          meta="firm.mandate/v1"
          className="border-b-0"
        >
          <pre className="mono overflow-x-auto rounded-[12px] border border-white/[0.07] bg-black/45 p-4 text-[11.5px] leading-[1.7] text-titanium">
            <code>{JSON.stringify(json, null, 2)}</code>
          </pre>
          <p className="mt-3 text-[11px] text-slate">
            The enforcement contract reads this document. Any proposal that
            violates a field is reduced or rejected before it reaches execution.
          </p>
        </Disclosure>
      </div>
    </section>
  );
}
