"use client";

import { Check, ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/cn";

/* ---------------- Text field ---------------- */

export function Field({
  label,
  hint,
  error,
  children,
  className,
  htmlFor,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <label
        htmlFor={htmlFor}
        className="label mb-2.5 flex items-center justify-between gap-3 text-slate"
      >
        <span>{label}</span>
        {hint && <span className="normal-case tracking-normal text-[10.5px] text-slate/80">{hint}</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-2 text-[11.5px] text-coral">
          {error}
        </p>
      )}
    </div>
  );
}

const INPUT_BASE =
  "w-full rounded-[10px] border bg-white/[0.028] px-3.5 text-[13.5px] tracking-[-0.01em] text-gallery outline-none transition-colors duration-200 placeholder:text-slate hover:border-white/16";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(function Input({ className, invalid, ...rest }, ref) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      {...rest}
      className={cn(
        INPUT_BASE,
        "focus-ring h-11",
        invalid ? "border-coral/45" : "border-white/10",
        "disabled:opacity-40",
        className,
      )}
    />
  );
});

export function Textarea({
  className,
  invalid,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      {...rest}
      className={cn(
        INPUT_BASE,
        "focus-ring min-h-[92px] resize-none py-3 leading-relaxed",
        invalid ? "border-coral/45" : "border-white/10",
        className,
      )}
    />
  );
}

/* ---------------- Select ---------------- */

export interface Option {
  value: string;
  label: string;
}

export function Select({
  value,
  onChange,
  options,
  className,
  ariaLabel,
  size = "md",
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  className?: string;
  ariaLabel: string;
  size?: "sm" | "md";
}) {
  return (
    <div className={cn("relative", className)}>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "focus-ring w-full cursor-pointer appearance-none rounded-[10px] border border-white/10 bg-white/[0.028] pl-3.5 pr-9",
          "text-[13px] tracking-[-0.01em] text-gallery outline-none transition-colors hover:border-white/16",
          size === "sm" ? "h-9" : "h-11",
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#101211] text-gallery">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-slate"
        strokeWidth={1.75}
      />
    </div>
  );
}

/* ---------------- Segmented control ---------------- */

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  className,
  size = "md",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  ariaLabel: string;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-[10px] border border-white/[0.08] bg-white/[0.025] p-0.5",
        className,
      )}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "focus-ring relative rounded-[8px] font-medium tracking-[-0.01em] transition-colors duration-200",
              size === "sm" ? "h-7 px-2.5 text-[11.5px]" : "h-8 px-3 text-[12.5px]",
              active
                ? "bg-white/[0.1] text-gallery shadow-[inset_0_1px_0_rgba(255,255,255,0.09)]"
                : "text-mist hover:text-titanium",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Toggle ---------------- */

export function Toggle({
  checked,
  onChange,
  label,
  description,
  className,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "focus-ring group flex w-full items-center justify-between gap-4 rounded-[10px] border border-white/[0.07] bg-white/[0.02] px-3.5 py-3 text-left transition-colors hover:border-white/12",
        className,
      )}
    >
      <span className="min-w-0">
        <span className="block text-[13px] font-medium tracking-[-0.01em] text-gallery">
          {label}
        </span>
        {description && (
          <span className="mt-0.5 block text-[11.5px] leading-relaxed text-mist">
            {description}
          </span>
        )}
      </span>
      <span
        aria-hidden
        className={cn(
          "relative h-[22px] w-[38px] shrink-0 rounded-full border transition-colors duration-250",
          checked
            ? "border-lime/40 bg-lime/70"
            : "border-white/12 bg-white/[0.06]",
        )}
      >
        <span
          className={cn(
            "absolute top-[2px] size-[16px] rounded-full bg-gallery shadow-[0_1px_3px_rgba(0,0,0,0.6)] transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
            checked ? "translate-x-[18px]" : "translate-x-[2px]",
          )}
        />
      </span>
    </button>
  );
}

/* ---------------- Choice cards ---------------- */

export function ChoiceGroup<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  columns = 3,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; description?: string }[];
  ariaLabel: string;
  columns?: 2 | 3;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "grid gap-2",
        columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3",
        className,
      )}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "focus-ring group relative rounded-[12px] border px-3.5 py-3 text-left transition-all duration-250",
              active
                ? "border-lime/35 bg-lime/[0.055]"
                : "border-white/[0.08] bg-white/[0.02] hover:border-white/16 hover:bg-white/[0.035]",
            )}
          >
            <span className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  "text-[13px] font-medium tracking-[-0.01em]",
                  active ? "text-gallery" : "text-titanium",
                )}
              >
                {o.label}
              </span>
              {active && <Check className="size-3.5 text-lime" strokeWidth={2} />}
            </span>
            {o.description && (
              <span className="mt-1 block text-[11.5px] leading-relaxed text-mist">
                {o.description}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Slider ---------------- */

export function Slider({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  format,
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
  format?: (v: number) => string;
  className?: string;
}) {
  const id = React.useId();
  return (
    <div className={cn("min-w-0", className)}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="label text-slate">
          {label}
        </label>
        <span className="num text-[13px] font-medium text-gallery">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="focus-ring w-full"
      />
    </div>
  );
}
