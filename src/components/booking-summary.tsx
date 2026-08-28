import { Link } from "@tanstack/react-router";
import { Info, ShieldCheck } from "lucide-react";
import type { Flight } from "@/lib/flight-data";
import { formatDate, formatPrice } from "@/lib/flight-data";
import { RouteVisual } from "./route-visual";

export function BookingSummary({
  flight,
  passengers = 1,
  cta,
  ctaTo,
}: {
  flight: Flight;
  passengers?: number;
  cta?: string;
  ctaTo?: "/booking" | "/payment" | "/confirmation";
}) {
  const base = flight.price * passengers;
  const taxes = Math.round(base * 0.12);
  const fee = 9 * passengers;
  const total = base + taxes + fee;

  return (
    <aside className="rounded-xl border border-hairline bg-surface p-6 shadow-card">
      <p className="eyebrow">Booking summary</p>
      <RouteVisual
        className="mt-4"
        from={flight.from.code}
        to={flight.to.code}
        duration={flight.duration}
        stops={flight.stops.length}
        size="md"
      />
      <p className="mt-3 text-sm font-medium text-ink-soft">
        {formatDate(flight.departDate)} · {flight.departTime} — {flight.arriveTime}
      </p>
      <p className="text-xs text-muted-foreground">
        {flight.airline} · {flight.flightNumber} · {flight.cabin}
      </p>

      <dl className="mt-6 space-y-2.5 border-t border-hairline pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">
            Fare × {passengers} passenger{passengers > 1 ? "s" : ""}
          </dt>
          <dd className="tabular font-medium text-ink">{formatPrice(base)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Taxes & carrier charges</dt>
          <dd className="tabular font-medium text-ink">{formatPrice(taxes)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Skyla service fee</dt>
          <dd className="tabular font-medium text-ink">{formatPrice(fee)}</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-end justify-between border-t border-hairline pt-5">
        <span className="text-sm font-semibold text-ink">Total</span>
        <span className="text-display tabular text-3xl font-semibold text-price">
          {formatPrice(total)}
        </span>
      </div>

      <p className="mt-4 inline-flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Fare rules: name changes not permitted. Free cancellation within 24 hours of booking.
      </p>

      {cta && ctaTo && (
        <Link
          to={ctaTo}
          className="mt-5 flex w-full items-center justify-center rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110"
        >
          {cta}
        </Link>
      )}

      <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-success">
        <ShieldCheck className="h-3.5 w-3.5" /> Price verified {flight.verifiedMinutesAgo} minutes
        ago
      </p>
    </aside>
  );
}
