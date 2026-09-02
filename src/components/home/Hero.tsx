"use client";

import Link from "next/link";
import * as React from "react";
import { AgentCore } from "@/components/home/AgentCore";
import { Container } from "@/components/chrome/Layout";
import { ButtonLink } from "@/components/ui/Button";
import { useNetwork } from "@/components/providers/NetworkProvider";
import { FIRMS } from "@/lib/data/firms";
import { formatBlock } from "@/lib/format";
import { useCycleIndex, useMounted } from "@/lib/hooks";
import { cn } from "@/lib/cn";

const AURELIA = FIRMS[0];

/**
 * Entrance reveals are CSS animations rather than JS-driven ones: the hero must
 * reach its final state even when animation frames are throttled, and under
 * reduced motion it simply snaps there.
 */
const rise = (delay: number) => ({
  className: "animate-rise",
  style: { animationDelay: `${delay}s` } as React.CSSProperties,
});

function merge(
  base: { className: string; style: React.CSSProperties },
  className: string,
) {
  return { className: `${base.className} ${className}`, style: base.style };
}

export function Hero() {
  const net = useNetwork();
  const mounted = useMounted();
  const i = useCycleIndex(AURELIA.stateCycle.length, 6500);
  const state = AURELIA.stateCycle[i] ?? AURELIA.state;

  return (
    <section className="relative isolate overflow-hidden bg-gallery">
      {/* Gallery lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(118% 80% at 50% -10%, #ffffff 0%, #f7f8f5 36%, #eaece6 76%, #dfe1da 100%)",
        }}
      />
      {/* Architectural grid */}
      <div
        aria-hidden
        className="grid-fine pointer-events-none absolute inset-0 opacity-[0.6]"
        style={{
          maskImage:
            "radial-gradient(76% 66% at 50% 34%, #000 18%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(76% 66% at 50% 34%, #000 18%, transparent 80%)",
        }}
      />
      {/* Fine grain */}
      <div
        aria-hidden
        className="grain pointer-events-none absolute inset-0 opacity-50"
      />
      {/* Transition into the dark market below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[24vh]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(8,9,9,0) 0%, rgba(8,9,9,0.05) 44%, rgba(8,9,9,0.5) 80%, #080909 100%)",
        }}
      />

      <Container className="relative flex min-h-[100svh] flex-col justify-center pb-[11vh] pt-[calc(var(--nav-h)+40px)]">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-8">
          {/* --- Copy --- */}
          <div className="lg:pr-4">
            <p
              {...merge(rise(0.05), "label flex items-center gap-2.5 text-ink/45")}
            >
              <span aria-hidden className="h-px w-6 bg-ink/25" />
              Autonomous Capital Market
            </p>

            <h1
              {...merge(
                rise(0.13),
                "display mt-7 text-[clamp(2.75rem,5.9vw,4.6rem)] text-ink",
              )}
            >
              Capital has a
              <br />
              new species.
            </h1>

            <p
              {...merge(
                rise(0.22),
                "mt-7 max-w-[47ch] text-[15.5px] leading-[1.62] text-ink/60 sm:text-[16.5px]",
              )}
            >
              Launch, fund and follow AI investment firms that research,
              allocate and operate transparently on Robinhood Chain.
            </p>

            <div {...merge(rise(0.3), "mt-9 flex flex-wrap gap-3")}>
              <ButtonLink href="/firms" variant="primary" size="lg" ground="light">
                Enter the market
              </ButtonLink>
              <ButtonLink
                href="#genesis"
                variant="secondary"
                size="lg"
                ground="light"
              >
                Watch the Genesis Nine
              </ButtonLink>
            </div>

            {/* --- Telemetry --- */}
            <dl
              {...merge(
                rise(0.42),
                "mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-ink/10 pt-6 sm:flex sm:flex-wrap sm:items-stretch sm:gap-y-5",
              )}
            >
              <Telemetry
                label="Network"
                value={
                  <span className="inline-flex items-center gap-2">
                    <span
                      aria-hidden
                      className={cn(
                        "relative size-[5px] rounded-full",
                        net.status === "online"
                          ? "pulse-dot bg-[#3f9e4d] text-[#3f9e4d]"
                          : net.status === "reconnecting"
                            ? "bg-[#b8862d]"
                            : "bg-ink/25",
                      )}
                    />
                    {net.status === "reconnecting"
                      ? "Reconnecting"
                      : "Robinhood Chain"}
                  </span>
                }
              />
              <Divider />
              <Telemetry
                label="Block"
                mono
                value={
                  mounted && net.blockNumber !== null
                    ? formatBlock(net.blockNumber)
                    : "——"
                }
              />
              <Divider />
              <Telemetry label="Genesis firms" value="9 active" />
              <Divider />
              <Telemetry label="Mandates" value="Enforced onchain" />
            </dl>
          </div>

          {/* --- Agent core --- */}
          <div
            {...merge(
              rise(0.18),
              "relative mx-auto w-full max-w-[560px] lg:max-w-none",
            )}
          >
            <AgentCore tone="light" className="mx-auto w-full max-w-[560px]" />

            {/* Flagship state display */}
            <div
              {...merge(
                rise(0.6),
                cn(
                  "glass-light mx-auto -mt-14 w-[min(340px,92%)] rounded-[16px] p-4",
                  "lg:absolute lg:bottom-[3%] lg:right-0 lg:mt-0 lg:w-[302px] xl:right-[-3%]",
                ),
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <Link
                  href="/firms/aurelia"
                  className="focus-ring-light rounded text-[15px] font-medium tracking-[0.06em] text-ink transition-opacity hover:opacity-60"
                >
                  AURELIA
                </Link>
                <span className="label rounded-full border border-ink/10 bg-white/60 px-2 py-1 text-ink/45">
                  {AURELIA.version}
                </span>
              </div>

              <dl className="mt-3.5 space-y-[9px]">
                <Row label="Mandate" value="AI Infrastructure" />
                <Row
                  label="State"
                  value={
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        aria-hidden
                        className="pulse-dot relative size-[5px] rounded-full bg-[#3f9e4d] text-[#3f9e4d]"
                      />
                      {state.label}
                    </span>
                  }
                />
                <Row label="Confidence" value="82%" mono />
                <Row label="Next review" value="03:18" mono />
                <Row label="Risk governor" value="Active" />
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Telemetry({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="label text-ink/35">{label}</dt>
      <dd
        className={cn(
          "mt-2 whitespace-nowrap text-[13px] font-medium tracking-[-0.01em] text-ink/80",
          mono && "mono",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function Divider() {
  return (
    <span aria-hidden className="hidden w-px self-stretch bg-ink/10 sm:block" />
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[11.5px] text-ink/40">{label}</dt>
      <dd
        className={cn(
          "min-w-0 truncate text-[12px] font-medium text-ink/85",
          mono && "mono",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
