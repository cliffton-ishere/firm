"use client";

import { ArrowUpRight, ShieldCheck, Wallet } from "lucide-react";
import * as React from "react";
import type { Connector } from "wagmi";
import { useConnect, useConnectors } from "wagmi";
import { RH_CHAIN_ID } from "@/lib/chain";
import { cn } from "@/lib/cn";
import { useChangeEffect, useMounted } from "@/lib/hooks";
import { WALLETCONNECT_ENABLED } from "@/lib/wagmi";
import { Modal } from "@/components/ui/Dialog";
import { ErrorState } from "@/components/ui/States";

interface Entry {
  key: string;
  name: string;
  connector: Connector;
  detected: boolean;
  hint: string;
  icon?: string;
}

function hasInjectedProvider() {
  if (typeof window === "undefined") return false;
  return Boolean((window as { ethereum?: unknown }).ethereum);
}

function isMetaMaskInjected() {
  if (typeof window === "undefined") return false;
  const eth = (window as { ethereum?: { isMetaMask?: boolean } }).ethereum;
  return Boolean(eth?.isMetaMask);
}

/**
 * Builds the connector list so no dead option is ever shown:
 * EIP-6963 wallets announce themselves by name, the generic injected entry
 * only appears when nothing announced itself, and WalletConnect only appears
 * when a project id is configured.
 */
function useWalletEntries(): Entry[] {
  const connectors = useConnectors();
  const mounted = useMounted();

  return React.useMemo(() => {
    if (!mounted) return [];

    const discovered = connectors.filter(
      (c) => c.type === "injected" && c.id !== "injected" && c.id !== "metaMask",
    );
    const explicitMetaMask = connectors.find((c) => c.id === "metaMask");
    const generic = connectors.find((c) => c.id === "injected");
    const wc = connectors.find((c) => c.id === "walletConnect");

    const entries: Entry[] = [];
    const seen = new Set<string>();

    for (const c of discovered) {
      const key = c.name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push({
        key: c.uid,
        name: c.name,
        connector: c,
        detected: true,
        hint: "Detected",
        icon: c.icon,
      });
    }

    if (explicitMetaMask && !seen.has("metamask") && isMetaMaskInjected()) {
      seen.add("metamask");
      entries.push({
        key: explicitMetaMask.uid,
        name: "MetaMask",
        connector: explicitMetaMask,
        detected: true,
        hint: "Detected",
      });
    }

    if (generic && entries.length === 0 && hasInjectedProvider()) {
      entries.push({
        key: generic.uid,
        name: "Browser wallet",
        connector: generic,
        detected: true,
        hint: "Detected",
      });
    }

    if (wc && WALLETCONNECT_ENABLED) {
      entries.push({
        key: wc.uid,
        name: "WalletConnect",
        connector: wc,
        detected: false,
        hint: "Scan to connect",
      });
    }

    return entries;
  }, [connectors, mounted]);
}

export function WalletModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const entries = useWalletEntries();
  const { connectAsync } = useConnect();
  const [pending, setPending] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const mounted = useMounted();

  // Reopening the sheet always starts from a clean slate.
  useChangeEffect(open, (isOpen) => {
    if (isOpen) {
      setError(null);
      setPending(null);
    }
  });

  const connect = async (entry: Entry) => {
    setError(null);
    setPending(entry.key);
    try {
      await connectAsync({ connector: entry.connector, chainId: RH_CHAIN_ID });
      onClose();
    } catch (err) {
      const e = err as { code?: number; message?: string; name?: string };
      if (e?.code === 4001 || /reject|denied|cancel/i.test(e?.message ?? "")) {
        setError("Connection request declined in your wallet.");
      } else if (/already pending|request of type/i.test(e?.message ?? "")) {
        setError("A connection request is already open in your wallet.");
      } else {
        setError("The wallet did not complete the connection. Try again.");
      }
    } finally {
      setPending(null);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Connect wallet"
      description="FIRM is non-custodial. Connecting grants read access to your address and asks your wallet to sign only what you approve."
    >
      <div className="px-5 pb-6 sm:px-6">
        {mounted && entries.length === 0 ? (
          <div className="rounded-[14px] border border-white/10 bg-white/[0.02] px-5 py-8 text-center">
            <Wallet className="mx-auto size-5 text-slate" strokeWidth={1.4} />
            <p className="mt-4 text-[14px] font-medium tracking-[-0.015em] text-gallery">
              No wallet detected in this browser
            </p>
            <p className="mx-auto mt-2 max-w-[34ch] text-[12.5px] leading-relaxed text-mist">
              Install an EVM browser wallet, then reload this page. FIRM works
              with any wallet that supports Robinhood Chain.
            </p>
            <a
              href="https://ethereum.org/en/wallets/find-wallet/"
              target="_blank"
              rel="noreferrer noopener"
              className="focus-ring mt-5 inline-flex items-center gap-1.5 rounded-[9px] border border-white/12 px-3 py-2 text-[12.5px] text-titanium transition-colors hover:border-white/22 hover:text-gallery"
            >
              Find a wallet
              <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
            </a>
          </div>
        ) : (
          <ul className="space-y-1.5">
            {entries.map((entry) => {
              const busy = pending === entry.key;
              return (
                <li key={entry.key}>
                  <button
                    type="button"
                    onClick={() => connect(entry)}
                    disabled={pending !== null}
                    className={cn(
                      "focus-ring group flex w-full items-center gap-3.5 rounded-[12px] border px-3.5 py-3 text-left transition-all duration-250",
                      "border-white/[0.08] bg-white/[0.022] hover:border-white/18 hover:bg-white/[0.05]",
                      pending !== null && !busy && "opacity-40",
                    )}
                  >
                    <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-[9px] border border-white/10 bg-white/[0.05]">
                      {entry.icon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={entry.icon}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <Wallet
                          className="size-4 text-titanium"
                          strokeWidth={1.5}
                        />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-medium tracking-[-0.015em] text-gallery">
                        {entry.name}
                      </span>
                      <span className="mt-0.5 block text-[11.5px] text-mist">
                        {busy ? "Waiting for your wallet…" : entry.hint}
                      </span>
                    </span>
                    {busy ? (
                      <span
                        aria-hidden
                        className="size-3.5 animate-spin rounded-full border-[1.5px] border-lime border-t-transparent"
                      />
                    ) : (
                      entry.detected && (
                        <span
                          aria-hidden
                          className="size-1.5 rounded-full bg-active"
                        />
                      )
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {error && (
          <ErrorState
            className="mt-4"
            title="Connection not completed"
            body={error}
          />
        )}

        {!WALLETCONNECT_ENABLED && (
          <p className="mt-4 text-[11px] leading-relaxed text-slate">
            WalletConnect is not configured on this deployment. Set
            <span className="mono mx-1 text-titanium">
              NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
            </span>
            to enable it.
          </p>
        )}

        <div className="mt-5 flex items-start gap-2.5 rounded-[11px] border border-white/[0.07] bg-white/[0.018] px-3.5 py-3">
          <ShieldCheck
            className="mt-[1px] size-3.5 shrink-0 text-lime"
            strokeWidth={1.6}
          />
          <p className="text-[11.5px] leading-relaxed text-mist">
            FIRM never takes custody of assets and cannot move funds without a
            signature you approve. Network: Robinhood Chain, chain ID 4663.
          </p>
        </div>
      </div>
    </Modal>
  );
}
