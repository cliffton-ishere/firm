import { cn } from "@/lib/cn";

const TONES = [
  "#B8BDB9",
  "#C7FF4A",
  "#7DFF86",
  "#FFB547",
  "#FF7168",
  "#8FB6FF",
  "#E8EAE4",
];

/**
 * Deterministic address avatar. Built from the address bytes: two arc bands and
 * a facet, drawn on brushed ceramic. On-brand tones only — no rainbow blockies.
 */
export function AddressAvatar({
  address,
  className,
}: {
  address?: string;
  className?: string;
}) {
  const hex = (address ?? "0x0").replace(/^0x/, "").padEnd(12, "0");
  const n = (i: number) => parseInt(hex.slice(i * 2, i * 2 + 2) || "0", 16);

  const a = TONES[n(0) % TONES.length];
  const b = TONES[(n(1) + 3) % TONES.length];
  const rot = n(2) * 1.41;
  const arc1 = 40 + (n(3) % 140);
  const arc2 = 40 + (n(4) % 120);
  const r1 = 9 + (n(5) % 4);

  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-full border border-white/12 bg-[#101312]",
        className,
      )}
    >
      <svg viewBox="0 0 32 32" aria-hidden className="size-full">
        <defs>
          <linearGradient id={`av-${hex.slice(0, 6)}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a1e1c" />
            <stop offset="100%" stopColor="#0b0d0c" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" fill={`url(#av-${hex.slice(0, 6)})`} />
        <g transform={`rotate(${rot} 16 16)`} fill="none" strokeLinecap="round">
          <circle
            cx="16"
            cy="16"
            r={r1}
            stroke={a}
            strokeWidth="2.4"
            strokeDasharray={`${arc1} 400`}
            opacity="0.9"
          />
          <circle
            cx="16"
            cy="16"
            r={r1 - 4.5}
            stroke={b}
            strokeWidth="2"
            strokeDasharray={`${arc2} 400`}
            opacity="0.75"
          />
        </g>
        <circle cx="16" cy="16" r="1.4" fill={a} opacity="0.9" />
      </svg>
    </span>
  );
}
