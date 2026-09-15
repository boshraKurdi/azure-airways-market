import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CreditCard, Lock, ShieldCheck, Smartphone, Wallet } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Steps } from "@/components/steps";
import { BookingSummary } from "@/components/booking-summary";
import { EmptyState, Field, StatusBadge, inputClass } from "@/components/ui-kit";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { getBookingById } from "@/lib/api/bookings";

export const Route = createFileRoute("/payment")({
  validateSearch: (search: { bookingId?: string }) => ({ bookingId: search.bookingId ?? "" }),
  head: () => ({
    meta: [
      { title: "Secure payment — step 3 of 4 | Skyla" },
      {
        name: "description",
        content:
          "Choose Sham Cash, card or wallet and complete your Skyla flight payment securely.",
      },
      { property: "og:title", content: "Secure payment — step 3 of 4 | Skyla" },
      {
        property: "og:description",
        content: "Choose Sham Cash, card or wallet and pay securely on Skyla.",
      },
    ],
  }),
  component: PaymentPage,
});

const methods = [
  {
    id: "sham",
    name: "Sham Cash",
    icon: Smartphone,
    desc: "Local wallet transfer · confirmed in minutes",
  },
  { id: "card", name: "Card", icon: CreditCard, desc: "Visa, Mastercard — 3-D Secure" },
  { id: "wallet", name: "International wallet", icon: Wallet, desc: "PayPal, Wise, Apple Pay" },
] as const;

function PaymentPage() {
  const { t } = useI18n();
  const { bookingId } = Route.useSearch();
  const { data: booking, isLoading } = useQuery({
    queryKey: ["payment-booking", bookingId],
    queryFn: () => getBookingById(bookingId),
    enabled: Boolean(bookingId),
  });
  const [method, setMethod] = useState<string>("sham");

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
            title={t("No flight selected")}
            description={t("Choose a flight before payment is processed.")}
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
          <Steps current={2} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold text-ink">{t("Payment")}</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("Your seats are held for 29:41 while you complete this payment.")}
                </p>
              </div>
              <StatusBadge tone="warning">{t("Awaiting payment")}</StatusBadge>
            </div>

            <section className="rounded-xl border border-hairline bg-surface p-6 shadow-card">
              <h2 className="text-sm font-semibold text-ink">{t("Payment method")}</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {methods.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      "rounded-lg border p-4 text-left transition-all",
                      method === m.id
                        ? "border-accent bg-accent/8 ring-1 ring-accent/20"
                        : "border-hairline hover:border-accent/40",
                    )}
                  >
                    <m.icon
                      className={cn(
                        "h-5 w-5",
                        method === m.id ? "text-accent" : "text-muted-foreground",
                      )}
                    />
                    <p className="mt-3 text-sm font-semibold text-ink">{t(m.name)}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t(m.desc)}</p>
                  </button>
                ))}
              </div>

              <div className="mt-6 border-t border-hairline pt-6">
                {method === "sham" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label={t("Sham Cash wallet number")}>
                      <input className={inputClass} placeholder="0000 0000 0000" />
                    </Field>
                    <Field label={t("Wallet holder name")}>
                      <input className={inputClass} placeholder="Full name" />
                    </Field>
                    <p className="text-xs leading-relaxed text-muted-foreground sm:col-span-2">
                      {t("After confirming, you will receive a transfer code. The booking is issued once the transfer is verified by our operations team — usually under 10 minutes.")}
                    </p>
                  </div>
                )}
                {method === "card" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label={t("Card number")} className="sm:col-span-2">
                      <input className={inputClass} placeholder="4242 4242 4242 4242" />
                    </Field>
                    <Field label={t("Expiry")}>
                      <input className={inputClass} placeholder="MM / YY" />
                    </Field>
                    <Field label={t("CVC")}>
                      <input className={inputClass} placeholder="123" />
                    </Field>
                  </div>
                )}
                {method === "wallet" && (
                  <div className="grid gap-4">
                    <Field label={t("Wallet email")}>
                      <input className={inputClass} placeholder="you@email.com" />
                    </Field>
                    <p className="text-xs text-muted-foreground">
                      {t("You will be redirected to your provider to approve the payment.")}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="grid gap-4 rounded-xl border border-hairline bg-surface p-6 sm:grid-cols-3">
              {[
                ["Encrypted", "TLS 1.3 end-to-end"],
                ["Protected", "Funds held until ticket issue"],
                ["Refundable", "24h free cancellation"],
              ].map(([title, description]) => (
                <div key={title} className="flex items-start gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <div>
                    <p className="text-xs font-semibold text-ink">{t(title)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{t(description)}</p>
                  </div>
                </div>
              ))}
            </section>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-hairline bg-surface p-5">
              <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" /> {t("You will not be charged until the fare is re-verified.")}
              </p>
              <Link
                to="/confirmation"
                search={{ bookingId }}
                className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110"
              >
                {t("Pay & confirm booking")}
              </Link>
            </div>
          </div>

          <div>
            <div className="lg:sticky lg:top-24">
              <BookingSummary flight={booking.flight} passengers={booking.passengers.length} />
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
