"use client";

import { cn } from "@/lib/cn";
import { truncateAddress } from "@/lib/format";
import { useMounted } from "@/lib/hooks";
import { useSwitchToRobinhood, useWallet } from "@/lib/wallet";
import { AddressAvatar } from "./AddressAvatar";
import { useWalletUI } from "./WalletUIProvider";

/**
 * The single wallet control in the navigation. Four states:
 * hydrating, disconnected, wrong network, connected.
 */
export function ConnectControl({
  ground = "dark",
  className,
}: {
  ground?: "dark" | "light";
  className?: string;
}) {
  const mounted = useMounted();
  const wallet = useWallet();
  const { openConnect, openAccount } = useWalletUI();
  const { switchToRobinhood, status } = useSwitchToRobinhood();

  const base =
    "focus-ring group inline-flex h-9 items-center gap-2 rounded-full border pl-1.5 pr-3.5 text-[12.5px] font-medium tracking-[-0.01em] transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]";

  if (!mounted) {
    return (
      <div
        aria-hidden
        className={cn(
          "h-9 w-[122px] rounded-full border",
          ground === "light"
            ? "border-ink/10 bg-ink/[0.03]"
            : "border-white/[0.08] bg-white/[0.03]",
          className,
        )}
      />
    );
  }

  if (!wallet.isConnected) {
    return (
      <button
        type="button"
        onClick={openConnect}
        className={cn(
          base,
          "pl-3.5",
          ground === "light"
            ? "border-ink/12 bg-ink text-gallery hover:bg-ink-3"
            : "border-white/18 bg-gallery text-ink hover:bg-white",
          className,
        )}
      >
        {wallet.isConnecting ? "Connecting…" : "Connect wallet"}
      </button>
    );
  }

  if (wallet.wrongNetwork) {
    return (
      <button
        type="button"
        onClick={() => void switchToRobinhood()}
        className={cn(
          base,
          "border-amber/35 bg-amber/[0.1] pl-3 text-amber hover:bg-amber/[0.16]",
          className,
        )}
      >
        <span
          aria-hidden
          className="size-[6px] shrink-0 rounded-full bg-amber"
        />
        {status === "switching" ? "Switching…" : "Switch network"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openAccount}
      aria-label="Open account"
      className={cn(
        base,
        ground === "light"
          ? "border-ink/10 bg-white/60 text-ink hover:bg-white/85"
          : "border-white/12 bg-white/[0.05] text-gallery hover:border-white/22 hover:bg-white/[0.09]",
        className,
      )}
    >
      <AddressAvatar address={wallet.address} className="size-6" />
      <span className="mono">{truncateAddress(wallet.address, 5, 4)}</span>
    </button>
  );
}
