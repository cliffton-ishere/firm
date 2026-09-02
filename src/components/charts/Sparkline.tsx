import { cn } from "@/lib/cn";

/**
 * Lightweight inline sparkline. Pure SVG — no chart library on card grids,
 * so a wall of nine firm cards stays cheap to render.
 */
export function Sparkline({
  values,
  className,
  width = 120,
  height = 34,
  positive,
  id,
}: {
  values: number[];
  className?: string;
  width?: number;
  height?: number;
  positive?: boolean;
  id: string;
}) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = width / (values.length - 1);
  const y = (v: number) => height - 2 - ((v - min) / span) * (height - 4);

  const up = positive ?? values[values.length - 1] >= values[0];
  const stroke = up ? "var(--color-lime)" : "var(--color-coral)";

  const line = values
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i * stepX).toFixed(2)},${y(v).toFixed(2)}`)
    .join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const gid = `spark-${id}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
      className={cn("block", className)}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.2" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
