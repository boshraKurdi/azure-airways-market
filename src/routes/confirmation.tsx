import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Download, Mail } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Steps } from "@/components/steps";
import { RouteVisual } from "@/components/route-visual";
import { FlightLegs } from "@/components/flight-legs";
import { AirlineMark, EmptyState, StatusBadge } from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n";
import { getBookingById } from "@/lib/api/bookings";

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

export const Route = createFileRoute("/confirmation")({
  validateSearch: (search: { bookingId?: string }) => ({ bookingId: search.bookingId ?? "" }),
  head: () => ({
    meta: [
      { title: "Booking confirmed — your e-ticket is on the way | Atyketo" },
      {
        name: "description",
        content:
          "Your Atyketo booking is confirmed. View your reference, flight, passenger and payment status.",
      },
      { property: "og:title", content: "Booking confirmed | Atyketo" },
      {
        property: "og:description",
        content: "Your Atyketo booking is confirmed — reference, flight and payment status.",
      },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { t } = useI18n();
  const { bookingId } = Route.useSearch();
  const { data: booking, isLoading } = useQuery({
    queryKey: ["confirmation-booking", bookingId],
    queryFn: () => getBookingById(bookingId),
    enabled: Boolean(bookingId),
  });

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex min-h-[30vh] items-center justify-center text-sm text-muted-foreground">
          {t("Loading")}
        </div>
      </PageShell>
    );
  }

  if (!booking) {
    return (
      <PageShell>
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <EmptyState
            title={t("Booking unavailable")}
            description={t("We could not load the confirmed flight details.")}
            action={
              <Link
                to="/search"
                search={{ from: "", to: "", depart: "", passengers: 1, cabin: "Economy" }}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                {t("Search flights")}
              </Link>
            }
          />
        </div>
      </PageShell>
    );
  }

  const flight = booking.flight;
  const total = Number(booking.totalPrice);

  return (
    <PageShell>
      <div className="border-b border-hairline bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <Steps current={3} />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <div className="animate-rise text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/12">
            <CheckCircle2 className="h-7 w-7 text-success" strokeWidth={2} />
          </span>
          <h1 className="mt-6 text-3xl font-semibold text-ink">{t("Booking successful")}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("Your e-ticket has been sent to your email. Keep the reference below for check-in.")}
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-hairline bg-surface shadow-card">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-dashed border-hairline p-6">
            <div className="min-w-0">
              <p className="eyebrow">{t("Booking reference")}</p>
              <p className="text-display tabular mt-1.5 text-2xl font-semibold tracking-tight text-ink">
                {booking.bookingReference}
              </p>
            </div>
            <StatusBadge tone="success">{t("Confirmed")}</StatusBadge>
          </div>

          <div className="p-6">
            <div className="flex min-w-0 items-center gap-3">
              <AirlineMark code={flight.airlineCode} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{flight.airline}</p>
                <p className="text-xs text-muted-foreground">
                  {flight.flightNumber} · {flight.cabin}
                </p>
              </div>
            </div>
            <RouteVisual
              className="mt-6"
              from={flight.from.code}
              to={flight.to.code}
              duration={flight.duration}
              stops={flight.stops.length}
            />
            <p className="mt-3 text-sm font-medium text-ink-soft">
              {formatDate(flight.departDate)} · {flight.departTime} — {flight.arriveTime}
            </p>
            {flight.legs.length > 1 && (
              <div className="mt-5">
                <FlightLegs legs={flight.legs} />
              </div>
            )}

            <dl className="mt-7 grid gap-5 border-t border-hairline pt-6 sm:grid-cols-4">
              {[
                ["Passenger", booking.passengers.map((passenger) => `${passenger.firstName} ${passenger.lastName}`).join(", ")],
                ["Payment", booking.paymentStatus],
                ["Payment status", booking.paymentStatus],
                ["Order status", booking.status],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="eyebrow">{t(label)}</dt>
                  <dd className="mt-1.5 text-sm font-semibold text-ink">{t(value)}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex items-end justify-between border-t border-hairline pt-5">
              <span className="text-sm font-semibold text-ink">{t("Total paid")}</span>
              <span className="text-display tabular text-3xl font-semibold text-price">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/bookings"
            className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110"
          >
            {t("View My Booking")}
          </Link>
          <button className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent/40">
            <Download className="h-4 w-4" /> {t("Download e-ticket")}
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent/40">
            <Mail className="h-4 w-4" /> {t("Resend email")}
          </button>
        </div>
      </div>
    </PageShell>
  );
}
