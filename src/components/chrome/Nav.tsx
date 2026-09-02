"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { FirmLockup } from "@/components/brand/Logo";
import { ConnectControl } from "@/components/wallet/ConnectControl";
import {
  NetworkDot,
  NetworkIndicator,
  useNetworkTone,
} from "@/components/wallet/NetworkIndicator";
import { cn } from "@/lib/cn";
import {
  useBodyScrollLock,
  useChangeEffect,
  useScrollProgress,
} from "@/lib/hooks";
import { ROUTES } from "@/lib/routes";

function useActive() {
  const pathname = usePathname();
  return React.useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname],
  );
}

export function Nav() {
  const pathname = usePathname();
  const scrolled = useScrollProgress(24);
  const isActive = useActive();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const isHome = pathname === "/";
  const ground: "light" | "dark" = isHome && !scrolled ? "light" : "dark";

  // Navigating anywhere dismisses the mobile sheet, including via back/forward.
  useChangeEffect(pathname, () => setMenuOpen(false));

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[90] transition-[background-color,border-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled
            ? "border-b border-white/[0.07] bg-[#080909]/72 backdrop-blur-2xl"
            : "border-b border-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-[var(--nav-h)] w-full max-w-[1440px] items-center gap-3 px-5 sm:gap-4 sm:px-7 lg:px-10"
        >
          {/* Left — identity */}
          <Link
            href="/"
            aria-label="FIRM — home"
            className={cn(
              "focus-ring -m-1 shrink-0 rounded-lg p-1 transition-colors duration-500",
              ground === "light" ? "text-ink" : "text-gallery",
            )}
          >
            <FirmLockup
              descriptor="Autonomous Capital"
              descriptorClassName="hidden sm:block"
              size="md"
            />
          </Link>

          {/* Center — routes */}
          <div className="mx-auto hidden items-center gap-0.5 md:flex">
            {ROUTES.map((r) => {
              const active = isActive(r.href);
              return (
                <Link
                  key={r.href}
                  href={r.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "focus-ring relative rounded-[9px] px-3.5 py-2 text-[13.5px] tracking-[-0.01em] transition-colors duration-300",
                    ground === "light"
                      ? active
                        ? "text-ink"
                        : "text-ink/55 hover:text-ink"
                      : active
                        ? "text-gallery"
                        : "text-mist hover:text-gallery",
                  )}
                >
                  {r.label}
                  {active && (
                    <span
                      aria-hidden
                      className={cn(
                        "animate-rise absolute inset-x-2.5 -bottom-[1px] h-[1.5px] rounded-full",
                        ground === "light" ? "bg-ink/70" : "bg-lime",
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right — network + wallet */}
          <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
            <NetworkIndicator ground={ground} />
            <span className="hidden sm:inline-flex lg:hidden">
              <NetworkDot ground={ground} />
            </span>
            <ConnectControl ground={ground} />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              className={cn(
                "focus-ring grid size-9 place-items-center rounded-full border transition-colors md:hidden",
                ground === "light"
                  ? "border-ink/12 bg-white/55 text-ink"
                  : "border-white/[0.1] bg-white/[0.04] text-gallery",
              )}
            >
              <span aria-hidden className="flex flex-col items-center gap-[4px]">
                <span className="block h-px w-[15px] bg-current" />
                <span className="block h-px w-[15px] bg-current" />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const isActive = useActive();
  const { tone, sub } = useNetworkTone();
  const [present, setPresent] = React.useState(open);
  useBodyScrollLock(present);

  // CSS-driven enter and exit: the sheet must never be left mounted at full
  // opacity if animation frames are throttled, so removal runs on a timer.
  useChangeEffect(open, (isOpen) => {
    if (isOpen) setPresent(true);
  });

  React.useEffect(() => {
    if (open || !present) return;
    const id = window.setTimeout(() => setPresent(false), 240);
    return () => window.clearTimeout(id);
  }, [open, present]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!present) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[110] md:hidden",
        open ? "dlg-scrim-in" : "dlg-scrim-out",
      )}
      aria-hidden={!open}
    >
      <div className="grain absolute inset-0 bg-[#080909]/97 backdrop-blur-2xl" />
      <div
        className="relative flex h-full flex-col px-5 pb-8 pt-0"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        <div className="flex h-[var(--nav-h)] items-center justify-between">
          <FirmLockup descriptor="Autonomous Capital" className="text-gallery" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="focus-ring grid size-9 place-items-center rounded-full border border-white/[0.1] bg-white/[0.04] text-gallery"
          >
            <span aria-hidden className="relative block size-3.5">
              <span className="absolute left-0 top-1/2 block h-px w-full rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 block h-px w-full -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <nav aria-label="Mobile" className="mt-8 flex-1">
          <ul>
            {ROUTES.map((r, i) => {
              const active = isActive(r.href);
              return (
                <li
                  key={r.href}
                  className="animate-rise border-b border-white/[0.06]"
                  style={{ animationDelay: `${0.05 + i * 0.045}s` }}
                >
                  <Link
                    href={r.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className="focus-ring flex items-center justify-between py-5"
                  >
                    <span
                      className={cn(
                        "display-tight text-[30px]",
                        active ? "text-gallery" : "text-titanium",
                      )}
                    >
                      {r.label}
                    </span>
                    {active && (
                      <span aria-hidden className="size-1.5 rounded-full bg-lime" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          className="glass-quiet animate-rise mt-6 rounded-[14px] px-4 py-4"
          style={{ animationDelay: "0.28s" }}
        >
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className={cn(
                "relative size-[6px] rounded-full",
                tone === "live"
                  ? "pulse-dot bg-active text-active"
                  : tone === "wrong" || tone === "reconnecting"
                    ? "bg-amber"
                    : "bg-slate",
              )}
            />
            <span className="text-[13px] text-gallery">Robinhood Chain</span>
            <span className="label-sm ml-auto text-mist">{sub}</span>
          </div>
          <div className="mt-4">
            <ConnectControl className="w-full justify-center" />
          </div>
        </div>
      </div>
    </div>
  );
}
