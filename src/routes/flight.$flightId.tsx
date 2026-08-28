import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BriefcaseBusiness, Plane, ShieldCheck, Users } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { BookingSummary } from "@/components/booking-summary";
import { AirlineMark, StatusBadge } from "@/components/ui-kit";
import { RouteVisual } from "@/components/route-visual";
import { formatDate, getFlight } from "@/lib/flight-data";

export const Route = createFileRoute("/flight/$flightId")({
  head: () => ({
    meta: [
      { title: "Flight details & journey timeline | Skyla" },
      {
        name: "description",
        content:
          "Review the full journey timeline, baggage allowance, cabin class and total price before booking your Skyla flight offer.",
      },
      { property: "og:title", content: "Flight details & journey timeline | Skyla" },
      {
        property: "og:description",
        content: "Full journey timeline, baggage, cabin and total price for your flight offer.",
      },
    ],
  }),
  component: FlightDetails,
});

function FlightDetails() {
  const { flightId } = Route.useParams();
  const flight = getFlight(flightId);

  const timeline = [
    {
      time: flight.departTime,
      title: `Depart ${flight.from.city} (${flight.from.code})`,
      body: flight.from.airport,
      kind: "depart" as const,
    },
    ...flight.stops.map((s) => ({
      time: s.layover,
      title: `Layover in ${s.city} (${s.airport})`,
      body: "Terminal transfer, boarding pass re-check may be required",
      kind: "stop" as const,
    })),
    {
      time: flight.arriveTime,
      title: `Arrive ${flight.to.city} (${flight.to.code})`,
      body: flight.to.airport,
      kind: "arrive" as const,
    },
  ];

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <Link
          to="/search"
              search={{}}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to results
        </Link>

        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-5">
            <section className="rounded-xl border border-hairline bg-surface p-6 shadow-card sm:p-8">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <AirlineMark code={flight.airlineCode} className="h-12 w-12 text-sm" />
                  <div className="min-w-0">
                    <h1 className="truncate text-lg font-semibold text-ink sm:text-xl">
                      {flight.airline}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      Flight {flight.flightNumber} · {flight.cabin}
                    </p>
                  </div>
                </div>
                <StatusBadge tone="success">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified {flight.verifiedMinutesAgo}m ago
                </StatusBadge>
              </div>

              <RouteVisual
                className="mt-8"
                from={flight.from.code}
                to={flight.to.code}
                duration={flight.duration}
                stops={flight.stops.length}
                size="lg"
              />
              <div className="mt-2 flex items-center justify-between text-sm font-medium text-ink-soft">
                <span>{flight.from.city}</span>
                <span>{flight.to.city}</span>
              </div>

              <dl className="mt-8 grid gap-5 border-t border-hairline pt-6 sm:grid-cols-4">
                {[
                  ["Date", formatDate(flight.departDate)],
                  ["Duration", flight.duration],
                  ["Stops", flight.stops.length === 0 ? "Direct" : `${flight.stops.length} stop`],
                  ["Cabin", flight.cabin],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="eyebrow">{k}</dt>
                    <dd className="mt-1.5 text-sm font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-xl border border-hairline bg-surface p-6 shadow-card sm:p-8">
              <h2 className="text-base font-semibold text-ink">Journey timeline</h2>
              <ol className="mt-6 space-y-0">
                {timeline.map((t, i) => (
                  <li key={i} className="grid grid-cols-[64px_auto_minmax(0,1fr)] gap-4">
                    <span className="tabular pt-0.5 text-sm font-semibold text-ink">{t.time}</span>
                    <span className="relative flex flex-col items-center">
                      <span
                        className={
                          t.kind === "stop"
                            ? "mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-warning bg-surface"
                            : "mt-1.5 h-2.5 w-2.5 rounded-full bg-accent"
                        }
                      />
                      {i < timeline.length - 1 && <span className="mt-1 w-px flex-1 bg-hairline" />}
                    </span>
                    <div className={i < timeline.length - 1 ? "pb-8" : ""}>
                      <p className="text-sm font-semibold text-ink">{t.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl border border-hairline bg-surface p-6">
                <BriefcaseBusiness className="h-5 w-5 text-accent" />
                <h3 className="mt-4 text-sm font-semibold text-ink">Baggage allowance</h3>
                <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <li>Cabin bag: {flight.baggage.cabin}</li>
                  <li>Checked bag: {flight.baggage.checked}</li>
                  <li>Extra bags can be added at check-in</li>
                </ul>
              </div>
              <div className="rounded-xl border border-hairline bg-surface p-6">
                <Users className="h-5 w-5 text-accent" />
                <h3 className="mt-4 text-sm font-semibold text-ink">Availability</h3>
                <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <li>{flight.seatsLeft} seats left at this fare</li>
                  <li>Instant confirmation e-ticket</li>
                  <li>Free cancellation within 24 hours</li>
                </ul>
              </div>
            </section>

            <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Plane className="h-3.5 w-3.5 -rotate-45" />
              Skyla is a flight marketplace. Your ticket is issued by {flight.airline}.
            </p>
          </div>

          <div>
            <div className="lg:sticky lg:top-24">
              <BookingSummary flight={flight} passengers={1} cta="Continue to Booking" ctaTo="/booking" />
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
