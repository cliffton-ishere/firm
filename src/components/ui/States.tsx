"use client";

import { AlertTriangle, SearchX } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "sweep rounded-[10px] border border-white/[0.05] bg-white/[0.025]",
        className,
      )}
    />
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "sweep relative overflow-hidden rounded-[14px] border border-white/[0.06] bg-white/[0.02]",
        className,
      )}
      role="status"
      aria-label="Loading chart"
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-25"
        preserveAspectRatio="none"
        viewBox="0 0 100 40"
        aria-hidden
      >
        <path
          d="M0 30 L14 26 L26 29 L38 20 L52 24 L66 14 L80 17 L100 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          className="text-titanium"
        />
      </svg>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
  className,
}: {
  title: string;
  body: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[16px] border border-dashed border-white/10 px-6 py-16 text-center",
        className,
      )}
    >
      <SearchX className="size-5 text-slate" strokeWidth={1.4} />
      <p className="mt-4 text-[15px] font-medium tracking-[-0.02em] text-gallery">
        {title}
      </p>
      <p className="mt-2 max-w-[38ch] text-[13px] leading-relaxed text-mist">
        {body}
      </p>
      {action && (
        <Button size="sm" variant="outline" className="mt-5" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title,
  body,
  onRetry,
  className,
}: {
  title: string;
  body: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-[12px] border border-amber/20 bg-amber/[0.05] px-4 py-3.5",
        className,
      )}
    >
      <AlertTriangle
        className="mt-[1px] size-4 shrink-0 text-amber"
        strokeWidth={1.6}
      />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium tracking-[-0.01em] text-gallery">
          {title}
        </p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-mist">{body}</p>
      </div>
      {onRetry && (
        <Button size="sm" variant="ghost" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
