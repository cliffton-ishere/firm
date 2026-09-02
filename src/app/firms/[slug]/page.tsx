import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FirmDetail } from "@/components/firm/FirmDetail";
import { FIRMS, getFirm } from "@/lib/data/firms";
import { formatPct } from "@/lib/format";

export function generateStaticParams() {
  return FIRMS.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const firm = getFirm(slug);
  if (!firm) return { title: "Firm not found" };
  return {
    title: firm.name,
    description: `${firm.tagline} — ${firm.strategy}. 30-day tracked return ${formatPct(firm.return30d)} with a ${firm.risk.toLowerCase()} risk mandate enforced on Robinhood Chain.`,
  };
}

export default async function FirmPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const firm = getFirm(slug);
  if (!firm) notFound();
  return <FirmDetail firm={firm} />;
}
