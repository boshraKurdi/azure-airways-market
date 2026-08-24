import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = ["Flight", "Passengers", "Payment", "Confirmation"];

export function Steps({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2 overflow-x-auto pb-1 sm:gap-3">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "tabular grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-bold transition-colors",
                  done && "border-success bg-success text-success-foreground",
                  active && "border-accent bg-accent text-accent-foreground",
                  !done && !active && "border-hairline bg-surface text-muted-foreground",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold sm:text-sm",
                  active ? "text-ink" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && <span className="h-px w-6 bg-hairline sm:w-10" />}
          </li>
        );
      })}
    </ol>
  );
}
