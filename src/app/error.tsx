"use client";

import { Container } from "@/components/chrome/Layout";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="flex min-h-[70svh] flex-col justify-center pb-24 pt-[calc(var(--nav-h)+80px)]">
      <div className="max-w-[52ch]">
        <p className="label text-amber">Interface error</p>
        <h1 className="display mt-6 text-[clamp(2rem,4.4vw,3.2rem)] text-gallery">
          This view stopped responding.
        </h1>
        <p className="mt-5 text-[14.5px] leading-relaxed text-mist">
          Nothing was submitted and no funds were touched. Reloading this section
          usually restores it. If it keeps happening, the network read may be
          unavailable.
        </p>
        {error.digest && (
          <p className="mono mt-4 text-[11.5px] text-slate">
            Reference {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="primary" size="lg" onClick={reset}>
            Try again
          </Button>
          <ButtonLink href="/" variant="outline" size="lg">
            Back to the market
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
