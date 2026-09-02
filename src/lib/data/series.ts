import type { Firm, PerformancePoint } from "@/lib/types";
import { BENCHMARK } from "./firms";

/* ============================================================
   Deterministic performance series.

   Series are generated from a seeded PRNG and then affine-fitted
   so the final point equals the firm's published return for that
   range. The same firm therefore produces the same curve on every
   render, on the server and in the browser, on every page.
   ============================================================ */

export type Range = "24H" | "7D" | "30D" | "90D" | "ALL";

export const RANGES: Range[] = ["24H", "7D", "30D", "90D", "ALL"];

/** Fixed reference clock so server and client agree. */
export const REFERENCE_EPOCH = Date.UTC(2026, 8, 1, 0, 0, 0);

const RANGE_SPEC: Record<Range, { points: number; spanMs: number }> = {
  "24H": { points: 24, spanMs: 24 * 3_600_000 },
  "7D": { points: 56, spanMs: 7 * 86_400_000 },
  "30D": { points: 60, spanMs: 30 * 86_400_000 },
  "90D": { points: 90, spanMs: 90 * 86_400_000 },
  ALL: { points: 120, spanMs: 210 * 86_400_000 },
};

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The published return for a firm over a range. Single source of truth. */
export function returnFor(firm: Firm, range: Range): number {
  switch (range) {
    case "24H":
      return firm.return24h;
    case "7D":
      return firm.return7d;
    case "30D":
      return firm.return30d;
    case "90D":
      return round2(firm.return30d + (firm.returnAll - firm.return30d) * 0.62);
    case "ALL":
      return firm.returnAll;
  }
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/** Random walk, affine-fitted so walk[0] = 0 and walk[n-1] = target. */
function walk(seed: number, points: number, target: number, vol: number) {
  const rand = mulberry32(seed);
  const raw: number[] = [0];
  let acc = 0;
  for (let i = 1; i < points; i++) {
    // Two samples for a softer, more market-like step distribution.
    const step = (rand() + rand() - 1) * vol;
    // Mild momentum keeps the curve from looking like static noise.
    acc = acc * 0.94 + step;
    raw.push(raw[i - 1] + acc * 0.34);
  }
  const drift = raw[points - 1];
  return raw.map((v, i) => {
    const t = i / (points - 1);
    // Remove the walk's own drift, then lay the target trend on top.
    return round2(v - drift * t + target * t);
  });
}

const cache = new Map<string, PerformancePoint[]>();

export function seriesFor(firm: Firm, range: Range): PerformancePoint[] {
  const key = `${firm.slug}:${range}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const { points, spanMs } = RANGE_SPEC[range];
  const scale =
    range === "24H" ? 0.14 : range === "7D" ? 0.34 : range === "30D" ? 0.7 : 1;
  const vol = (firm.volatility / 14) * scale;

  const f = walk(hash(key), points, returnFor(firm, range), vol);
  const b =
    firm.slug === BENCHMARK.slug
      ? f
      : walk(
          hash(`${BENCHMARK.slug}:${range}`),
          points,
          returnFor(BENCHMARK, range),
          (BENCHMARK.volatility / 14) * scale,
        );

  const step = spanMs / (points - 1);
  const start = REFERENCE_EPOCH - spanMs;

  const out: PerformancePoint[] = f.map((v, i) => ({
    t: start + i * step,
    v,
    b: b[i] ?? 0,
  }));

  cache.set(key, out);
  return out;
}

/** Compact sparkline values for firm cards — 30D shape, no benchmark. */
export function sparkFor(firm: Firm): number[] {
  return seriesFor(firm, "30D")
    .filter((_, i) => i % 2 === 0)
    .map((p) => p.v);
}

export function formatRangeTick(t: number, range: Range) {
  const d = new Date(t);
  if (range === "24H") {
    return `${String(d.getUTCHours()).padStart(2, "0")}:00`;
  }
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
