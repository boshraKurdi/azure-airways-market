import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { RouteVisual } from "@/components/route-visual";
import { AirlineMark, EmptyState, Price, StatusBadge } from "@/components/ui-kit";
import { bookings, formatDate, getFlight, type BookingStatus } from "@/lib/flight-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bookings")({
  head: () => ({
    meta: [
      { title: "My bookings — trips, status and e-tickets | Skyla" },
      {
        name: "description",
        content: "Track upcoming, completed and cancelled Skyla flight bookings with live status and prices.",
      },
      { property: "og:title", content: "My bookings | Skyla" },
      {
        property: "og:description",
        content: "Track upcoming, completed and cancelled flight bookings in one place.",
      },
    ],
  }),
  component: BookingsPage,
});

const tabs: { key: BookingStatus; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const tone = (s: BookingStatus) =>
  s === "upcoming" ? "accent" : s === "completed" ? "success" : "danger";

function BookingsPage() {
  const [tab, setTab] = useState<BookingStatus>("upcoming");
  const list = bookings.filter((b) => b.status === tab);

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">My bookings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every trip you booked through Skyla, with live order status.
        </p>

        <div className="mt-7 inline-flex rounded-lg bg-surface-muted p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-md px-4 py-2 text-xs font-semibold transition-all sm:text-sm",
                tab === t.key ? "bg-surface text-ink shadow-card" : "text-muted-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {list.length ? (
            list.map((b) => {
              const f = getFlight(b.flightId);
              return (
                <article
                  key={b.reference}
                  className="rounded-xl border border-hairline bg-surface p-5 shadow-card transition-all hover:border-accent/35 hover:shadow-lift sm:p-6"
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <AirlineMark code={f.airlineCode} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{f.airline}</p>
                        <p className="tabular text-xs text-muted-foreground">{b.reference}</p>
                      </div>
                    </div>
                    <StatusBadge tone={tone(b.status)}>
                      {b.status === "upcoming"
                        ? "Upcoming"
                        : b.status === "completed"
                          ? "Completed"
                          : "Cancelled"}
                    </StatusBadge>
                  </div>

                  <RouteVisual
                    className="mt-6"
                    from={f.from.code}
                    to={f.to.code}
                    duration={f.duration}
                    stops={f.stops.length}
                  />

                  <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-t border-hairline pt-5">
                    <div className="min-w-0 text-xs text-muted-foreground">
                      <p className="font-medium text-ink-soft">
                        {formatDate(f.departDate)} · {f.departTime}
                      </p>
                      <p className="mt-1">
                        {b.passengers} passenger{b.passengers > 1 ? "s" : ""} · Payment{" "}
                        {b.paymentStatus}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-end gap-5">
                      <Price value={b.total} size="sm" suffix="total" />
                      <Link
                        to="/flight/$flightId"
                        params={{ flightId: f.id }}
                        className="rounded-lg border border-hairline px-4 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-accent/45 hover:text-accent"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <EmptyState
              title={`No ${tab} bookings`}
              description="When you book a flight through Skyla it will appear here with live status updates."
              action={
                <Link
                  to="/search"
                  className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground"
                >
                  Find a flight
                </Link>
              }
            />
          )}
        </div>
      </div>
    </PageShell>
  );
}
