"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatPct } from "@/lib/format";
import { formatRangeTick, seriesFor, type Range } from "@/lib/data/series";
import type { Firm } from "@/lib/types";

interface Props {
  firm: Firm;
  range: Range;
  compare?: boolean;
  height?: number;
  /** Compact chart used inside dense layouts. */
  minimal?: boolean;
}

interface TooltipPayloadItem {
  dataKey?: string | number;
  value?: number;
  payload?: { t: number; v: number; b: number };
}

function ChartTooltip({
  active,
  payload,
  range,
  compare,
  firmName,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  range: Range;
  compare: boolean;
  firmName: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="rounded-[10px] border border-white/12 bg-[#0c0f0e]/96 px-3 py-2.5 backdrop-blur-xl shadow-[0_20px_44px_-24px_rgba(0,0,0,0.95)]">
      <div className="label mb-2 text-slate">
        {formatRangeTick(point.t, range)}
      </div>
      <div className="flex items-center gap-2.5">
        <span aria-hidden className="size-[6px] rounded-full bg-lime" />
        <span className="text-[11.5px] text-mist">{firmName}</span>
        <span className="num ml-auto text-[12.5px] font-medium text-gallery">
          {formatPct(point.v)}
        </span>
      </div>
      {compare && (
        <div className="mt-1.5 flex items-center gap-2.5">
          <span aria-hidden className="h-px w-[6px] bg-titanium" />
          <span className="text-[11.5px] text-mist">BENCHMARK-01</span>
          <span className="num ml-auto text-[12.5px] text-titanium">
            {formatPct(point.b)}
          </span>
        </div>
      )}
    </div>
  );
}

function PerformanceChartInner({
  firm,
  range,
  compare = false,
  height = 300,
  minimal = false,
}: Props) {
  const data = React.useMemo(() => seriesFor(firm, range), [firm, range]);
  const gradientId = React.useId().replace(/:/g, "");

  // Animate the first reveal only. Range switches redraw instantly.
  const [firstReveal, setFirstReveal] = React.useState(true);
  React.useEffect(() => {
    const id = window.setTimeout(() => setFirstReveal(false), 1200);
    return () => window.clearTimeout(id);
  }, []);

  const last = data[data.length - 1]?.v ?? 0;
  const positive = last >= 0;
  const stroke = positive ? "var(--color-lime)" : "var(--color-coral)";

  const values = data.flatMap((d) => (compare ? [d.v, d.b] : [d.v]));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = Math.max((max - min) * 0.18, 0.4);

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: minimal ? 4 : 8, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.22} />
              <stop offset="62%" stopColor={stroke} stopOpacity={0.05} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>

          {!minimal && (
            <CartesianGrid
              stroke="rgba(255,255,255,0.045)"
              strokeDasharray="0"
              vertical={false}
            />
          )}

          <XAxis
            dataKey="t"
            type="number"
            domain={["dataMin", "dataMax"]}
            axisLine={false}
            tickLine={false}
            minTickGap={48}
            tick={{ fill: "#5d635f", fontSize: 10.5 }}
            tickFormatter={(t: number) => formatRangeTick(t, range)}
            hide={minimal}
          />
          <YAxis
            domain={[min - pad, max + pad]}
            axisLine={false}
            tickLine={false}
            width={minimal ? 0 : 48}
            tick={{ fill: "#5d635f", fontSize: 10.5 }}
            tickFormatter={(v: number) => `${v > 0 ? "+" : ""}${v.toFixed(0)}%`}
            hide={minimal}
          />

          <ReferenceLine y={0} stroke="rgba(255,255,255,0.12)" strokeDasharray="3 4" />

          <Tooltip
            cursor={{ stroke: "rgba(255,255,255,0.18)", strokeWidth: 1 }}
            content={
              <ChartTooltip
                range={range}
                compare={compare}
                firmName={firm.name}
              />
            }
          />

          {compare && (
            <Line
              type="monotone"
              dataKey="b"
              stroke="var(--color-titanium)"
              strokeWidth={1.25}
              strokeDasharray="4 4"
              dot={false}
              activeDot={false}
              isAnimationActive={firstReveal}
              animationDuration={900}
            />
          )}

          <Area
            type="monotone"
            dataKey="v"
            stroke={stroke}
            strokeWidth={1.75}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{
              r: 3.5,
              fill: stroke,
              stroke: "#080909",
              strokeWidth: 2,
            }}
            isAnimationActive={firstReveal}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export const PerformanceChart = React.memo(PerformanceChartInner);
export default PerformanceChart;
