"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * The Agent Core.
 *
 * A precision black-glass object: nested autonomous layers, a silver internal
 * structure and a restrained lime pulse travelling the allocation pathways.
 * Built from layered SVG and CSS so it costs almost nothing to record.
 *
 * `tone` adapts the surrounding structure to the ground it sits on — the object
 * itself stays black ceramic in both.
 */

const PATHWAYS = [
  { angle: -90, len: 118, delay: 0 },
  { angle: -34, len: 128, delay: 1.1 },
  { angle: 22, len: 112, delay: 2.2 },
  { angle: 78, len: 126, delay: 3.3 },
  { angle: 146, len: 116, delay: 4.4 },
  { angle: 208, len: 130, delay: 5.5 },
  { angle: 262, len: 108, delay: 6.6 },
];

const TONE = {
  light: {
    ring: "rgba(8,9,9,0.10)",
    tick: "rgba(8,9,9,0.26)",
    arc: "rgba(8,9,9,0.16)",
    arcAccent: "rgba(126,166,40,0.55)",
    path: "rgba(8,9,9,0.13)",
    pulse: "#8fbc2f",
    node: "#8fbc2f",
    ambient:
      "radial-gradient(circle at 50% 52%, rgba(8,9,9,0.10), transparent 58%), radial-gradient(circle at 62% 34%, rgba(199,255,74,0.16), transparent 46%)",
  },
  dark: {
    ring: "rgba(255,255,255,0.08)",
    tick: "rgba(255,255,255,0.20)",
    arc: "rgba(255,255,255,0.14)",
    arcAccent: "rgba(199,255,74,0.24)",
    path: "rgba(255,255,255,0.11)",
    pulse: "var(--color-lime)",
    node: "var(--color-lime)",
    ambient:
      "radial-gradient(circle at 46% 40%, rgba(199,255,74,0.10), transparent 46%), radial-gradient(circle at 58% 62%, rgba(255,255,255,0.10), transparent 52%)",
  },
} as const;

/**
 * Polar helper. Coordinates are rounded to two places so the server and the
 * browser serialise identical markup — raw trig output differs in the last
 * float digit between engines and trips hydration.
 */
function pt(angle: number, r: number, cx = 200, cy = 200) {
  const a = (angle * Math.PI) / 180;
  return {
    x: Math.round((cx + Math.cos(a) * r) * 100) / 100,
    y: Math.round((cy + Math.sin(a) * r) * 100) / 100,
  };
}

export function AgentCore({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const reduced = usePrefersReducedMotion();
  const t = TONE[tone];
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const frame = React.useRef(0);

  React.useEffect(() => {
    if (reduced) return;
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: PointerEvent) => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        setTilt({
          x: Math.max(-1, Math.min(1, nx)),
          y: Math.max(-1, Math.min(1, ny)),
        });
      });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [reduced]);

  const layer = (depth: number): React.CSSProperties => ({
    transform: `translate3d(${(tilt.x * depth).toFixed(2)}px, ${(tilt.y * depth).toFixed(2)}px, 0)`,
    transition: "transform 800ms cubic-bezier(0.16,1,0.3,1)",
    willChange: "transform",
  });

  return (
    <div
      ref={wrapRef}
      className={cn("relative aspect-square w-full select-none", className)}
      aria-hidden
    >
      {/* Ambient light behind the object */}
      <div
        className="pointer-events-none absolute inset-[-14%] rounded-full"
        style={{ background: t.ambient, ...layer(-5) }}
      />

      <div style={layer(4)} className="absolute inset-0">
        <svg viewBox="0 0 400 400" className="size-full overflow-visible">
          <defs>
            {/* Black polished ceramic body */}
            <radialGradient id={`core-body-${tone}`} cx="38%" cy="30%" r="78%">
              <stop offset="0%" stopColor="#333936" />
              <stop offset="30%" stopColor="#151817" />
              <stop offset="70%" stopColor="#0a0c0b" />
              <stop offset="100%" stopColor="#040505" />
            </radialGradient>
            <linearGradient id={`core-spec-${tone}`} x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="26%" stopColor="#ffffff" stopOpacity="0.06" />
              <stop offset="56%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
            </linearGradient>
            <linearGradient id={`core-ti-${tone}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e6e9e4" stopOpacity="0.9" />
              <stop offset="42%" stopColor="#8f9591" stopOpacity="0.42" />
              <stop offset="100%" stopColor="#e6e9e4" stopOpacity="0.72" />
            </linearGradient>
            <radialGradient id={`core-glow-${tone}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c7ff4a" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#c7ff4a" stopOpacity="0.09" />
              <stop offset="100%" stopColor="#c7ff4a" stopOpacity="0" />
            </radialGradient>
            <filter
              id={`core-soft-${tone}`}
              x="-45%"
              y="-45%"
              width="190%"
              height="190%"
            >
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          {/* --- Outer autonomous layer: slow rotating tick ring --- */}
          <g
            style={{
              transformOrigin: "200px 200px",
              animation: reduced ? undefined : "firm-spin 96s linear infinite",
            }}
          >
            <circle
              cx="200"
              cy="200"
              r="176"
              fill="none"
              stroke={t.ring}
              strokeWidth="1"
            />
            {Array.from({ length: 72 }, (_, i) => {
              const major = i % 6 === 0;
              const a = pt(i * 5, 176);
              const b = pt(i * 5, major ? 165 : 171);
              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={t.tick}
                  strokeWidth={major ? 1.2 : 0.8}
                  opacity={major ? 0.9 : 0.45}
                />
              );
            })}
          </g>

          {/* --- Second layer: counter-rotating dashed arcs --- */}
          <g
            style={{
              transformOrigin: "200px 200px",
              animation: reduced ? undefined : "firm-spin-rev 64s linear infinite",
            }}
          >
            <circle
              cx="200"
              cy="200"
              r="150"
              fill="none"
              stroke={t.arc}
              strokeWidth="1"
              strokeDasharray="46 26 8 26"
              strokeLinecap="round"
            />
            <circle
              cx="200"
              cy="200"
              r="138"
              fill="none"
              stroke={t.arcAccent}
              strokeWidth="1.6"
              strokeDasharray="14 300"
              strokeLinecap="round"
            />
          </g>

          {/* --- Allocation pathways --- */}
          <g>
            {PATHWAYS.map((p, i) => {
              const from = pt(p.angle, 62);
              const to = pt(p.angle, p.len);
              const mid = pt(p.angle + 9, (62 + p.len) / 2);
              const d = `M${from.x},${from.y} Q${mid.x},${mid.y} ${to.x},${to.y}`;
              return (
                <g key={i}>
                  <path d={d} fill="none" stroke={t.path} strokeWidth="1" />
                  <path
                    d={d}
                    fill="none"
                    stroke={t.pulse}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeDasharray="18 222"
                    style={{
                      animation: reduced
                        ? undefined
                        : `firm-flow 7.6s cubic-bezier(0.5,0,0.5,1) ${p.delay}s infinite`,
                    }}
                  />
                  <circle
                    cx={to.x}
                    cy={to.y}
                    r="2.4"
                    fill={t.node}
                    opacity="0.25"
                    style={{
                      animation: reduced
                        ? undefined
                        : `firm-node 7.6s ease-in-out ${p.delay}s infinite`,
                    }}
                  />
                </g>
              );
            })}
          </g>

          {/* --- The core body --- */}
          <g
            style={{
              transformOrigin: "200px 200px",
              animation: reduced
                ? undefined
                : "firm-core-breathe 7s cubic-bezier(0.65,0,0.35,1) infinite",
            }}
          >
            <ellipse
              cx="200"
              cy="278"
              rx="76"
              ry="13"
              fill="#000"
              opacity={tone === "light" ? 0.16 : 0.5}
              filter={`url(#core-soft-${tone})`}
            />
            <circle cx="200" cy="200" r="86" fill={`url(#core-body-${tone})`} />
            <circle
              cx="200"
              cy="200"
              r="86"
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
            />
            <circle cx="200" cy="200" r="86" fill={`url(#core-spec-${tone})`} />

            {/* internal silver structure */}
            <g
              stroke={`url(#core-ti-${tone})`}
              fill="none"
              strokeWidth="1"
              style={{
                transformOrigin: "200px 200px",
                animation: reduced ? undefined : "firm-spin 120s linear infinite",
              }}
            >
              <polygon points="200,138 254,169 254,231 200,262 146,231 146,169" />
              <polygon
                points="200,158 237,179 237,221 200,242 163,221 163,179"
                opacity="0.6"
              />
              <line x1="200" y1="138" x2="200" y2="262" opacity="0.4" />
              <line x1="146" y1="169" x2="254" y2="231" opacity="0.4" />
              <line x1="254" y1="169" x2="146" y2="231" opacity="0.4" />
            </g>

            {/* inner light */}
            <circle
              cx="200"
              cy="200"
              r="48"
              fill={`url(#core-glow-${tone})`}
              style={{
                animation: reduced
                  ? undefined
                  : "firm-breathe 4.5s cubic-bezier(0.65,0,0.35,1) infinite",
              }}
            />
            <circle cx="200" cy="200" r="7" fill="var(--color-lime)" opacity="0.92" />
            <circle
              cx="200"
              cy="200"
              r="12"
              fill="none"
              stroke="var(--color-lime)"
              strokeWidth="1"
              opacity="0.3"
            />

            {/* specular highlight */}
            <ellipse
              cx="171"
              cy="164"
              rx="31"
              ry="17"
              fill="#ffffff"
              opacity="0.12"
              transform="rotate(-32 171 164)"
              filter={`url(#core-soft-${tone})`}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
