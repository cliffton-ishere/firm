export function truncateAddress(a?: string, lead = 6, tail = 4) {
  if (!a) return "";
  if (a.length <= lead + tail + 2) return a;
  return `${a.slice(0, lead)}…${a.slice(-tail)}`;
}

export function formatUsd(n: number, opts: { compact?: boolean } = {}) {
  if (opts.compact) {
    if (Math.abs(n) >= 1_000_000)
      return `$${(n / 1_000_000).toFixed(2)}M`;
    if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  }
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function formatUsdg(n: number, opts: { compact?: boolean } = {}) {
  if (opts.compact) {
    if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M USDG`;
    if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}K USDG`;
  }
  return `${n.toLocaleString("en-US", { maximumFractionDigits: 0 })} USDG`;
}

/** Signed percentage. Uses a true minus sign, never a hyphen. */
export function formatPct(n: number, digits = 2) {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${Math.abs(n).toFixed(digits)}%`;
}

export function formatPlainPct(n: number, digits = 1) {
  return `${n.toFixed(digits)}%`;
}

export function formatNumber(n: number, digits = 2) {
  return n.toFixed(digits);
}

/** Relative time from a fixed offset in minutes. Deterministic. */
export function relativeTime(minutesAgo: number) {
  if (minutesAgo < 1) return "just now";
  if (minutesAgo < 60) return `${Math.round(minutesAgo)}m ago`;
  const h = minutesAgo / 60;
  if (h < 24) return `${Math.round(h)}h ago`;
  const d = h / 24;
  if (d < 30) return `${Math.round(d)}d ago`;
  return `${Math.round(d / 30)}mo ago`;
}

export function formatBlock(n: bigint | number | null | undefined) {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString("en-US");
}

/** Trim a decimal string to a sensible number of significant places. */
export function trimDecimal(value: string, max = 4) {
  if (!value.includes(".")) return value;
  const [int, frac] = value.split(".");
  const trimmed = frac.slice(0, max).replace(/0+$/, "");
  return trimmed ? `${int}.${trimmed}` : int;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export const CHANGE_TONE = (n: number) =>
  n > 0 ? "positive" : n < 0 ? "negative" : "flat";
