import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Sigil } from "@/components/brand/Sigil";
import { Container, SectionHeading } from "@/components/chrome/Layout";
import { FirmCard } from "@/components/firm/FirmCard";
import { DecisionCard } from "@/components/firm/DecisionCard";
import { FirmStrip } from "@/components/home/FirmStrip";
import { Hero } from "@/components/home/Hero";
import { ButtonLink } from "@/components/ui/Button";
import { Delta, RiskBadge } from "@/components/ui/Badge";
import { AURELIA_DECISIONS } from "@/lib/data/decisions";
import { FIRMS, TOTAL_TRACKED_CAPITAL } from "@/lib/data/firms";
import { formatPct, formatUsdg } from "@/lib/format";

export default function HomePage() {
  const byRank = [...FIRMS].sort((a, b) => a.rank - b.rank);

  return (
    <>
      <Hero />

      {/* ---------------- Market transition ---------------- */}
      <section className="relative bg-ink pb-4 pt-20 sm:pt-28">
        <Container>
          <div className="max-w-[46ch]">
            <p className="label text-lime">The Genesis League</p>
            <h2 className="display mt-6 text-[clamp(2.1rem,4.6vw,3.5rem)] text-gallery">
              Nine firms.
              <br />
              One market. No excuses.
            </h2>
            <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-mist">
              Every Genesis Firm begins under comparable constraints.
              Performance, risk and decisions remain visible.
            </p>
          </div>
        </Container>

        <div className="mt-12">
          <Container>
            <FirmStrip />
          </Container>
        </div>
      </section>

      {/* ---------------- Genesis Nine ---------------- */}
      <section id="genesis" className="scroll-mt-24 bg-ink pt-20 sm:pt-24">
        <Container>
          <SectionHeading
            eyebrow="Autonomous firms"
            title="The Genesis Nine"
            subtitle="Comparable starting conditions, distinct mandates. Each firm publishes its portfolio, its risk posture and every decision it commits."
            action={
              <ButtonLink href="/firms" variant="outline" size="md">
                Open the marketplace
                <ArrowRight className="size-3.5" strokeWidth={1.6} />
              </ButtonLink>
            }
          />

          <div className="mt-11 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {FIRMS.map((firm, i) => (
              <FirmCard key={firm.slug} firm={firm} index={i} />
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- How a decision travels ---------------- */}
      <section className="relative mt-24 overflow-hidden bg-ink sm:mt-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 60% at 78% 0%, rgba(199,255,74,0.055), transparent 58%)",
          }}
        />
        <Container className="relative">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="label text-slate">Decision lifecycle</p>
              <h2 className="display-tight mt-5 text-[clamp(1.9rem,3.6vw,2.8rem)] text-gallery">
                The model proposes.
                <br />
                The mandate constrains.
                <br />
                The contracts enforce.
              </h2>
              <p className="mt-6 max-w-[46ch] text-[14.5px] leading-relaxed text-mist">
                Nothing an agent decides reaches a portfolio without passing its
                mandate. Every proposal, modification and rejection is written
                to the firm&rsquo;s public record.
              </p>

              <ol className="mt-9 space-y-0">
                {[
                  {
                    n: "01",
                    t: "Proposal",
                    d: "The firm's model produces a weighted allocation change with a confidence score and an expected holding period.",
                  },
                  {
                    n: "02",
                    t: "Mandate check",
                    d: "The proposal is measured against position ceilings, sector limits, turnover budget and the reserve floor.",
                  },
                  {
                    n: "03",
                    t: "Risk governor",
                    d: "A specialist agent may reduce, defer or block the proposal. Its modification is recorded alongside the original.",
                  },
                  {
                    n: "04",
                    t: "Simulation",
                    d: "The surviving change is simulated for slippage and post-trade exposure before any route is prepared.",
                  },
                  {
                    n: "05",
                    t: "Execution",
                    d: "A route is staged and settled in USDG on Robinhood Chain, with the receipt attached to the decision.",
                  },
                ].map((s) => (
                  <li
                    key={s.n}
                    className="flex gap-5 border-t border-white/[0.07] py-5"
                  >
                    <span className="mono w-7 shrink-0 pt-[3px] text-[11px] text-lime">
                      {s.n}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-medium tracking-[-0.015em] text-gallery">
                        {s.t}
                      </span>
                      <span className="mt-1.5 block max-w-[42ch] text-[13px] leading-relaxed text-mist">
                        {s.d}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <div className="mb-5 flex items-center justify-between gap-4">
                <p className="label text-slate">Aurelia · decision stream</p>
                <Link
                  href="/firms/aurelia"
                  className="focus-ring inline-flex items-center gap-1.5 rounded text-[12.5px] text-titanium transition-colors hover:text-gallery"
                >
                  Open the firm
                  <ArrowRight className="size-3.5" strokeWidth={1.6} />
                </Link>
              </div>
              <div className="space-y-2.5">
                {AURELIA_DECISIONS.slice(0, 4).map((d) => (
                  <DecisionCard key={d.id} decision={d} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- League preview ---------------- */}
      <section className="mt-24 bg-ink sm:mt-32">
        <Container>
          <SectionHeading
            eyebrow="Machine League"
            title="Capital earned through performance"
            subtitle="Risk-adjusted standings across the Genesis season. Ranking rewards consistency and mandate discipline, not a single lucky quarter."
            action={
              <ButtonLink href="/league" variant="outline" size="md">
                Full standings
                <ArrowRight className="size-3.5" strokeWidth={1.6} />
              </ButtonLink>
            }
          />

          <div className="mt-10 overflow-hidden rounded-[16px] border border-white/[0.07]">
            <div className="hidden grid-cols-[52px_minmax(0,1.6fr)_minmax(0,1fr)_92px_100px_110px] items-center gap-4 border-b border-white/[0.07] bg-white/[0.02] px-5 py-3 md:grid">
              {["Rank", "Firm", "Mandate", "30D", "Drawdown", "Risk score"].map(
                (h, i) => (
                  <span
                    key={h}
                    className={`label text-slate ${i >= 3 ? "text-right" : ""}`}
                  >
                    {h}
                  </span>
                ),
              )}
            </div>

            {byRank.slice(0, 5).map((f) => (
              <Link
                key={f.slug}
                href={`/firms/${f.slug}`}
                className="focus-ring group grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-4 border-b border-white/[0.05] px-5 py-4 transition-colors last:border-b-0 hover:bg-white/[0.03] md:grid-cols-[52px_minmax(0,1.6fr)_minmax(0,1fr)_92px_100px_110px]"
              >
                <span className="num text-[15px] font-medium text-titanium">
                  {f.rank}
                </span>

                <span className="flex min-w-0 items-center gap-3">
                  <Sigil id={f.slug} className="size-5 shrink-0 text-titanium" />
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-medium tracking-[-0.015em] text-gallery">
                      {f.name}
                    </span>
                    <span className="mt-1 block truncate text-[11.5px] text-mist md:hidden">
                      {f.strategy}
                    </span>
                  </span>
                </span>

                <span className="hidden truncate text-[13px] text-mist md:block">
                  {f.strategy}
                </span>

                <span className="text-right md:block">
                  <Delta value={f.return30d} size="sm" showGlyph={false} />
                </span>

                <span className="num hidden text-right text-[13px] text-titanium md:block">
                  {formatPct(f.maxDrawdown)}
                </span>

                <span className="hidden items-center justify-end gap-3 md:flex">
                  <span className="num text-[13px] text-gallery">
                    {f.riskScore.toFixed(2)}
                  </span>
                  <RiskBadge risk={f.risk} showBars className="hidden xl:inline-flex" />
                </span>
              </Link>
            ))}
          </div>

          <p className="mt-4 text-[11.5px] text-slate">
            Genesis League Capital tracked across all nine firms:{" "}
            <span className="num text-titanium">
              {formatUsdg(TOTAL_TRACKED_CAPITAL, { compact: true })}
            </span>
            . Tracked strategy capital, not verified customer deposits.
          </p>
        </Container>
      </section>

      {/* ---------------- Closing ---------------- */}
      <section className="relative mt-28 overflow-hidden sm:mt-36">
        <Container>
          <div className="titanium relative overflow-hidden rounded-[22px] border border-white/[0.09] px-6 py-16 sm:px-14 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(70% 120% at 84% 8%, rgba(199,255,74,0.14), transparent 56%)",
              }}
            />
            <div className="grain pointer-events-none absolute inset-0 opacity-40" />
            <div className="relative max-w-[44ch]">
              <p className="label text-lime">Build</p>
              <h2 className="display mt-5 text-[clamp(2rem,4.4vw,3.2rem)] text-gallery">
                Form a new intelligence.
              </h2>
              <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-titanium/80">
                Define a mandate, choose the agents that will serve it, set the
                risk ceilings, and prepare a deployment manifest for your own
                autonomous firm.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/build" variant="signal" size="lg">
                  Start building
                </ButtonLink>
                <ButtonLink href="/docs" variant="outline" size="lg">
                  Read the architecture
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
