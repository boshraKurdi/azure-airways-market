import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AirlineMark({ code, className }: { code: string; className?: string }) {
  return (
    <span
      className={cn(
        "text-display grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-hairline bg-surface-muted text-xs font-bold tracking-tight text-ink",
        className,
      )}
      aria-hidden
    >
      {code}
    </span>
  );
}

export function StatusBadge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
  children: ReactNode;
}) {
  const tones = {
    neutral: "bg-surface-muted text-ink-soft border-hairline",
    accent: "bg-accent/10 text-accent border-accent/25",
    success: "bg-success/12 text-success border-success/25",
    warning: "bg-warning/15 text-warning-foreground border-warning/35",
    danger: "bg-destructive/10 text-destructive border-destructive/25",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function Price({
  value,
  currency = "USD",
  size = "md",
  suffix,
}: {
  value: number;
  currency?: string;
  size?: "sm" | "md" | "lg";
  suffix?: string;
}) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

  return (
    <span className="flex flex-col items-end leading-none">
      <span
        className={cn(
          "text-display tabular font-semibold text-price",
          size === "lg" ? "text-3xl sm:text-4xl" : size === "md" ? "text-2xl" : "text-lg",
        )}
      >
        {formatted}
      </span>
      {suffix && (
        <span className="mt-1.5 text-[11px] font-medium text-muted-foreground">{suffix}</span>
      )}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:justify-between">
      <div className="min-w-0 max-w-2xl">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-2.5 text-2xl font-semibold text-ink sm:text-3xl">{title}</h2>
        {description && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
  className,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="eyebrow">{label}</span>
      <div className="mt-2">{children}</div>
      {hint && <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "h-11 w-full rounded-lg border border-input bg-surface px-3.5 text-sm font-medium text-ink outline-none transition-all placeholder:font-normal placeholder:text-muted-foreground focus:border-accent focus:ring-4 focus:ring-accent/12";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-hairline bg-surface px-6 py-16 text-center">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-hairline bg-surface p-5">
      <div className="h-4 w-24 rounded bg-surface-muted" />
      <div className="mt-4 h-8 w-full rounded bg-surface-muted" />
      <div className="mt-3 h-4 w-2/3 rounded bg-surface-muted" />
    </div>
  );
}
