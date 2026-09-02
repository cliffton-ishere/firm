"use client";

import { ArrowUpRight } from "lucide-react";
import { useNetwork } from "@/components/providers/NetworkProvider";
import { RH_CHAIN_ID, RH_EXPLORER_URL, RH_RPC_URL, explorerBlock } from "@/lib/chain";
import { cn } from "@/lib/cn";
import { formatBlock } from "@/lib/format";
import { useMounted } from "@/lib/hooks";
import { useWallet } from "@/lib/wallet";

/**
 * Real network telemetry, deliberately separated from the strategy showcase
 * feed so a reader is never in doubt about which numbers came from the chain.
 */
export function NetworkPanel({ className }: { className?: string }) {
  const net = useNetwork();
  const wallet = useWallet();
  const mounted = useMounted();

  const online = net.status === "online";

  return (
    <section
      aria-label="Robinhood Chain network"
      className={cn(
        "overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#0a0c0b]",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-4 border-b border-white/[0.06] p-5">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className={cn(
              "relative size-[6px] rounded-full",
              online
                ? "pulse-dot bg-active text-active"
                : net.status === "reconnecting"
                  ? "bg-amber"
                  : "bg-slate",
            )}
          />
          <h2 className="text-[15px] font-medium tracking-[-0.02em] text-gallery">
            Robinhood Chain
          </h2>
        </div>
        <span
          className={cn(
            "label",
            online ? "text-active" : net.status === "reconnecting" ? "text-amber" : "text-slate",
          )}
        >
          {online
            ? "Mainnet"
            : net.status === "reconnecting"
              ? "Network reconnecting"
              : "Connecting"}
        </span>
      </header>

      <dl className="divide-y divide-white/[0.05]">
        <Row
          label="Latest block"
          value={
            mounted && net.blockNumber !== null
              ? formatBlock(net.blockNumber)
              : "——"
          }
          mono
          href={
            mounted && net.blockNumber !== null
              ? explorerBlock(net.blockNumber)
              : undefined
          }
        />
        <Row
          label="RPC latency"
          value={net.latencyMs !== null ? `${net.latencyMs} ms` : "——"}
          mono
        />
        <Row label="Configured chain" value={`${RH_CHAIN_ID}`} mono />
        <Row
          label="Wallet chain"
          value={
            !mounted
              ? "——"
              : !wallet.isConnected
                ? "Not connected"
                : String(wallet.chainId ?? "unknown")
          }
          mono
          tone={
            mounted && wallet.wrongNetwork
              ? "warn"
              : mounted && wallet.onRobinhoodChain
                ? "ok"
                : undefined
          }
        />
        <Row label="RPC endpoint" value={hostOf(RH_RPC_URL)} mono />
        <Row label="Explorer" value="Blockscout" href={RH_EXPLORER_URL} />
      </dl>

      <p className="border-t border-white/[0.05] px-5 py-3.5 text-[11px] leading-relaxed text-slate">
        Every value in this panel is read live from Robinhood Chain. Strategy
        events in the feed are published by the firms and carry their own source
        label.
      </p>
    </section>
  );
}

function hostOf(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

function Row({
  label,
  value,
  mono,
  href,
  tone,
}: {
  label: string;
  value: string;
  mono?: boolean;
  href?: string;
  tone?: "ok" | "warn";
}) {
  const body = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[12.5px]",
        mono && "mono",
        tone === "ok"
          ? "text-active"
          : tone === "warn"
            ? "text-amber"
            : "text-gallery",
      )}
    >
      {value}
      {href && <ArrowUpRight className="size-3" strokeWidth={1.6} />}
    </span>
  );

  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3">
      <dt className="text-[12.5px] text-mist">{label}</dt>
      <dd>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="focus-ring rounded transition-opacity hover:opacity-75"
          >
            {body}
          </a>
        ) : (
          body
        )}
      </dd>
    </div>
  );
}
