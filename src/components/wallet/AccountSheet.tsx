"use client";

import {
  ArrowUpRight,
  Check,
  Copy,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { useDisconnect } from "wagmi";
import { CONTRACTS, explorerAddress, explorerToken, RH_CHAIN_ID } from "@/lib/chain";
import { cn } from "@/lib/cn";
import { formatBlock, truncateAddress } from "@/lib/format";
import { useCopy } from "@/lib/hooks";
import { useSwitchToRobinhood, useWallet } from "@/lib/wallet";
import { useNetwork } from "@/components/providers/NetworkProvider";
import { Modal } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { ErrorState, Skeleton } from "@/components/ui/States";
import { AddressAvatar } from "./AddressAvatar";

function BalanceRow({
  label,
  value,
  unit,
  loading,
  error,
  href,
}: {
  label: string;
  value?: string;
  unit: string;
  loading: boolean;
  error: boolean;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div className="min-w-0">
        <div className="label text-slate">{label}</div>
        <div className="mt-2">
          {loading ? (
            <Skeleton className="h-[18px] w-24" />
          ) : error || value === undefined ? (
            <span className="text-[12.5px] text-mist">Balance unavailable</span>
          ) : (
            <span className="num text-[17px] font-medium tracking-[-0.02em] text-gallery">
              {value}
              <span className="ml-1.5 text-[12px] text-mist">{unit}</span>
            </span>
          )}
        </div>
      </div>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="focus-ring grid size-7 place-items-center rounded-lg text-slate transition-colors hover:bg-white/[0.06] hover:text-titanium"
          aria-label={`${label} contract on Blockscout`}
        >
          <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
        </a>
      )}
    </div>
  );
}

export function AccountSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const wallet = useWallet();
  const network = useNetwork();
  const { disconnect } = useDisconnect();
  const { copied, copy } = useCopy();
  const { switchToRobinhood, status, message, reset } = useSwitchToRobinhood();

  const address = wallet.address;

  return (
    <Modal open={open} onClose={onClose} title="Account" bareHeader>
      <div className="px-5 pb-6 pt-5 sm:px-6">
        {/* Identity */}
        <div className="flex items-center gap-3.5">
          <AddressAvatar address={address} className="size-11" />
          <div className="min-w-0 flex-1">
            <div className="mono text-[15px] font-medium tracking-[-0.02em] text-gallery">
              {truncateAddress(address, 8, 6)}
            </div>
            <div className="mt-1 text-[11.5px] text-mist">
              {wallet.connectorName ?? "Connected"}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => address && copy(address)}
              className="focus-ring grid size-8 place-items-center rounded-[9px] border border-white/10 bg-white/[0.035] text-titanium transition-colors hover:bg-white/[0.08] hover:text-gallery"
              aria-label={copied ? "Address copied" : "Copy address"}
            >
              {copied ? (
                <Check className="size-3.5 text-lime" strokeWidth={2} />
              ) : (
                <Copy className="size-3.5" strokeWidth={1.6} />
              )}
            </button>
            <a
              href={address ? explorerAddress(address) : "#"}
              target="_blank"
              rel="noreferrer noopener"
              className="focus-ring grid size-8 place-items-center rounded-[9px] border border-white/10 bg-white/[0.035] text-titanium transition-colors hover:bg-white/[0.08] hover:text-gallery"
              aria-label="View address on Robinhood Chain Blockscout"
            >
              <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
            </a>
          </div>
        </div>

        {/* Network state */}
        <div
          className={cn(
            "mt-5 rounded-[12px] border px-4 py-3.5",
            wallet.onRobinhoodChain
              ? "border-active/20 bg-active/[0.05]"
              : "border-amber/25 bg-amber/[0.06]",
          )}
        >
          {wallet.onRobinhoodChain ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="pulse-dot relative size-[6px] rounded-full bg-active text-active"
                />
                <div>
                  <div className="text-[13px] font-medium tracking-[-0.01em] text-gallery">
                    Robinhood Chain · Mainnet
                  </div>
                  <div className="mono mt-0.5 text-[11px] text-mist">
                    Chain {RH_CHAIN_ID}
                    {network.blockNumber !== null && (
                      <> · Block {formatBlock(network.blockNumber)}</>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-[13px] font-medium tracking-[-0.01em] text-gallery">
                Connected to another network
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-mist">
                Your wallet reports chain {wallet.chainId ?? "unknown"}. FIRM
                operates on Robinhood Chain, chain ID {RH_CHAIN_ID}.
              </p>
              <Button
                size="sm"
                variant="signal"
                className="mt-3"
                loading={status === "switching"}
                onClick={() => {
                  reset();
                  void switchToRobinhood();
                }}
              >
                Switch to Robinhood Chain
              </Button>
              {message && (
                <p className="mt-2.5 text-[11.5px] leading-relaxed text-amber">
                  {message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Real balances */}
        <div className="mt-5 divide-y divide-white/[0.06] overflow-hidden rounded-[12px] border border-white/[0.08] bg-white/[0.018]">
          <BalanceRow
            label="ETH · Robinhood Chain"
            value={wallet.eth.formatted}
            unit={wallet.eth.symbol}
            loading={wallet.eth.isLoading}
            error={wallet.eth.isError}
          />
          <BalanceRow
            label="USDG"
            value={wallet.usdg.formatted}
            unit="USDG"
            loading={wallet.usdg.isLoading}
            error={wallet.usdg.isError}
            href={explorerToken(CONTRACTS.USDG)}
          />
        </div>

        {wallet.usdg.isError && (
          <ErrorState
            className="mt-3"
            title="USDG balance could not be read"
            body="The canonical USDG contract did not respond. Balances are read directly from Robinhood Chain and are never estimated."
            onRetry={() => void wallet.usdg.refetch()}
          />
        )}

        <p className="mt-4 flex items-center gap-1.5 text-[11px] text-slate">
          <RefreshCw className="size-3" strokeWidth={1.5} />
          Balances are read live from Robinhood Chain.
        </p>

        <Button
          variant="outline"
          className="mt-5 w-full"
          onClick={() => {
            disconnect();
            onClose();
          }}
        >
          <LogOut className="size-3.5" strokeWidth={1.6} />
          Disconnect
        </Button>
      </div>
    </Modal>
  );
}
