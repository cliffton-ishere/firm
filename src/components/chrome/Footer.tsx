import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FirmLockup } from "@/components/brand/Logo";
import { RH_EXPLORER_URL } from "@/lib/chain";
import { ROUTES } from "@/lib/routes";
import { Tooltip } from "@/components/ui/Tooltip";

export function Footer() {
  const year = 2026;

  return (
    <footer className="hairline-t relative mt-24 bg-[#070808]">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-7 lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[30ch]">
            <FirmLockup size="md" className="text-gallery" />
            <p className="mt-4 text-[13px] leading-relaxed text-mist">
              Autonomous capital market. Launch, fund, follow and fork AI
              investment firms operating transparently on Robinhood Chain.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.03] px-3 py-1.5">
              <span aria-hidden className="size-[5px] rounded-full bg-lime" />
              <span className="label text-titanium">Built on Robinhood Chain</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3 lg:gap-x-16">
            <div>
              <h3 className="label text-slate">Market</h3>
              <ul className="mt-4 space-y-2.5">
                {ROUTES.map((r) => (
                  <li key={r.href}>
                    <Link
                      href={r.href}
                      className="focus-ring rounded text-[13px] text-titanium transition-colors hover:text-gallery"
                    >
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="label text-slate">Network</h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a
                    href={RH_EXPLORER_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="focus-ring inline-flex items-center gap-1 rounded text-[13px] text-titanium transition-colors hover:text-gallery"
                  >
                    Blockscout explorer
                    <ArrowUpRight className="size-3" strokeWidth={1.6} />
                  </a>
                </li>
                <li className="mono text-[12px] text-mist">Chain ID 4663</li>
                <li className="mono text-[12px] text-mist">Settlement · USDG</li>
              </ul>
            </div>

            <div>
              <h3 className="label text-slate">Disclosures</h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link
                    href="/docs#disclosures"
                    className="focus-ring rounded text-[13px] text-titanium transition-colors hover:text-gallery"
                  >
                    Risk disclosure
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs#disclosures"
                    className="focus-ring rounded text-[13px] text-titanium transition-colors hover:text-gallery"
                  >
                    Eligibility notice
                  </Link>
                </li>
                <li>
                  <Tooltip content="Genesis League figures describe tracked strategy performance and are shown for product preview. Wallet balances and network data are read live from Robinhood Chain.">
                    <span className="label cursor-help rounded-full border border-white/10 px-2 py-1 text-slate">
                      Product Preview
                    </span>
                  </Tooltip>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="hairline-t mt-12 flex flex-col gap-5 pt-7 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-[76ch] text-[11.5px] leading-relaxed text-slate">
            FIRM is non-custodial software. Autonomous strategies can lose value.
            Asset availability and eligibility depend on jurisdiction. Robinhood
            Stock Tokens provide economic exposure and do not represent direct
            ownership of underlying shares. FIRM is built on Robinhood Chain and
            is not affiliated with or endorsed by Robinhood.
          </p>
          <p className="mono shrink-0 text-[11.5px] text-slate">© {year} FIRM</p>
        </div>
      </div>
    </footer>
  );
}
