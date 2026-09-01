import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock3, ShieldCheck } from "lucide-react";
import type { Flight } from "@/lib/types/flights";
import { RouteVisual } from "./route-visual";
import { AirlineMark, Price } from "./ui-kit";
import { cn } from "@/lib/utils";

const formatDate = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

export function OfferCard({ flight }: { flight: Flight }) {
  return (
    <article className="group relative flex flex-col rounded-xl border border-hairline bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lift">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <AirlineMark code={flight.airlineCode} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{flight.airline}</p>
            <p className="text-xs text-muted-foreground">{flight.flightNumber}</p>
          </div>
        </div>
      </div>

      <RouteVisual
        className="mt-6"
        from={flight.from.code}
        to={flight.to.code}
        duration={flight.duration}
        stops={flight.stops.length}
      />

      <div className="mt-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>{flight.from.city}</span>
        <span>{flight.to.city}</span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-hairline pt-4 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="h-3.5 w-3.5" /> {formatDate(flight.departDate)} · {flight.departTime}
        </span>
        <span className="inline-flex items-center gap-1.5">
          {flight.availableSeats > 0 ? `${flight.availableSeats} seats` : "Sold out"}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground">from / person</p>
          <Price value={flight.price} currency={flight.currency} />
        </div>
        <Link
          to="/flight/$flightId"
          params={{ flightId: flight.id }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
        >
          View Flight
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

export function ResultRow({ flight }: { flight: Flight }) {
  return (
    <article
      className={cn(
        "group rounded-xl border bg-surface p-5 shadow-card transition-all duration-300 hover:border-accent/35 hover:shadow-lift sm:p-6",
        "border-hairline",
      )}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-8">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2.5">
            <AirlineMark code={flight.airlineCode} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{flight.airline}</p>
              <p className="text-xs text-muted-foreground">{flight.flightNumber}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
            <div>
              <p className="text-display tabular text-2xl font-semibold text-ink">
                {flight.departTime}
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {flight.from.code} · {flight.from.city}
              </p>
            </div>
            <div className="min-w-0">
              <RouteVisual
                from={flight.from.code}
                to={flight.to.code}
                duration={flight.duration}
                stops={flight.stops.length}
                size="sm"
              />
            </div>
            <div className="text-right">
              <p className="text-display tabular text-2xl font-semibold text-ink">
                {flight.arriveTime}
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {flight.to.code} · {flight.to.city}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              {flight.availableSeats > 0 ? `${flight.availableSeats} seats available` : "Sold out"}
            </span>
          </div>
        </div>

        <div className="flex flex-row items-end justify-between gap-4 border-t border-hairline pt-5 lg:w-56 lg:flex-col lg:items-end lg:justify-center lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div className="lg:text-right">
            <Price value={flight.price} currency={flight.currency} suffix="per passenger" />
            <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-success">
              <ShieldCheck className="h-3.5 w-3.5" /> Price verified {flight.verifiedMinutesAgo}m
              ago
            </p>
          </div>
          <Link
            to="/flight/$flightId"
            params={{ flightId: flight.id }}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110 lg:w-full lg:justify-center"
          >
            Select Flight
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
