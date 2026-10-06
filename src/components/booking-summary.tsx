import { Link, useNavigate } from "@tanstack/react-router";
import { Info, ShieldCheck } from "lucide-react";
import type { Flight } from "@/lib/types/flights";
import { RouteVisual } from "./route-visual";
import { FlightLegs } from "./flight-legs";
import { useI18n } from "@/lib/i18n";

const formatDate = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

const formatPrice = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

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
  const { t } = useI18n();
  const navigate = useNavigate();
  const base = flight.price * passengers;
  const taxes = Math.round(base * 0.12);
  const fee = 9 * passengers;
  const total = base + taxes + fee;

  return (
    <aside className="rounded-xl border border-hairline bg-surface p-6 shadow-card">
      <p className="eyebrow">{t("Booking summary")}</p>
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
        {flight.airline} · {flight.flightNumber}
      </p>
      {flight.legs.length > 1 && (
        <div className="mt-4">
          <FlightLegs legs={flight.legs} />
        </div>
      )}

      <dl className="mt-6 space-y-2.5 border-t border-hairline pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">
            {t("Fare ×")} {passengers} {t(passengers > 1 ? "passengers" : "passenger")}
          </dt>
          <dd className="tabular font-medium text-ink">{formatPrice(base)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t("Taxes & carrier charges")}</dt>
          <dd className="tabular font-medium text-ink">{formatPrice(taxes)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t("Atyketo service fee")}</dt>
          <dd className="tabular font-medium text-ink">{formatPrice(fee)}</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-end justify-between border-t border-hairline pt-5">
        <span className="text-sm font-semibold text-ink">{t("Total")}</span>
        <span className="text-display tabular text-3xl font-semibold text-price">
          {formatPrice(total)}
        </span>
      </div>

      <p className="mt-4 inline-flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {t("Fare rules: name changes not permitted. Free cancellation within 24 hours of booking.")}
      </p>

      {cta && ctaTo && (
        <Link
          to={ctaTo}
          className="mt-5 flex w-full items-center justify-center rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110"
        >
          {cta}
        </Link>
      )}

      {cta && !ctaTo && (
        <button
          type="button"
          onClick={() => navigate({ to: "/booking", search: { flightId: flight.id } })}
          className="mt-5 flex w-full items-center justify-center rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110"
        >
          {cta}
        </button>
      )}

      <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-success">
        <ShieldCheck className="h-3.5 w-3.5" /> {t("Price verified")} {flight.verifiedMinutesAgo} {t("minutes ago")}
      </p>
    </aside>
  );
}
