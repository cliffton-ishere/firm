import { cn } from "@/lib/cn";

/**
 * Agent sigil.
 *
 * Every firm and specialist agent gets a deterministic abstract mark derived
 * from its identifier. Firms are distinguished by geometry rather than colour,
 * so a wall of sigils stays quiet.
 */

function seedOf(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function Sigil({
  id,
  className,
  active = false,
  strokeWidth = 1,
}: {
  id: string;
  className?: string;
  /** Adds a lime accent arc — used when the agent is evaluating. */
  active?: boolean;
  strokeWidth?: number;
}) {
  const s = seedOf(id);
  const ticks = 8 + (s % 7); // 8–14
  const sides = 4 + ((s >> 3) % 3); // 4–6 — a triangle reads as a play glyph
  const rotate = (s >> 7) % 90;
  const innerR = 5.5 + ((s >> 11) % 4) * 0.9;
  const arcStart = (s >> 15) % 360;
  const arcSweep = 55 + ((s >> 19) % 90);
  const hasBar = ((s >> 23) & 1) === 1;

  const poly = Array.from({ length: sides }, (_, i) => {
    const a = ((i / sides) * 360 + rotate) * (Math.PI / 180);
    return `${(16 + Math.cos(a) * innerR).toFixed(2)},${(16 + Math.sin(a) * innerR).toFixed(2)}`;
  }).join(" ");

  const arc = describeArc(16, 16, 12.2, arcStart, arcStart + arcSweep);

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      {/* Outer ring */}
      <circle
        cx="16"
        cy="16"
        r="12.2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity="0.2"
      />
      {/* Radial ticks */}
      <g stroke="currentColor" strokeWidth={strokeWidth} opacity="0.34">
        {Array.from({ length: ticks }, (_, i) => {
          const a = ((i / ticks) * 360 + rotate) * (Math.PI / 180);
          const r1 = 12.9;
          const r2 = 14.4;
          return (
            <line
              key={i}
              x1={(16 + Math.cos(a) * r1).toFixed(2)}
              y1={(16 + Math.sin(a) * r1).toFixed(2)}
              x2={(16 + Math.cos(a) * r2).toFixed(2)}
              y2={(16 + Math.sin(a) * r2).toFixed(2)}
            />
          );
        })}
      </g>
      {/* Accent arc */}
      <path
        d={arc}
        stroke={active ? "var(--color-lime)" : "currentColor"}
        strokeWidth={strokeWidth * 1.6}
        strokeLinecap="round"
        opacity={active ? 0.95 : 0.5}
      />
      {/* Inner structure */}
      <polygon
        points={poly}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity="0.72"
      />
      {hasBar && (
        <line
          x1="16"
          y1={16 - innerR}
          x2="16"
          y2={16 + innerR}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          opacity="0.3"
        />
      )}
      <circle
        cx="16"
        cy="16"
        r="1.5"
        fill={active ? "var(--color-lime)" : "currentColor"}
        opacity={active ? 1 : 0.7}
      />
    </svg>
  );
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  start: number,
  end: number,
) {
  const s = polar(cx, cy, r, end);
  const e = polar(cx, cy, r, start);
  const large = end - start <= 180 ? "0" : "1";
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 0 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}
