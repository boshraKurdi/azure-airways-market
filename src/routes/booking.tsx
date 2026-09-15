import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Lock, Plus, Trash2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Steps } from "@/components/steps";
import { BookingSummary } from "@/components/booking-summary";
import { EmptyState, Field, inputClass } from "@/components/ui-kit";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { getFlightById } from "@/lib/api/flights";
import { createBooking } from "@/lib/api/bookings";
import type { BookingPassenger } from "@/lib/types/bookings";
import { useProtectedRoute } from "@/hooks/use-protected-route";

export const Route = createFileRoute("/booking")({
  validateSearch: (search: { flightId?: string }) => ({ flightId: search.flightId ?? "" }),
  head: () => ({
    meta: [
      { title: "Passenger details — step 2 of 4 | Skyla" },
      {
        name: "description",
        content:
          "Enter passenger and contact details for your Skyla flight booking. Secure, encrypted and quick.",
      },
      { property: "og:title", content: "Passenger details — step 2 of 4 | Skyla" },
      {
        property: "og:description",
        content: "Enter passenger and contact details for your Skyla flight booking.",
      },
    ],
  }),
  component: BookingPage,
});

function createPassenger(): BookingPassenger {
  return {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "MALE",
    nationality: "Syrian",
    passportNumber: "",
  };
}

function isPassengerComplete(passenger: BookingPassenger) {
  return Object.values(passenger).every((value) => String(value).trim().length > 0);
}

function BookingPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  useProtectedRoute();
  const { flightId } = Route.useSearch();
  const { data: flight, isLoading } = useQuery({
    queryKey: ["booking-flight", flightId],
    queryFn: () => getFlightById(flightId),
    enabled: Boolean(flightId),
  });
  const [count, setCount] = useState(1);
  const [passengers, setPassengers] = useState<BookingPassenger[]>([createPassenger()]);
  const updatePassenger = (index: number, update: Partial<BookingPassenger>) => {
    setPassengers((current) =>
      current.map((passenger, passengerIndex) =>
        passengerIndex === index ? { ...passenger, ...update } : passenger,
      ),
    );
  };

  const removePassenger = (index: number) => {
    setPassengers((current) => current.filter((_, passengerIndex) => passengerIndex !== index));
    setCount((current) => current - 1);
  };
  const bookingMutation = useMutation({
    mutationFn: () => createBooking({ flightId: Number(flightId), adults: count, children: 0, infants: 0, passengers }),
    onSuccess: (booking) => {
      navigate({ to: "/payment", search: { bookingId: String(booking.id) } });
    },
    onError: () => toast.error(t("Unable to create booking. Please check your passenger details.")),
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

  if (!flightId || !flight) {
    return (
      <PageShell>
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <EmptyState
            title={t("No flight selected")}
            description={t("Choose a flight before completing your booking details.")}
            action={
              <Link
                to="/search"
                search={{ from: "", to: "", depart: "", passengers: 1, cabin: "Economy" }}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                {t("Find a flight")}
              </Link>
            }
          />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="border-b border-hairline bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <Steps current={1} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-5">
            <div>
              <h1 className="text-2xl font-semibold text-ink">{t("Passenger information")}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("Names must match the travel document exactly. We never share your data with third parties beyond the issuing airline.")}
              </p>
            </div>

            {passengers.map((passenger, i) => (
              <section
                key={i}
                className="rounded-xl border border-hairline bg-surface p-6 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-ink">
                    {t("Passenger")} {i + 1}{" "}
                    <span className="font-normal text-muted-foreground">
                      · {t(i === 0 ? "Adult (lead)" : "Adult")}
                    </span>
                  </h2>
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => removePassenger(i)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> {t("Remove")}
                    </button>
                  )}
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label={t("First name")}>
                    <input className={inputClass} value={passenger.firstName} onChange={(event) => updatePassenger(i, { firstName: event.target.value })} placeholder={t("As in passport")} />
                  </Field>
                  <Field label={t("Last name")}>
                    <input className={inputClass} value={passenger.lastName} onChange={(event) => updatePassenger(i, { lastName: event.target.value })} placeholder={t("As in passport")} />
                  </Field>
                  <Field label={t("Date of birth")}>
                    <input type="date" className={inputClass} value={passenger.dateOfBirth} onChange={(event) => updatePassenger(i, { dateOfBirth: event.target.value })} />
                  </Field>
                  <Field label={t("Nationality")}>
                    <select className={cn(inputClass, "appearance-none")} value={passenger.nationality} onChange={(event) => updatePassenger(i, { nationality: event.target.value })}>
                      <option value="Syrian">{t("Syria")}</option>
                      <option value="Turkish">{t("Türkiye")}</option>
                      <option value="Jordanian">{t("Jordan")}</option>
                      <option value="Egyptian">{t("Egypt")}</option>
                      <option value="Emirati">{t("United Arab Emirates")}</option>
                    </select>
                  </Field>
                  <Field label={t("Gender")}>
                    <select className={cn(inputClass, "appearance-none")} value={passenger.gender} onChange={(event) => updatePassenger(i, { gender: event.target.value as BookingPassenger["gender"] })}>
                      <option value="MALE">{t("Male")}</option>
                      <option value="FEMALE">{t("Female")}</option>
                      <option value="OTHER">{t("Other")}</option>
                    </select>
                  </Field>
                  <Field label={t("Passport number")}>
                    <input className={inputClass} value={passenger.passportNumber} onChange={(event) => updatePassenger(i, { passportNumber: event.target.value })} placeholder="N01234567" />
                  </Field>
                  <Field label={t("Passport expiry")}>
                    <input type="date" className={inputClass} />
                  </Field>
                </div>
              </section>
            ))}

            <button
              type="button"
              onClick={() => {
                if (count >= 9) return;
                setCount((c) => c + 1);
                setPassengers((current) => [...current, createPassenger()]);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-hairline px-4 py-3 text-sm font-semibold text-ink-soft transition-colors hover:border-accent/45 hover:text-accent"
            >
              <Plus className="h-4 w-4" /> {t("Add passenger")}
            </button>

            <section className="rounded-xl border border-hairline bg-surface p-6 shadow-card">
              <h2 className="text-sm font-semibold text-ink">{t("Contact details")}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label={t("Email")} hint={t("E-ticket and updates are sent here.")}>
                  <input type="email" className={inputClass} placeholder="you@email.com" />
                </Field>
                <Field label={t("Phone")}>
                  <input className={inputClass} placeholder="+963 …" />
                </Field>
              </div>
            </section>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-hairline bg-surface p-5">
              <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" /> {t("Encrypted in transit · PCI-compliant processing")}
              </p>
              <button
                type="button"
                disabled={bookingMutation.isPending || passengers.some((passenger) => !isPassengerComplete(passenger))}
                onClick={() => bookingMutation.mutate()}
                className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110"
              >
                {bookingMutation.isPending ? t("Creating booking...") : t("Continue to Payment")}
              </button>
            </div>
          </div>

          <div>
            <div className="lg:sticky lg:top-24">
              <BookingSummary flight={flight} passengers={count} />
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
