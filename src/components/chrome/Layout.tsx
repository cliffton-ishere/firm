import { cn } from "@/lib/cn";

export function Container({
  children,
  className,
  width = "default",
}: {
  children: React.ReactNode;
  className?: string;
  width?: "default" | "wide" | "narrow";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-7 lg:px-10",
        width === "default" && "max-w-[1440px]",
        width === "wide" && "max-w-[1680px]",
        width === "narrow" && "max-w-[880px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Page header used on every route below the hero-less pages. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  aside,
  className,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "relative overflow-hidden border-b border-white/[0.06]",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(120% 90% at 12% -30%, rgba(199,255,74,0.07), transparent 62%)",
        }}
      />
      <Container className="relative pb-10 pt-[calc(var(--nav-h)+56px)] sm:pb-12 sm:pt-[calc(var(--nav-h)+72px)]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[52ch]">
            <p className="label text-lime">{eyebrow}</p>
            <h1 className="display mt-5 text-[clamp(2.4rem,5.4vw,4rem)] text-gallery">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-5 max-w-[54ch] text-[15px] leading-relaxed text-mist sm:text-[16px]">
                {subtitle}
              </p>
            )}
          </div>
          {aside && <div className="shrink-0">{aside}</div>}
        </div>
      </Container>
    </header>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-[56ch]">
        {eyebrow && <p className="label text-slate">{eyebrow}</p>}
        <h2 className="display-tight mt-3.5 text-[clamp(1.6rem,3vw,2.25rem)] text-gallery">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-[14px] leading-relaxed text-mist">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
