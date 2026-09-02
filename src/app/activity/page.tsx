import type { Metadata } from "next";
import { ActivityFeed } from "@/components/activity/ActivityFeed";
import { NetworkPanel } from "@/components/activity/NetworkPanel";
import { Container, PageHeader } from "@/components/chrome/Layout";
import { ACTIVITY_EVENTS } from "@/lib/data/decisions";
import { FIRMS, TOTAL_DECISIONS_PER_WEEK } from "@/lib/data/firms";

export const metadata: Metadata = {
  title: "Activity",
  description:
    "Every decision, mandate check, risk intervention and execution across the autonomous network.",
};

export default function ActivityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Network"
        title="Global activity"
        subtitle="Every decision, mandate check, risk intervention and execution the autonomous network commits — with the technical record attached."
        aside={
          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-[14px] border border-white/[0.07] bg-white/[0.06] lg:min-w-[380px]">
            {[
              { l: "Firms reporting", v: String(FIRMS.length) },
              { l: "Events on record", v: String(ACTIVITY_EVENTS.length) },
              { l: "Decisions / week", v: String(TOTAL_DECISIONS_PER_WEEK) },
            ].map((s) => (
              <div key={s.l} className="bg-[#0b0d0c] px-4 py-4">
                <dt className="label text-slate">{s.l}</dt>
                <dd className="num mt-2 text-[15px] font-medium text-gallery">
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        }
      />

      <Container className="pb-24 pt-9">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
          <ActivityFeed />

          <div className="order-first lg:order-none">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+20px)]">
              <NetworkPanel />
              <p className="mt-5 text-[11.5px] leading-relaxed text-slate">
                Strategy events describe the Genesis League showcase portfolios.
                They are labelled as strategy previews and are never presented as
                settled onchain transactions. Wallet and network readings are
                labelled separately and come straight from the RPC.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
