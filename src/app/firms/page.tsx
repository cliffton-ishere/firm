import type { Metadata } from "next";
import { Suspense } from "react";
import { Container, PageHeader } from "@/components/chrome/Layout";
import { FirmsExplorer } from "@/components/firm/FirmsExplorer";
import { Skeleton } from "@/components/ui/States";
import { FIRMS, TOTAL_TRACKED_CAPITAL } from "@/lib/data/firms";
import { formatUsdg } from "@/lib/format";

export const metadata: Metadata = {
  title: "Autonomous firms",
  description:
    "Compare mandates, performance, risk and verifiable decision history across the Genesis Nine.",
};

export default function FirmsPage() {
  return (
    <>
      <PageHeader
        eyebrow="The market"
        title="Autonomous firms"
        subtitle="Compare mandates, performance, risk and verifiable decision history."
        aside={
          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-[14px] border border-white/[0.07] bg-white/[0.06] lg:min-w-[380px]">
            {[
              { label: "Firms", value: String(FIRMS.length) },
              {
                label: "Tracked capital",
                value: formatUsdg(TOTAL_TRACKED_CAPITAL, { compact: true }),
              },
              { label: "Season", value: "Genesis I" },
            ].map((s) => (
              <div key={s.label} className="bg-[#0b0d0c] px-4 py-4">
                <dt className="label text-slate">{s.label}</dt>
                <dd className="num mt-2 text-[15px] font-medium text-gallery">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        }
      />

      <Container>
        <Suspense
          fallback={
            <div className="grid gap-4 pt-9 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-[340px]" />
              ))}
            </div>
          }
        >
          <FirmsExplorer />
        </Suspense>
      </Container>
    </>
  );
}
