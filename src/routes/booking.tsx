import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Lock, Plus, Trash2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Steps } from "@/components/steps";
import { BookingSummary } from "@/components/booking-summary";
import { EmptyState, Field, inputClass } from "@/components/ui-kit";
import { getFlights } from "@/lib/api/flights";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/booking")({
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

function BookingPage() {
  const { data: flight } = useQuery({
    queryKey: ["booking-flight"],
    queryFn: () => getFlights({ page: 1, limit: 1 }).then((items) => items[0] ?? null),
  });
  const [count, setCount] = useState(1);

  if (!flight) {
    return (
      <PageShell>
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <EmptyState
            title="No flight selected"
            description="Choose a flight before completing your booking details."
            action={
              <Link
                to="/search"
                search={{ from: "", to: "", depart: "", passengers: 1, cabin: "Economy" }}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Find a flight
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
              <h1 className="text-2xl font-semibold text-ink">Passenger information</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Names must match the travel document exactly. We never share your data with third
                parties beyond the issuing airline.
              </p>
            </div>

            {Array.from({ length: count }).map((_, i) => (
              <section
                key={i}
                className="rounded-xl border border-hairline bg-surface p-6 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-ink">
                    Passenger {i + 1}{" "}
                    <span className="font-normal text-muted-foreground">
                      · {i === 0 ? "Adult (lead)" : "Adult"}
                    </span>
                  </h2>
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => setCount((c) => c - 1)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  )}
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="First name">
                    <input className={inputClass} placeholder="As in passport" />
                  </Field>
                  <Field label="Last name">
                    <input className={inputClass} placeholder="As in passport" />
                  </Field>
                  <Field label="Date of birth">
                    <input type="date" className={inputClass} />
                  </Field>
                  <Field label="Nationality">
                    <select className={cn(inputClass, "appearance-none")}>
                      <option>Syria</option>
                      <option>Türkiye</option>
                      <option>Jordan</option>
                      <option>Egypt</option>
                      <option>United Arab Emirates</option>
                    </select>
                  </Field>
                  <Field label="Passport number">
                    <input className={inputClass} placeholder="N01234567" />
                  </Field>
                  <Field label="Passport expiry">
                    <input type="date" className={inputClass} />
                  </Field>
                </div>
              </section>
            ))}

            <button
              type="button"
              onClick={() => setCount((c) => Math.min(9, c + 1))}
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-hairline px-4 py-3 text-sm font-semibold text-ink-soft transition-colors hover:border-accent/45 hover:text-accent"
            >
              <Plus className="h-4 w-4" /> Add passenger
            </button>

            <section className="rounded-xl border border-hairline bg-surface p-6 shadow-card">
              <h2 className="text-sm font-semibold text-ink">Contact details</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Email" hint="E-ticket and updates are sent here.">
                  <input type="email" className={inputClass} placeholder="you@email.com" />
                </Field>
                <Field label="Phone">
                  <input className={inputClass} placeholder="+963 …" />
                </Field>
              </div>
            </section>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-hairline bg-surface p-5">
              <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" /> Encrypted in transit · PCI-compliant processing
              </p>
              <Link
                to="/payment"
                className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110"
              >
                Continue to Payment
              </Link>
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
