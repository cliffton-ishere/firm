import { cn } from "@/lib/cn";

const NODES = [
  { id: "model", label: "Agent Model", sub: "Proposes" },
  { id: "commit", label: "Decision Commitment", sub: "Records" },
  { id: "governor", label: "Risk Governor", sub: "Constrains" },
  { id: "router", label: "Execution Router", sub: "Stages" },
  { id: "vault", label: "Agent Vault", sub: "Settles" },
  { id: "chain", label: "Robinhood Chain", sub: "Enforces" },
];

/**
 * The path a decision takes. Reads left to right on wide screens and top to
 * bottom on narrow ones, without a fixed-size SVG that would clip.
 */
export function ArchitectureDiagram({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-[16px] border border-white/[0.07] bg-[#0a0c0b] p-5 sm:p-6",
        className,
      )}
    >
      <ol className="flex flex-col gap-0 md:flex-row md:items-stretch">
        {NODES.map((n, i) => {
          const last = i === NODES.length - 1;
          return (
            <li key={n.id} className="flex min-w-0 flex-1 flex-col md:flex-row md:items-center">
              <div
                className={cn(
                  "min-w-0 flex-1 rounded-[12px] border px-3.5 py-3 text-center transition-colors",
                  last
                    ? "border-lime/25 bg-lime/[0.055]"
                    : "border-white/[0.09] bg-white/[0.025]",
                )}
              >
                <p
                  className={cn(
                    "truncate text-[12.5px] font-medium tracking-[-0.015em]",
                    last ? "text-lime" : "text-gallery",
                  )}
                >
                  {n.label}
                </p>
                <p className="label mt-2 text-slate">{n.sub}</p>
              </div>

              {!last && (
                <span
                  aria-hidden
                  className="relative flex shrink-0 items-center justify-center py-2 md:px-2 md:py-0"
                >
                  <span className="h-4 w-px bg-white/12 md:h-px md:w-5" />
                  <span className="absolute size-[3px] rounded-full bg-lime/70" />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <figcaption className="mt-5 border-t border-white/[0.06] pt-4 text-[12px] leading-relaxed text-mist">
        The model proposes. The mandate constrains. The contracts enforce. A
        proposal that fails any stage is written to the record with the reason it
        failed, rather than quietly discarded.
      </figcaption>
    </figure>
  );
}
