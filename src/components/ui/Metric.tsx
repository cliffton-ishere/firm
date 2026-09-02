import { cn } from "@/lib/cn";
import { InfoDot } from "./Tooltip";

export function Metric({
  label,
  value,
  sub,
  info,
  align = "left",
  size = "md",
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  info?: React.ReactNode;
  align?: "left" | "right";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-0",
        align === "right" ? "text-right" : "text-left",
        className,
      )}
    >
      <div
        className={cn(
          "label flex items-center gap-1.5 text-slate",
          align === "right" && "justify-end",
        )}
      >
        <span className="truncate">{label}</span>
        {info && <InfoDot content={info} />}
      </div>
      <div
        className={cn(
          "num mt-2 font-medium text-gallery",
          size === "sm" && "text-[15px]",
          size === "md" && "text-[20px] tracking-[-0.02em]",
          size === "lg" && "text-[30px] tracking-[-0.03em]",
        )}
      >
        {value}
      </div>
      {sub && (
        <div className="mt-1.5 text-[11.5px] leading-snug text-mist">{sub}</div>
      )}
    </div>
  );
}

/** A hairline-separated row of metrics — no card frames, gallery spacing. */
export function MetricRow({
  children,
  className,
  columns = 4,
}: {
  children: React.ReactNode;
  className?: string;
  columns?: 3 | 4 | 5 | 6;
}) {
  return (
    <div
      className={cn(
        "grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.06]",
        columns === 3 && "grid-cols-2 sm:grid-cols-3",
        columns === 4 && "grid-cols-2 lg:grid-cols-4",
        columns === 5 && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
        columns === 6 && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
        "rounded-[14px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MetricCell({
  label,
  value,
  sub,
  info,
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  info?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-[#0b0d0c] p-4 sm:p-5", className)}>
      <Metric label={label} value={value} sub={sub} info={info} />
    </div>
  );
}
