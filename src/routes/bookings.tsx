import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell";
import { RouteVisual } from "@/components/route-visual";
import { AirlineMark, EmptyState, Price, StatusBadge } from "@/components/ui-kit";
import { cancelBooking, getBookings } from "@/lib/api/bookings";
import { cn } from "@/lib/utils";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { useI18n } from "@/lib/i18n";

type BookingStatus = "upcoming" | "completed" | "cancelled";

const formatDate = (value: string | undefined) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

export const Route = createFileRoute("/bookings")({
  head: () => ({
    meta: [
      { title: "My bookings — trips, status and e-tickets | Skyla" },
      {
        name: "description",
        content:
          "Track upcoming, completed and cancelled Skyla flight bookings with live status and prices.",
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

const displayStatus = (status: string): BookingStatus => {
  const normalized = status.toLowerCase();
  if (normalized === "pending" || normalized === "confirmed" || normalized === "upcoming") {
    return "upcoming";
  }
  if (normalized === "completed") return "completed";
  return "cancelled";
};

function BookingsPage() {
  // Protect this route - only authenticated users can access
  useProtectedRoute();
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => getBookings(),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelBooking(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success(t("Booking cancelled successfully"));
    },
    onError: () => toast.error(t("Unable to cancel booking. Please try again.")),
  });

  const [tab, setTab] = useState<BookingStatus>("upcoming");
  const list = (data?.bookings ?? []).filter((booking) => {
    const status = booking.status.toLowerCase();
    return tab === "upcoming"
      ? status === "pending" || status === "confirmed" || status === "upcoming"
      : status === tab;
  });

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{t("My bookings")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("Every trip you booked through Skyla, with live order status.")}
        </p>

        <div className="mt-7 inline-flex rounded-lg bg-surface-muted p-1">
          {tabs.map((bookingTab) => (
            <button
              key={bookingTab.key}
              type="button"
              onClick={() => setTab(bookingTab.key)}
              className={cn(
                "rounded-md px-4 py-2 text-xs font-semibold transition-all sm:text-sm",
                tab === bookingTab.key ? "bg-surface text-ink shadow-card" : "text-muted-foreground",
              )}
            >
              {t(bookingTab.label)}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {isLoading ? <p className="text-sm text-muted-foreground">{t("Loading")}</p> : null}
          {error ? <p className="text-sm text-destructive">{t("Unable to load bookings")}</p> : null}
          {list.length ? (
            list.map((booking) => {
              const f = booking.flight;
              const bookingStatus = displayStatus(booking.status);
              return (
                <article
                  key={booking.id}
                  className="rounded-xl border border-hairline bg-surface p-5 shadow-card transition-all hover:border-accent/35 hover:shadow-lift sm:p-6"
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <AirlineMark code={f.airlineCode} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{f.airline}</p>
                        <p className="tabular text-xs text-muted-foreground">{booking.bookingReference}</p>
                      </div>
                    </div>
                    <StatusBadge tone={tone(bookingStatus)}>
                      {t(
                        bookingStatus === "upcoming"
                          ? "Upcoming"
                          : bookingStatus === "completed"
                            ? "Completed"
                            : "Cancelled",
                      )}
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
                        {booking.passengers.length} {t(booking.passengers.length > 1 ? "passengers" : "passenger")} · {t("Payment")} {t(booking.paymentStatus)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-end gap-5">
                      <Price value={Number(booking.totalPrice)} currency={booking.currency} size="sm" suffix={t("total")} />
                      <Link
                        to="/flight/$flightId"
                        params={{ flightId: f.id }}
                        className="rounded-lg border border-hairline px-4 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-accent/45 hover:text-accent"
                      >
                        {t("View Details")}
                      </Link>
                      {bookingStatus === "upcoming" && (
                        <button type="button" onClick={() => cancelMutation.mutate(booking.id)} disabled={cancelMutation.isPending} className="text-xs font-semibold text-destructive">
                          {t("Cancel")}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          ) : !isLoading && !error ? (
            <EmptyState
              title={t(`No ${tab} bookings`)}
              description={t(
                "When you book a flight through Skyla it will appear here with live status updates.",
              )}
              action={
                <Link
                  to="/search"
                  search={{ from: "", to: "", depart: "", passengers: 1, cabin: "Economy" }}
                  className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground"
                >
                  {t("Find a flight")}
                </Link>
              }
            />
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}
