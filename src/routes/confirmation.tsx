import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Download, Mail } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Steps } from "@/components/steps";
import { RouteVisual } from "@/components/route-visual";
import { AirlineMark, EmptyState, StatusBadge } from "@/components/ui-kit";
import { getFlights } from "@/lib/api/flights";

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
  head: () => ({
    meta: [
      { title: "Booking confirmed — your e-ticket is on the way | Skyla" },
      {
        name: "description",
        content:
          "Your Skyla booking is confirmed. View your reference, flight, passenger and payment status.",
      },
      { property: "og:title", content: "Booking confirmed | Skyla" },
      {
        property: "og:description",
        content: "Your Skyla booking is confirmed — reference, flight and payment status.",
      },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { data: flight } = useQuery({
    queryKey: ["confirmation-flight"],
    queryFn: () => getFlights({ page: 1, limit: 1 }).then((items) => items[0] ?? null),
  });

  if (!flight) {
    return (
      <PageShell>
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <EmptyState
            title="Booking unavailable"
            description="We could not load the confirmed flight details."
            action={
              <Link
                to="/search"
                search={{ from: "", to: "", depart: "", passengers: 1, cabin: "Economy" }}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Search flights
              </Link>
            }
          />
        </div>
      </PageShell>
    );
  }

  const total = Math.round(flight.price * 1.12) + 9;

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
          <h1 className="mt-6 text-3xl font-semibold text-ink">Booking successful</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your e-ticket has been sent to your email. Keep the reference below for check-in.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-hairline bg-surface shadow-card">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-dashed border-hairline p-6">
            <div className="min-w-0">
              <p className="eyebrow">Booking reference</p>
              <p className="text-display tabular mt-1.5 text-2xl font-semibold tracking-tight text-ink">
                SKY-8FQ2ML
              </p>
            </div>
            <StatusBadge tone="success">Confirmed</StatusBadge>
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

            <dl className="mt-7 grid gap-5 border-t border-hairline pt-6 sm:grid-cols-4">
              {[
                ["Passenger", "Boshra Kurdi"],
                ["Payment", "Sham Cash"],
                ["Payment status", "Paid"],
                ["Order status", "Ticket issued"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="eyebrow">{k}</dt>
                  <dd className="mt-1.5 text-sm font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex items-end justify-between border-t border-hairline pt-5">
              <span className="text-sm font-semibold text-ink">Total paid</span>
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
            View My Booking
          </Link>
          <button className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent/40">
            <Download className="h-4 w-4" /> Download e-ticket
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent/40">
            <Mail className="h-4 w-4" /> Resend email
          </button>
        </div>
      </div>
    </PageShell>
  );
}
