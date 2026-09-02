"use client";

import * as React from "react";
import { useMounted, usePrefersReducedMotion } from "@/lib/hooks";

function parse(v: string) {
  const [m, s] = v.split(":").map(Number);
  return (m || 0) * 60 + (s || 0);
}

function render(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Counts down to the firm's next scheduled review, then rolls to the next
 * cycle. Starts only after mount so the server and client agree.
 */
export function Countdown({
  from,
  cycleSeconds = 900,
  className,
}: {
  from: string;
  cycleSeconds?: number;
  className?: string;
}) {
  const initial = React.useMemo(() => parse(from), [from]);
  const [left, setLeft] = React.useState(initial);
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setLeft((v) => (v <= 1 ? cycleSeconds : v - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [cycleSeconds, reduced]);

  return (
    <span className={className} suppressHydrationWarning>
      {mounted ? render(left) : from}
    </span>
  );
}
