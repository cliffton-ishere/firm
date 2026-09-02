"use client";

import { ArrowLeft, Check, Copy, Plus, Share2 } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Sigil } from "@/components/brand/Sigil";
import { Container } from "@/components/chrome/Layout";
import { Delta, RiskBadge, StateBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { InfoDot } from "@/components/ui/Tooltip";
import { cn } from "@/lib/cn";
import { decisionsFor } from "@/lib/data/decisions";
import { BENCHMARK } from "@/lib/data/firms";
import { formatPct, formatUsdg } from "@/lib/format";
import { useCopy, useCycleIndex, useLocalStorage } from "@/lib/hooks";
import type { Firm } from "@/lib/types";
import { AllocateFlow } from "./AllocateFlow";
import { CommitteePanel } from "./CommitteePanel";
import { Countdown } from "./Countdown";
import { DecisionCard } from "./DecisionCard";
import { MandatePanel } from "./MandatePanel";
import { PerformancePanel } from "./PerformancePanel";
import { PortfolioPanel } from "./PortfolioPanel";

export function FirmDetail({ firm }: { firm: Firm }) {
  const [allocateOpen, setAllocateOpen] = React.useState(false);
  const [followed, setFollowed] = useLocalStorage<string[]>("firm:following", []);
  const { copied, copy } = useCopy();

  const i = useCycleIndex(firm.stateCycle.length, 6500);
  const state = firm.stateCycle[i] ?? firm.state;
  const live = state.kind === "Evaluating" || state.kind === "Simulating";

  const decisions = React.useMemo(() => decisionsFor(firm.slug), [firm.slug]);
  const isFollowing = followed.includes(firm.slug);
  const spread = firm.return30d - BENCHMARK.return30d;

  const toggleFollow = () =>
    setFollowed((list) =>
      list.includes(firm.slug)
        ? list.filter((s) => s !== firm.slug)
        : [...list, firm.slug],
    );

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: `${firm.name} · FIRM`, url });
        return;
      } catch {
        /* the share sheet was dismissed — fall through to copying */
      }
    }
    void copy(url);
  };

  return (
    <>
      {/* ---------------- Header ---------------- */}
      <header className="relative overflow-hidden border-b border-white/[0.06]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(100% 90% at 18% -20%, rgba(199,255,74,0.08), transparent 60%)",
          }}
        />
        <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-40" />

        <Container className="relative pb-9 pt-[calc(var(--nav-h)+38px)]">
          <Link
            href="/firms"
            className="focus-ring inline-flex items-center gap-1.5 rounded text-[12.5px] text-mist transition-colors hover:text-gallery"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.6} />
            All firms
          </Link>

          <div className="mt-7 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-5">
              <span
                className={cn(
                  "grid size-16 shrink-0 place-items-center rounded-[18px] border border-white/[0.09] bg-white/[0.025] text-titanium transition-colors duration-700 sm:size-[76px]",
                  live && "border-lime/25 text-gallery",
                )}
              >
                <Sigil id={firm.slug} active={live} className="size-10 sm:size-12" />
              </span>

              <div className="min-w-0">
                <h1 className="display text-[clamp(2rem,4.4vw,3.1rem)] text-gallery">
                  {firm.name}
                </h1>
                <p className="mt-2.5 text-[14px] text-mist">{firm.tagline}</p>

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2.5">
                  <StateBadge label={state.label} kind={state.kind} />
                  <span aria-hidden className="h-3 w-px bg-white/12" />
                  <RiskBadge risk={firm.risk} />
                  <span aria-hidden className="h-3 w-px bg-white/12" />
                  <span className="mono text-[11.5px] text-slate">
                    #{firm.rank} in league
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 flex-col items-stretch gap-4 lg:items-end">
              <div className="flex flex-wrap gap-2.5">
                <Button
                  variant={isFollowing ? "secondary" : "outline"}
                  onClick={toggleFollow}
                  aria-pressed={isFollowing}
                >
                  {isFollowing ? (
                    <>
                      <Check className="size-3.5 text-lime" strokeWidth={2} />
                      Following
                    </>
                  ) : (
                    <>
                      <Plus className="size-3.5" strokeWidth={1.8} />
                      Follow
                    </>
                  )}
                </Button>
                <Button variant="signal" onClick={() => setAllocateOpen(true)}>
                  Allocate
                </Button>
                <Button
                  variant="outline"
                  iconOnly
                  onClick={share}
                  aria-label={copied ? "Link copied" : "Share firm"}
                >
                  {copied ? (
                    <Copy className="size-3.5 text-lime" strokeWidth={1.8} />
                  ) : (
                    <Share2 className="size-3.5" strokeWidth={1.6} />
                  )}
                </Button>
              </div>

              <dl className="flex flex-wrap items-center gap-x-5 gap-y-2 lg:justify-end">
                <Meta label="Version" value={firm.version} mono />
                <Meta label="Mandate" value="Enforced" tone="active" />
                <Meta label="Risk governor" value="Active" tone="active" />
              </dl>
            </div>
          </div>
        </Container>
      </header>

      {/* ---------------- Metrics ---------------- */}
      <Container className="pt-8">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[16px] border border-white/[0.07] bg-white/[0.06] md:grid-cols-4 xl:grid-cols-7">
          <Cell
            label="League capital"
            value={formatUsdg(firm.capital, { compact: true })}
            info="Tracked strategy capital in the Genesis League. This is not verified customer AUM and does not represent deposits held on your behalf."
          />
          <Cell label="30D return" value={<Delta value={firm.return30d} size="base" showGlyph={false} />} />
          <Cell
            label="vs benchmark"
            value={
              <span className={spread >= 0 ? "text-active" : "text-coral"}>
                {formatPct(spread)}
              </span>
            }
            info="Spread against BENCHMARK-01, the passive technology index firm that starts each season on the same terms."
          />
          <Cell label="Max drawdown" value={formatPct(firm.maxDrawdown)} />
          <Cell
            label="Risk score"
            value={firm.riskScore.toFixed(2)}
            info="A Sharpe-like ratio of tracked return to realised volatility over the season to date."
          />
          <Cell
            label="Decision accuracy"
            value={
              firm.decisionAccuracy === 0
                ? "—"
                : `${firm.decisionAccuracy.toFixed(1)}%`
            }
            info="The share of committed decisions that met their stated objective within the expected holding period."
          />
          <Cell
            label="Next review"
            value={<Countdown from={firm.nextReview} className="mono" />}
          />
        </dl>
      </Container>

      {/* ---------------- Body ---------------- */}
      <Container className="pb-24 pt-5">
        <PerformancePanel firm={firm} className="mt-4" height={320} />

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.32fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <PortfolioPanel firm={firm} />

            <section
              aria-label="Decision stream"
              className="rounded-[18px] border border-white/[0.07] bg-[#0a0c0b]"
            >
              <header className="flex items-start justify-between gap-4 border-b border-white/[0.06] p-5">
                <div>
                  <h2 className="text-[15px] font-medium tracking-[-0.02em] text-gallery">
                    Decision stream
                  </h2>
                  <p className="mt-1.5 max-w-[52ch] text-[12.5px] leading-relaxed text-mist">
                    Every proposal, modification and rejection, in the order the
                    firm committed them.
                  </p>
                </div>
                <span className="label shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-slate">
                  {firm.decisionsPerWeek}/week
                </span>
              </header>
              <div className="space-y-2.5 p-4 sm:p-5">
                {decisions.map((d) => (
                  <DecisionCard key={d.id} decision={d} />
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-4">
            <CommitteePanel firm={firm} />
            <MandatePanel firm={firm} />
          </div>
        </div>
      </Container>

      <AllocateFlow
        firm={firm}
        open={allocateOpen}
        onClose={() => setAllocateOpen(false)}
      />
    </>
  );
}

function Meta({
  label,
  value,
  mono,
  tone,
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: "active";
}) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="label text-slate">{label}</dt>
      <dd
        className={cn(
          "text-[12px] font-medium",
          mono && "mono",
          tone === "active" ? "text-active" : "text-titanium",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function Cell({
  label,
  value,
  info,
}: {
  label: string;
  value: React.ReactNode;
  info?: string;
}) {
  return (
    <div className="bg-[#0b0d0c] px-4 py-4">
      <dt className="label flex items-center gap-1.5 text-slate">
        <span className="truncate">{label}</span>
        {info && <InfoDot content={info} />}
      </dt>
      <dd className="num mt-2.5 text-[18px] font-medium tracking-[-0.02em] text-gallery">
        {value}
      </dd>
    </div>
  );
}
