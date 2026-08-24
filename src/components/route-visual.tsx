import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";

export function RouteVisual({
  from,
  to,
  duration,
  stops,
  size = "md",
  className,
}: {
  from: string;
  to: string;
  duration?: string;
  stops?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const codeSize =
    size === "lg" ? "text-4xl sm:text-5xl" : size === "md" ? "text-2xl" : "text-lg";

  return (
    <div className={cn("flex items-center gap-3 sm:gap-4", className)}>
      <span className={cn("text-display tabular shrink-0 font-semibold text-ink", codeSize)}>
        {from}
      </span>
      <div className="relative flex min-w-0 flex-1 flex-col items-center">
        {duration && (
          <span className="mb-1 text-[11px] font-semibold tracking-wide text-muted-foreground">
            {duration}
          </span>
        )}
        <div className="relative flex w-full items-center">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span className="flight-line h-px flex-1" />
          {typeof stops === "number" && stops > 0 && (
            <span className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-warning ring-3 ring-surface" />
          )}
          <Plane
            className="h-3.5 w-3.5 shrink-0 -rotate-45 text-accent"
            strokeWidth={2.4}
          />
        </div>
        {typeof stops === "number" && (
          <span className="mt-1 text-[11px] font-medium text-muted-foreground">
            {stops === 0 ? "Direct" : `${stops} stop`}
          </span>
        )}
      </div>
      <span className={cn("text-display tabular shrink-0 font-semibold text-ink", codeSize)}>
        {to}
      </span>
    </div>
  );
}
