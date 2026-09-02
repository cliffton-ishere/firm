"use client";

import { ArrowLeft, Check, Loader2, Wallet } from "lucide-react";
import * as React from "react";
import { Sigil } from "@/components/brand/Sigil";
import { RiskBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Dialog";
import { ErrorState } from "@/components/ui/States";
import { Tooltip } from "@/components/ui/Tooltip";
import { useWalletUI } from "@/components/wallet/WalletUIProvider";
import { RH_CHAIN_ID, VAULT_FACTORY_ADDRESS } from "@/lib/chain";
import { cn } from "@/lib/cn";
import { formatUsdg } from "@/lib/format";
import { useChangeEffect, usePrefersReducedMotion } from "@/lib/hooks";
import { useSwitchToRobinhood, useWallet } from "@/lib/wallet";
import type { Firm } from "@/lib/types";

const MIN_ALLOCATION = 10;
const MANAGEMENT_FEE = 0.75;
const PERFORMANCE_FEE = 15;

type Step = 0 | 1 | 2 | 3;

const CHECKS = [
  { id: "wallet", label: "Wallet connected" },
  { id: "chain", label: "Robinhood Chain detected" },
  { id: "asset", label: "Asset permitted by mandate" },
  { id: "capacity", label: "Firm capacity available" },
  { id: "mandate", label: "Mandate valid" },
  { id: "simulation", label: "Simulation prepared" },
] as const;

/** Deterministic preview NAV per share. Clearly labelled as an estimate. */
function navPerShare(firm: Firm) {
  return Math.round((1 + firm.returnAll / 100) * 10000) / 10000;
}

export function AllocateFlow({
  firm,
  open,
  onClose,
}: {
  firm: Firm;
  open: boolean;
  onClose: () => void;
}) {
  const wallet = useWallet();
  const { openConnect } = useWalletUI();
  const { switchToRobinhood, status: switchStatus, message: switchMessage } =
    useSwitchToRobinhood();
  const reduced = usePrefersReducedMotion();

  const [step, setStep] = React.useState<Step>(0);
  const [amount, setAmount] = React.useState("");
  const [checkIndex, setCheckIndex] = React.useState(-1);

  const balance = wallet.usdg.numeric;
  const hasBalance = balance !== undefined;
  const value = Number(amount);
  const valid = Number.isFinite(value) && value >= MIN_ALLOCATION;
  // A shortfall is surfaced, not enforced: this flow never submits a
  // transaction, so blocking here would hide the route rather than protect
  // anyone. Submission itself will require the funds.
  const shortfall = hasBalance && valid && value > balance;

  // Reopening the sheet, or switching firms, restarts the flow.
  useChangeEffect(`${open}:${firm.slug}`, () => {
    setStep(0);
    setCheckIndex(-1);
  });

  // Entering the review stage puts the first check straight into "checking".
  useChangeEffect(step, (next) => setCheckIndex(next === 2 ? 0 : -1));

  // Sequential mandate and risk review.
  const tick = React.useRef(0);
  React.useEffect(() => {
    if (step !== 2 || reduced) return;
    tick.current = 0;
    const id = window.setInterval(() => {
      tick.current += 1;
      setCheckIndex(tick.current);
      if (tick.current >= CHECKS.length) window.clearInterval(id);
    }, 620);
    return () => window.clearInterval(id);
  }, [step, reduced]);

  // With reduced motion the review resolves immediately rather than stepping.
  const shownIndex = reduced ? CHECKS.length : checkIndex;
  const allChecksDone = shownIndex >= CHECKS.length;

  const setPercent = (p: number) => {
    if (balance === undefined) return;
    const v = Math.floor(balance * p * 100) / 100;
    setAmount(String(v));
  };

  const titles: Record<Step, string> = {
    0: "Choose amount",
    1: "Review allocation",
    2: "Risk and mandate checks",
    3: "Allocation route prepared",
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={`Allocate to ${firm.name}`}
      description={titles[step]}
    >
      <div className="flex min-h-full flex-col">
        {/* Progress */}
        <div className="flex items-center gap-1.5 px-5 pb-5 sm:px-6">
          {([0, 1, 2, 3] as Step[]).map((s) => (
            <span
              key={s}
              className={cn(
                "h-[2px] flex-1 rounded-full transition-colors duration-500",
                s <= step ? "bg-lime" : "bg-white/10",
              )}
            />
          ))}
        </div>

        <div className="flex-1 px-5 pb-6 sm:px-6">
          {/* Firm identity */}
          <div className="flex items-center gap-3 rounded-[13px] border border-white/[0.07] bg-white/[0.02] px-3.5 py-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-[10px] border border-white/[0.09] text-titanium">
              <Sigil id={firm.slug} className="size-[22px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-medium tracking-[-0.015em] text-gallery">
                {firm.name}
              </span>
              <span className="mt-0.5 block truncate text-[11.5px] text-mist">
                {firm.strategy}
              </span>
            </span>
            <RiskBadge risk={firm.risk} showBars={false} />
          </div>

          {/* ---------------- Step 0 — amount ---------------- */}
          {step === 0 && (
            <div className="mt-5">
              {!wallet.isConnected ? (
                <div className="rounded-[14px] border border-white/[0.08] bg-white/[0.02] px-5 py-8 text-center">
                  <Wallet className="mx-auto size-5 text-slate" strokeWidth={1.4} />
                  <p className="mt-4 text-[14px] font-medium tracking-[-0.015em] text-gallery">
                    Connect a wallet to allocate
                  </p>
                  <p className="mx-auto mt-2 max-w-[36ch] text-[12.5px] leading-relaxed text-mist">
                    FIRM reads your USDG balance directly from Robinhood Chain.
                    It never estimates the funds available to you.
                  </p>
                  <Button
                    variant="primary"
                    className="mt-5"
                    onClick={openConnect}
                  >
                    Connect wallet
                  </Button>
                </div>
              ) : (
                <>
                  {wallet.wrongNetwork && (
                    <div className="mb-4 rounded-[12px] border border-amber/25 bg-amber/[0.06] px-4 py-3.5">
                      <p className="text-[13px] font-medium text-gallery">
                        Switch to Robinhood Chain
                      </p>
                      <p className="mt-1 text-[12px] leading-relaxed text-mist">
                        Your wallet reports chain {wallet.chainId}. Allocation
                        requires chain {RH_CHAIN_ID}.
                      </p>
                      <Button
                        size="sm"
                        variant="signal"
                        className="mt-3"
                        loading={switchStatus === "switching"}
                        onClick={() => void switchToRobinhood()}
                      >
                        Switch network
                      </Button>
                      {switchMessage && (
                        <p className="mt-2.5 text-[11.5px] text-amber">
                          {switchMessage}
                        </p>
                      )}
                    </div>
                  )}

                  <label
                    htmlFor="allocate-amount"
                    className="label mb-2.5 flex items-center justify-between text-slate"
                  >
                    <span>Amount</span>
                    <span className="normal-case tracking-normal text-[10.5px]">
                      {wallet.usdg.isLoading
                        ? "Reading balance…"
                        : hasBalance
                          ? `Balance ${wallet.usdg.formatted} USDG`
                          : "Balance unavailable"}
                    </span>
                  </label>

                  <div
                    className={cn(
                      "flex items-center rounded-[12px] border bg-white/[0.028] px-4 transition-colors focus-within:border-white/25",
                      shortfall ? "border-amber/45" : "border-white/10",
                    )}
                  >
                    <input
                      id="allocate-amount"
                      type="number"
                      inputMode="decimal"
                      min={MIN_ALLOCATION}
                      step="any"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      aria-invalid={undefined}
                      className="num h-14 min-w-0 flex-1 bg-transparent text-[26px] font-medium tracking-[-0.03em] text-gallery outline-none placeholder:text-slate/60"
                    />
                    <span className="mono shrink-0 pl-3 text-[13px] text-mist">
                      USDG
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {[
                      { p: 0.25, l: "25%" },
                      { p: 0.5, l: "50%" },
                      { p: 0.75, l: "75%" },
                      { p: 1, l: "Max" },
                    ].map((s) => (
                      <Tooltip
                        key={s.l}
                        content={
                          hasBalance
                            ? `Allocate ${s.l} of your USDG balance`
                            : "Your USDG balance could not be read from Robinhood Chain, so shortcuts are unavailable."
                        }
                      >
                        <button
                          type="button"
                          disabled={!hasBalance}
                          onClick={() => setPercent(s.p)}
                          className="focus-ring h-8 w-full rounded-[9px] border border-white/[0.08] bg-white/[0.02] text-[12px] text-titanium transition-colors hover:border-white/16 hover:text-gallery disabled:opacity-35"
                        >
                          {s.l}
                        </button>
                      </Tooltip>
                    ))}
                  </div>

                  {shortfall && (
                    <p role="status" className="mt-3 text-[11.5px] leading-relaxed text-amber">
                      That exceeds the {wallet.usdg.formatted} USDG this address
                      holds on Robinhood Chain. The route can still be prepared —
                      submitting it would require the additional USDG.
                    </p>
                  )}
                  {amount !== "" && !valid && (
                    <p role="alert" className="mt-3 text-[11.5px] text-coral">
                      The minimum allocation is {MIN_ALLOCATION} USDG.
                    </p>
                  )}
                  {wallet.usdg.isError && (
                    <ErrorState
                      className="mt-4"
                      title="USDG balance could not be read"
                      body="Amount entry still works, but percentage shortcuts stay disabled rather than guessing your balance."
                      onRetry={() => void wallet.usdg.refetch()}
                    />
                  )}
                </>
              )}
            </div>
          )}

          {/* ---------------- Step 1 — review ---------------- */}
          {step === 1 && (
            <div className="mt-5">
              <div className="rounded-[14px] border border-white/[0.08] bg-white/[0.02] p-5">
                <div className="label text-slate">Allocation</div>
                <div className="num mt-2.5 text-[30px] font-medium tracking-[-0.03em] text-gallery">
                  {Number(amount).toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                  <span className="ml-2 text-[14px] text-mist">USDG</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="label rounded-md border border-white/10 px-1.5 py-1 text-slate">
                    Preview estimate
                  </span>
                  <span className="num text-[12px] text-mist">
                    ≈{" "}
                    {(Number(amount) / navPerShare(firm)).toLocaleString(
                      "en-US",
                      { maximumFractionDigits: 4 },
                    )}{" "}
                    firm shares at {navPerShare(firm).toFixed(4)} NAV
                  </span>
                </div>
              </div>

              <dl className="mt-4 overflow-hidden rounded-[14px] border border-white/[0.08]">
                {[
                  { l: "Firm", v: firm.name },
                  { l: "Mandate", v: firm.strategy },
                  { l: "Risk class", v: firm.risk },
                  { l: "Management fee", v: `${MANAGEMENT_FEE}% annual` },
                  {
                    l: "Performance fee",
                    v: `${PERFORMANCE_FEE}% above high-water mark`,
                  },
                  {
                    l: "Withdrawal",
                    v: "Weekly settlement window · no lock-up",
                  },
                  { l: "Network", v: `Robinhood Chain · ${RH_CHAIN_ID}` },
                  { l: "Settlement asset", v: "USDG" },
                ].map((r, i) => (
                  <div
                    key={r.l}
                    className={cn(
                      "flex items-baseline justify-between gap-4 px-4 py-3",
                      i > 0 && "border-t border-white/[0.05]",
                    )}
                  >
                    <dt className="text-[12.5px] text-mist">{r.l}</dt>
                    <dd className="text-right text-[12.5px] text-gallery">
                      {r.v}
                    </dd>
                  </div>
                ))}
              </dl>

              {shortfall && (
                <p className="mt-4 rounded-[10px] border border-amber/25 bg-amber/[0.05] px-3.5 py-3 text-[11.5px] leading-relaxed text-amber">
                  This address currently holds {wallet.usdg.formatted} USDG on
                  Robinhood Chain. Preparing the route does not move funds;
                  submitting it later would require the full amount.
                </p>
              )}

              <p className="mt-4 text-[11px] leading-relaxed text-slate">
                Share estimates are preview figures derived from the firm&rsquo;s
                tracked NAV. A network fee estimate is shown only once a real
                transaction simulation is available.
              </p>
            </div>
          )}

          {/* ---------------- Step 2 — checks ---------------- */}
          {step === 2 && (
            <div className="mt-5">
              <ul className="overflow-hidden rounded-[14px] border border-white/[0.08]">
                {CHECKS.map((c, i) => {
                  const state =
                    i < shownIndex
                      ? "passed"
                      : i === shownIndex
                        ? "checking"
                        : "queued";
                  return (
                    <li
                      key={c.id}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3.5 transition-colors duration-500",
                        i > 0 && "border-t border-white/[0.05]",
                        state === "passed" && "bg-active/[0.03]",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-5 shrink-0 place-items-center rounded-full border transition-all duration-400",
                          state === "passed" &&
                            "border-active/40 bg-active/15 text-active",
                          state === "checking" &&
                            "border-lime/40 bg-lime/10 text-lime",
                          state === "queued" && "border-white/12 text-slate",
                        )}
                      >
                        {state === "passed" ? (
                          <Check className="size-3" strokeWidth={2.5} />
                        ) : state === "checking" ? (
                          <Loader2 className="size-3 animate-spin" strokeWidth={2.2} />
                        ) : (
                          <span className="size-1 rounded-full bg-current" />
                        )}
                      </span>
                      <span
                        className={cn(
                          "flex-1 text-[13px] tracking-[-0.01em] transition-colors duration-400",
                          state === "queued" ? "text-slate" : "text-gallery",
                        )}
                      >
                        {c.label}
                      </span>
                      <span
                        className={cn(
                          "label transition-colors duration-400",
                          state === "passed" && "text-active",
                          state === "checking" && "text-lime",
                          state === "queued" && "text-slate",
                        )}
                      >
                        {state === "passed"
                          ? "Passed"
                          : state === "checking"
                            ? "Checking"
                            : "Queued"}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-[11px] leading-relaxed text-slate">
                Wallet and network checks read your live connection. Mandate,
                capacity and simulation checks are evaluated against the
                firm&rsquo;s published policy.
              </p>
            </div>
          )}

          {/* ---------------- Step 3 — ready ---------------- */}
          {step === 3 && (
            <div className="mt-5">
              <div className="rounded-[16px] border border-lime/25 bg-lime/[0.05] p-6 text-center">
                <span className="mx-auto grid size-11 place-items-center rounded-full border border-lime/35 bg-lime/10 text-lime">
                  <Check className="size-5" strokeWidth={2} />
                </span>
                <h3 className="mt-4 text-[17px] font-medium tracking-[-0.02em] text-gallery">
                  Allocation route prepared
                </h3>
                <p className="mx-auto mt-2.5 max-w-[38ch] text-[12.5px] leading-relaxed text-mist">
                  The interface is ready to submit once the production vault
                  deployment is configured.
                </p>
              </div>

              <dl className="mt-4 overflow-hidden rounded-[14px] border border-white/[0.08]">
                {[
                  { l: "Route", v: `USDG → ${firm.name} vault` },
                  {
                    l: "Amount",
                    v: `${Number(amount).toLocaleString("en-US", { maximumFractionDigits: 2 })} USDG`,
                  },
                  { l: "Checks", v: `${CHECKS.length} of ${CHECKS.length} passed` },
                  { l: "Network", v: `Robinhood Chain · ${RH_CHAIN_ID}` },
                  {
                    l: "Vault contract",
                    v: VAULT_FACTORY_ADDRESS ?? "Not yet configured",
                  },
                ].map((r, i) => (
                  <div
                    key={r.l}
                    className={cn(
                      "flex items-baseline justify-between gap-4 px-4 py-3",
                      i > 0 && "border-t border-white/[0.05]",
                    )}
                  >
                    <dt className="text-[12.5px] text-mist">{r.l}</dt>
                    <dd className="text-right text-[12.5px] text-gallery">
                      {r.v}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-4 text-[11px] leading-relaxed text-slate">
                No funds have moved and no transaction has been submitted. FIRM
                will request a signature only when a deployed vault address is
                configured for this firm.
              </p>
            </div>
          )}
        </div>

        {/* ---------------- Footer ---------------- */}
        <div className="hairline-t sticky bottom-0 bg-[#0b0d0c]/95 px-5 py-4 backdrop-blur-xl sm:px-6">
          {step === 0 &&
            (!wallet.isConnected ? (
              <Button variant="primary" className="w-full" onClick={openConnect}>
                Connect wallet to continue
              </Button>
            ) : wallet.wrongNetwork ? (
              <Button
                variant="signal"
                className="w-full"
                loading={switchStatus === "switching"}
                onClick={() => void switchToRobinhood()}
              >
                Switch to Robinhood Chain
              </Button>
            ) : (
              <Button
                variant="signal"
                className="w-full"
                disabled={!valid}
                onClick={() => setStep(1)}
              >
                Review allocation
              </Button>
            ))}
          {step === 1 && (
            <div className="flex gap-2.5">
              <Button variant="outline" onClick={() => setStep(0)} iconOnly aria-label="Back">
                <ArrowLeft className="size-4" strokeWidth={1.6} />
              </Button>
              <Button
                variant="signal"
                className="flex-1"
                onClick={() => setStep(2)}
              >
                Run risk and mandate checks
              </Button>
            </div>
          )}
          {step === 2 && (
            <div className="flex gap-2.5">
              <Button variant="outline" onClick={() => setStep(1)} iconOnly aria-label="Back">
                <ArrowLeft className="size-4" strokeWidth={1.6} />
              </Button>
              <Button
                variant="signal"
                className="flex-1"
                disabled={!allChecksDone}
                loading={!allChecksDone}
                onClick={() => setStep(3)}
              >
                {allChecksDone ? "Prepare allocation route" : "Reviewing"}
              </Button>
            </div>
          )}
          {step === 3 && (
            <Button variant="secondary" className="w-full" onClick={onClose}>
              Close
            </Button>
          )}

          <p className="mt-3 text-center text-[10.5px] text-slate">
            FIRM is non-custodial. Autonomous strategies can lose value.{" "}
            {formatUsdg(firm.capital, { compact: true })} tracked in this firm.
          </p>
        </div>
      </div>
    </Sheet>
  );
}
