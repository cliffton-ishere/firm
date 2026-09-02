import { Sigil } from "@/components/brand/Sigil";
import { cn } from "@/lib/cn";
import type { Firm } from "@/lib/types";

const SPECIALTY_TONE: Record<string, string> = {
  Research: "text-[#a9c8ff]",
  Risk: "text-amber",
  Execution: "text-active",
  Audit: "text-titanium",
};

/**
 * The agent committee. A primary agent hires specialists, and each
 * specialist carries its own reputation across the market.
 */
export function CommitteePanel({
  firm,
  className,
}: {
  firm: Firm;
  className?: string;
}) {
  return (
    <section
      className={cn("rounded-[18px] border border-white/[0.07] bg-[#0a0c0b]", className)}
      aria-label="Agent committee"
    >
      <header className="flex items-start justify-between gap-4 border-b border-white/[0.06] p-5">
        <div>
          <h2 className="text-[15px] font-medium tracking-[-0.02em] text-gallery">
            Agent committee
          </h2>
          <p className="mt-1.5 max-w-[52ch] text-[12.5px] leading-relaxed text-mist">
            {firm.name} operates a primary model and retains specialist agents.
            Each carries a reputation earned across the market, not inside this
            firm alone.
          </p>
        </div>
        <span className="label shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-slate">
          {firm.committee.length} retained
        </span>
      </header>

      <ul className="grid gap-px bg-white/[0.05] sm:grid-cols-2">
        {firm.committee.map((a) => (
          <li key={a.id} className="bg-[#0a0c0b] p-5">
            <div className="flex items-start gap-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-[11px] border border-white/[0.08] bg-white/[0.025] text-titanium">
                <Sigil id={a.id} className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="mono truncate text-[13px] text-gallery">
                    {a.name}
                  </h3>
                  <span
                    className={cn(
                      "label shrink-0",
                      SPECIALTY_TONE[a.specialty] ?? "text-mist",
                    )}
                  >
                    {a.specialty}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2.5">
                  <span className="label text-slate">Reputation</span>
                  <span className="h-[3px] min-w-0 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                    <span
                      className="block h-full rounded-full bg-lime/70"
                      style={{ width: `${a.reputation}%` }}
                    />
                  </span>
                  <span className="num shrink-0 text-[11.5px] text-titanium">
                    {a.reputation}
                  </span>
                </div>

                <dl className="mt-4 space-y-2.5">
                  <div>
                    <dt className="label text-slate">Current assignment</dt>
                    <dd className="mt-1.5 text-[12.5px] text-titanium">
                      {a.assignment}
                    </dd>
                  </div>
                  <div>
                    <dt className="label text-slate">Last contribution</dt>
                    <dd className="mt-1.5 text-[12.5px] leading-relaxed text-mist">
                      {a.lastContribution}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
