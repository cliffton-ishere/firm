import { cn } from "@/lib/cn";
import { formatPct } from "@/lib/format";
import type { FirmActivityState, RiskClass } from "@/lib/types";

/* ---------------- Chip ---------------- */

export function Chip({
  children,
  className,
  tone = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "signal" | "quiet";
}) {
  return (
    <span
      className={cn(
        "label inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
        tone === "signal" &&
          "border-lime/25 bg-lime/[0.08] text-lime",
        tone === "neutral" && "border-white/10 bg-white/[0.04] text-titanium",
        tone === "quiet" && "border-white/[0.07] bg-transparent text-mist",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------------- Risk ---------------- */

const RISK_STYLE: Record<RiskClass, { dot: string; text: string; bars: number }> = {
  Conservative: { dot: "bg-[#7fb0ff]", text: "text-[#a9c8ff]", bars: 1 },
  Balanced: { dot: "bg-gallery", text: "text-gallery", bars: 2 },
  Aggressive: { dot: "bg-amber", text: "text-amber", bars: 3 },
  Benchmark: { dot: "bg-mist", text: "text-mist", bars: 0 },
};

export function RiskBadge({
  risk,
  className,
  showBars = true,
}: {
  risk: RiskClass;
  className?: string;
  showBars?: boolean;
}) {
  const s = RISK_STYLE[risk];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[11.5px] tracking-[-0.01em]",
        s.text,
        className,
      )}
    >
      {showBars && (
        <span className="flex items-end gap-[2px]" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "w-[2.5px] rounded-[1px] transition-colors",
                i === 0 && "h-[5px]",
                i === 1 && "h-[8px]",
                i === 2 && "h-[11px]",
                i < s.bars ? s.dot : "bg-white/12",
              )}
            />
          ))}
        </span>
      )}
      {risk}
    </span>
  );
}

/* ---------------- Firm activity state ---------------- */

const STATE_TONE: Record<FirmActivityState, string> = {
  Observing: "text-mist",
  Evaluating: "text-lime",
  Simulating: "text-lime",
  Rebalancing: "text-amber",
  Tracking: "text-titanium",
  Reviewing: "text-active",
};

export function StateBadge({
  label,
  kind,
  className,
  compact = false,
}: {
  label: string;
  kind: FirmActivityState;
  className?: string;
  compact?: boolean;
}) {
  const live = kind === "Evaluating" || kind === "Simulating";
  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-2",
        compact ? "text-[11.5px]" : "text-[12.5px]",
        STATE_TONE[kind],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "relative size-[5px] shrink-0 rounded-full bg-current",
          live && "pulse-dot",
        )}
      />
      <span className="truncate tracking-[-0.01em]">{label}</span>
    </span>
  );
}

/* ---------------- Signed delta ---------------- */

export function Delta({
  value,
  digits = 2,
  className,
  size = "md",
  showGlyph = true,
}: {
  value: number;
  digits?: number;
  className?: string;
  size?: "sm" | "md" | "base" | "lg" | "xl";
  showGlyph?: boolean;
}) {
  const positive = value > 0;
  const flat = value === 0;
  return (
    <span
      className={cn(
        "num inline-flex items-baseline gap-1 font-medium",
        size === "sm" && "text-[12px]",
        size === "md" && "text-[14px]",
        size === "base" && "text-[18px] tracking-[-0.02em]",
        size === "lg" && "text-[20px]",
        size === "xl" && "text-[30px] tracking-[-0.03em]",
        flat ? "text-titanium" : positive ? "text-active" : "text-coral",
        className,
      )}
    >
      {showGlyph && !flat && (
        <span
          aria-hidden
          className={cn(
            "translate-y-[-1px]",
            size === "xl" ? "text-[13px]" : "text-[9px]",
          )}
        >
          {positive ? "▲" : "▼"}
        </span>
      )}
      {formatPct(value, digits)}
    </span>
  );
}

/* ---------------- Mandate / simulation verdicts ---------------- */

export function Verdict({
  value,
  className,
}: {
  value: "Passed" | "Modified" | "Blocked" | "Queued" | "Rejected";
  className?: string;
}) {
  const tone =
    value === "Passed"
      ? "text-active border-active/25 bg-active/[0.07]"
      : value === "Modified"
        ? "text-amber border-amber/25 bg-amber/[0.07]"
        : value === "Queued"
          ? "text-titanium border-white/12 bg-white/[0.04]"
          : "text-coral border-coral/25 bg-coral/[0.07]";
  const glyph =
    value === "Passed"
      ? "✓"
      : value === "Modified"
        ? "±"
        : value === "Queued"
          ? "•"
          : "✕";
  return (
    <span
      className={cn(
        "label inline-flex items-center gap-1.5 rounded-md border px-2 py-1",
        tone,
        className,
      )}
    >
      <span aria-hidden className="text-[10px] leading-none">
        {glyph}
      </span>
      {value}
    </span>
  );
}
