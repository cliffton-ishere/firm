"use client";

import { X } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { useBodyScrollLock, useChangeEffect, useMounted } from "@/lib/hooks";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** How long the exit animation runs before the dialog is removed. */
const EXIT_MS = 240;

function useFocusTrap(active: boolean) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!active) return;
    const node = ref.current;
    const previous = document.activeElement as HTMLElement | null;

    const focusFirst = () => {
      const els = node?.querySelectorAll<HTMLElement>(FOCUSABLE);
      (els && els.length ? els[0] : node)?.focus();
    };
    // A timer, not an animation frame: focus must land even when frames are
    // throttled.
    const id = window.setTimeout(focusFirst, 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !node) return;
      const els = Array.from(
        node.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [active]);

  return ref;
}

interface BaseProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Hide the built-in header when the content supplies its own. */
  bareHeader?: boolean;
  description?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

function Shell({
  open,
  onClose,
  title,
  description,
  children,
  className,
  footer,
  bareHeader,
  layout,
}: BaseProps & { layout: "modal" | "sheet" }) {
  const mounted = useMounted();
  const [present, setPresent] = React.useState(open);
  const ref = useFocusTrap(open && present);
  useBodyScrollLock(present);
  const labelId = React.useId();
  const descId = React.useId();

  // Opening mounts immediately; closing keeps the dialog for one exit
  // animation and then removes it on a timer.
  useChangeEffect(open, (isOpen) => {
    if (isOpen) setPresent(true);
  });

  React.useEffect(() => {
    if (open || !present) return;
    const id = window.setTimeout(() => setPresent(false), EXIT_MS);
    return () => window.clearTimeout(id);
  }, [open, present]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !present) return null;

  const isSheet = layout === "sheet";

  return createPortal(
    <div className="fixed inset-0 z-[120]" aria-hidden={!open}>
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/62 backdrop-blur-[3px]",
          open ? "dlg-scrim-in" : "dlg-scrim-out",
        )}
      />
      <div
        className={cn(
          "absolute inset-0 flex",
          isSheet
            ? "justify-end p-0 sm:p-3"
            : "items-end justify-center p-0 sm:items-center sm:p-6",
        )}
      >
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
          aria-describedby={description ? descId : undefined}
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "relative flex w-full flex-col overflow-hidden outline-none",
            "border border-white/12 bg-[#0c0e0d]/92 backdrop-blur-2xl",
            "shadow-[0_1px_0_0_rgba(255,255,255,0.07)_inset,0_40px_120px_-30px_rgba(0,0,0,0.95)]",
            isSheet
              ? "h-full max-h-full sm:max-w-[440px] sm:rounded-[18px]"
              : "max-h-[92dvh] rounded-t-[20px] sm:max-w-[520px] sm:rounded-[18px]",
            isSheet
              ? open
                ? "dlg-sheet-in"
                : "dlg-sheet-out"
              : open
                ? "dlg-modal-in"
                : "dlg-modal-out",
            className,
          )}
        >
          <div
            className={cn(
              "flex items-start justify-between gap-4 px-5 pb-4 pt-5 sm:px-6",
              bareHeader && "sr-only",
            )}
          >
            <div className="min-w-0">
              <h2
                id={labelId}
                className="text-[16px] font-medium tracking-[-0.02em] text-gallery"
              >
                {title}
              </h2>
              {description && (
                <p
                  id={descId}
                  className="mt-1 text-[12.5px] leading-relaxed text-mist"
                >
                  {description}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="focus-ring absolute right-3.5 top-3.5 z-10 grid size-8 place-items-center rounded-full border border-white/10 bg-white/[0.045] text-titanium transition-colors hover:bg-white/10 hover:text-gallery"
          >
            <X className="size-3.5" strokeWidth={1.75} />
          </button>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>

          {footer && (
            <div className="hairline-t bg-black/25 px-5 py-4 sm:px-6">{footer}</div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function Modal(props: BaseProps) {
  return <Shell {...props} layout="modal" />;
}

export function Sheet(props: BaseProps) {
  return <Shell {...props} layout="sheet" />;
}
