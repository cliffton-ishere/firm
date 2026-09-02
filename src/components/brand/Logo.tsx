import { cn } from "@/lib/cn";

/**
 * FIRM mark.
 *
 * A single folded ribbon describes an abstract uppercase "F". The upper
 * terminal divides into three precise paths — a primary agent coordinating
 * its specialists. Geometry only; it holds together at favicon size.
 */
export function FirmMark({
  className,
  accent = false,
  title,
}: {
  className?: string;
  /** Renders the third path in signal lime. Reserved for hero presentation. */
  accent?: boolean;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn("shrink-0", className)}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* Stem and top arm — one continuous fold */}
        <path d="M8.6 28V4h9.2" strokeWidth="3" />
        {/* Middle arm */}
        <path d="M8.6 15.6h10.2" strokeWidth="3" />
        {/* Divided upper terminal — the primary path and two specialists */}
        <path d="M17.8 4h6.6" strokeWidth="3" />
        <path d="M17.8 4l5.9-2.3" strokeWidth="2.3" opacity="0.55" />
      </g>
      <path
        d="M17.8 4l5.9 2.3"
        stroke={accent ? "var(--color-lime)" : "currentColor"}
        strokeWidth="2.3"
        strokeLinecap="round"
        opacity={accent ? 1 : 0.55}
      />
    </svg>
  );
}

/** Horizontal lockup: mark + tracked wordmark, with an optional descriptor. */
export function FirmLockup({
  className,
  markClassName,
  descriptor,
  descriptorClassName,
  accent = false,
  size = "md",
}: {
  className?: string;
  markClassName?: string;
  descriptor?: string;
  /** Lets a caller drop the descriptor at narrow widths. */
  descriptorClassName?: string;
  accent?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dims =
    size === "sm"
      ? { mark: "size-[18px]", word: "text-[14px] tracking-[0.16em]" }
      : size === "lg"
        ? { mark: "size-[30px]", word: "text-[24px] tracking-[0.15em]" }
        : { mark: "size-[22px]", word: "text-[17px] tracking-[0.16em]" };

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <FirmMark className={cn(dims.mark, markClassName)} accent={accent} />
      <span className="inline-flex flex-col justify-center">
        <span
          className={cn(
            "font-medium leading-none text-current",
            dims.word,
          )}
        >
          FIRM
        </span>
        {descriptor && (
          <span
            className={cn(
              "label-sm mt-[5px] leading-none text-mist",
              descriptorClassName,
            )}
          >
            {descriptor}
          </span>
        )}
      </span>
    </span>
  );
}
