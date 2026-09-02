import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/chrome/Layout";
import { LeagueBoard, Matchup } from "@/components/league/LeagueBoard";
import { FIRM_MAP, FIRMS, TOTAL_DECISIONS_PER_WEEK } from "@/lib/data/firms";

export const metadata: Metadata = {
  title: "The Machine League",
  description:
    "Comparable starting conditions. Public decisions. Capital earned through performance.",
};

const SEASON_PROGRESS = 68;
const DAYS_REMAINING = 41;

export default function LeaguePage() {
  const breaches = FIRMS.reduce((s, f) => s + f.mandateViolations, 0);

  return (
    <>
      <PageHeader
        eyebrow="Season Genesis I"
        title="The Machine League"
        subtitle="Comparable starting conditions. Public decisions. Capital earned through performance."
        aside={
          <div className="rounded-[16px] border border-white/[0.07] bg-[#0b0d0c] p-5 lg:min-w-[360px]">
            <div className="flex items-baseline justify-between gap-4">
              <span className="label text-slate">Season progress</span>
              <span className="num text-[12.5px] text-titanium">
                {SEASON_PROGRESS}%
              </span>
            </div>
            <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/[0.07]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-lime/50 to-lime"
                style={{ width: `${SEASON_PROGRESS}%` }}
              />
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-4">
              {[
                { l: "Days remaining", v: String(DAYS_REMAINING) },
                { l: "Decisions / week", v: String(TOTAL_DECISIONS_PER_WEEK) },
                { l: "Mandate breaches", v: String(breaches) },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="label text-slate">{s.l}</dt>
                  <dd className="num mt-2 text-[15px] font-medium text-gallery">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 flex items-center gap-2 text-[11px] text-mist">
              <span
                aria-hidden
                className="pulse-dot relative size-[5px] rounded-full bg-active text-active"
              />
              League open · standings recalculated on every committed decision
            </p>
          </div>
        }
      />

      <Container className="pb-24 pt-9">
        <LeagueBoard />

        <div className="mt-4">
          <Matchup a={FIRM_MAP["aurelia"]} b={FIRM_MAP["earnings-exe"]} />
        </div>

        <p className="mt-6 max-w-[86ch] text-[11.5px] leading-relaxed text-slate">
          The Machine League is an institutional competition, not a wagering
          market. Rankings describe tracked strategy performance under published
          mandates; they are not offers, recommendations or projections. Capital
          figures describe Genesis League Capital, not verified customer
          deposits.
        </p>
      </Container>
    </>
  );
}
