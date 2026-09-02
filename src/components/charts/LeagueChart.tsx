"use client";

import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FIRMS } from "@/lib/data/firms";
import { formatRangeTick, seriesFor, type Range } from "@/lib/data/series";
import { formatPct } from "@/lib/format";

interface Row {
  t: number;
  [slug: string]: number;
}

interface TooltipItem {
  dataKey?: string | number;
  value?: number;
  payload?: Row;
}

/**
 * All nine firms on one axis. Colour is not used to identify firms — the
 * focused firm is drawn in signal lime and the rest recede to titanium.
 */
function LeagueChartInner({
  range,
  focus,
  height = 340,
}: {
  range: Range;
  focus: string | null;
  height?: number;
}) {
  const data = React.useMemo<Row[]>(() => {
    const base = seriesFor(FIRMS[0], range);
    return base.map((p, i) => {
      const row: Row = { t: p.t };
      for (const f of FIRMS) row[f.slug] = seriesFor(f, range)[i]?.v ?? 0;
      return row;
    });
  }, [range]);

  const [firstReveal, setFirstReveal] = React.useState(true);
  React.useEffect(() => {
    const id = window.setTimeout(() => setFirstReveal(false), 1400);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 10, bottom: 0, left: 0 }}>
          <CartesianGrid
            stroke="rgba(255,255,255,0.045)"
            strokeDasharray="0"
            vertical={false}
          />
          <XAxis
            dataKey="t"
            type="number"
            domain={["dataMin", "dataMax"]}
            axisLine={false}
            tickLine={false}
            minTickGap={52}
            tick={{ fill: "#5d635f", fontSize: 10.5 }}
            tickFormatter={(t: number) => formatRangeTick(t, range)}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={48}
            tick={{ fill: "#5d635f", fontSize: 10.5 }}
            tickFormatter={(v: number) => `${v > 0 ? "+" : ""}${v.toFixed(0)}%`}
          />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.12)" strokeDasharray="3 4" />
          <Tooltip
            cursor={{ stroke: "rgba(255,255,255,0.18)", strokeWidth: 1 }}
            content={<LeagueTooltip range={range} focus={focus} />}
          />

          {FIRMS.map((f) => {
            const isFocus = focus === f.slug;
            const dim = focus !== null && !isFocus;
            return (
              <Line
                key={f.slug}
                type="monotone"
                dataKey={f.slug}
                stroke={isFocus ? "var(--color-lime)" : "var(--color-titanium)"}
                strokeWidth={isFocus ? 2 : 1}
                strokeOpacity={isFocus ? 1 : dim ? 0.14 : 0.42}
                dot={false}
                activeDot={isFocus ? { r: 3.5, fill: "var(--color-lime)" } : false}
                isAnimationActive={firstReveal}
                animationDuration={1000}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function LeagueTooltip({
  active,
  payload,
  range,
  focus,
}: {
  active?: boolean;
  payload?: TooltipItem[];
  range?: Range;
  focus?: string | null;
}) {
  if (!active || !payload?.length || !range) return null;
  const row = payload[0]?.payload;
  if (!row) return null;

  const ranked = FIRMS.map((f) => ({ f, v: row[f.slug] ?? 0 })).sort(
    (a, b) => b.v - a.v,
  );
  const shown = focus
    ? ranked.filter((r) => r.f.slug === focus)
    : ranked.slice(0, 5);

  return (
    <div className="min-w-[196px] rounded-[10px] border border-white/12 bg-[#0c0f0e]/96 px-3 py-2.5 backdrop-blur-xl shadow-[0_20px_44px_-24px_rgba(0,0,0,0.95)]">
      <div className="label mb-2 text-slate">{formatRangeTick(row.t, range)}</div>
      <ul className="space-y-1.5">
        {shown.map(({ f, v }) => (
          <li key={f.slug} className="flex items-center gap-2.5">
            <span className="truncate text-[11.5px] text-mist">{f.name}</span>
            <span className="num ml-auto text-[12px] font-medium text-gallery">
              {formatPct(v)}
            </span>
          </li>
        ))}
      </ul>
      {!focus && (
        <p className="mt-2 border-t border-white/[0.07] pt-2 text-[10.5px] text-slate">
          Top five shown. Select a firm to isolate it.
        </p>
      )}
    </div>
  );
}

export const LeagueChart = React.memo(LeagueChartInner);
export default LeagueChart;
