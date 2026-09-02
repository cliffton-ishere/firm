"use client";

import { useNetwork } from "@/components/providers/NetworkProvider";
import { RH_CHAIN_ID } from "@/lib/chain";
import { cn } from "@/lib/cn";
import { formatBlock } from "@/lib/format";
import { useMounted } from "@/lib/hooks";
import { useWallet } from "@/lib/wallet";

export type NetworkTone = "live" | "wrong" | "reconnecting" | "idle";

export function useNetworkTone(): {
  tone: NetworkTone;
  label: string;
  sub: string;
} {
  const net = useNetwork();
  const wallet = useWallet();
  const mounted = useMounted();

  if (!mounted || net.status === "idle") {
    return { tone: "idle", label: "Robinhood Chain", sub: "Connecting" };
  }
  if (net.status === "reconnecting") {
    return { tone: "reconnecting", label: "Robinhood Chain", sub: "Network reconnecting" };
  }
  if (wallet.wrongNetwork) {
    return { tone: "wrong", label: "Robinhood Chain", sub: "Wrong network" };
  }
  return { tone: "live", label: "Robinhood Chain", sub: "Mainnet" };
}

const DOT: Record<NetworkTone, string> = {
  live: "bg-active text-active",
  wrong: "bg-amber text-amber",
  reconnecting: "bg-amber/70 text-amber/70",
  idle: "bg-slate text-slate",
};

const SUB: Record<NetworkTone, string> = {
  live: "text-active",
  wrong: "text-amber",
  reconnecting: "text-amber",
  idle: "text-slate",
};

/** Compact navigation control. */
export function NetworkIndicator({
  ground = "dark",
  className,
}: {
  ground?: "dark" | "light";
  className?: string;
}) {
  const net = useNetwork();
  const { tone, label, sub } = useNetworkTone();

  return (
    <div
      className={cn(
        "hidden items-center gap-2.5 rounded-full border px-3 py-[7px] lg:inline-flex",
        ground === "light"
          ? "border-ink/10 bg-white/55 backdrop-blur-xl"
          : "border-white/[0.09] bg-white/[0.035] backdrop-blur-xl",
        className,
      )}
      title={
        net.latencyMs !== null
          ? `Chain ${RH_CHAIN_ID} · RPC ${net.latencyMs}ms`
          : `Chain ${RH_CHAIN_ID}`
      }
    >
      <span
        aria-hidden
        className={cn(
          "relative size-[6px] shrink-0 rounded-full",
          DOT[tone],
          tone === "live" && "pulse-dot",
        )}
      />
      <span className="flex items-baseline gap-2 leading-none">
        <span
          className={cn(
            "text-[12px] font-medium tracking-[-0.01em]",
            ground === "light" ? "text-ink" : "text-gallery",
          )}
        >
          {label}
        </span>
        <span className={cn("label-sm", SUB[tone])}>{sub}</span>
      </span>
      <span
        aria-hidden
        className={cn(
          "h-3 w-px",
          ground === "light" ? "bg-ink/12" : "bg-white/12",
        )}
      />
      <span
        className={cn(
          "mono text-[11px] tabular-nums",
          ground === "light" ? "text-ink/45" : "text-mist",
        )}
      >
        {net.blockNumber !== null ? formatBlock(net.blockNumber) : "——"}
      </span>
    </div>
  );
}

/** Mobile / compact variant: dot plus block only. */
export function NetworkDot({
  ground = "dark",
  className,
}: {
  ground?: "dark" | "light";
  className?: string;
}) {
  const net = useNetwork();
  const { tone, sub } = useNetworkTone();
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-[6px]",
        ground === "light"
          ? "border-ink/10 bg-white/55"
          : "border-white/[0.09] bg-white/[0.035]",
        className,
      )}
      aria-label={`Robinhood Chain — ${sub}`}
    >
      <span
        aria-hidden
        className={cn(
          "relative size-[6px] rounded-full",
          DOT[tone],
          tone === "live" && "pulse-dot",
        )}
      />
      <span
        className={cn(
          "mono text-[10.5px]",
          ground === "light" ? "text-ink/50" : "text-mist",
        )}
      >
        {net.blockNumber !== null ? formatBlock(net.blockNumber) : "——"}
      </span>
    </div>
  );
}
