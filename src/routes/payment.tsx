import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Lock, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Steps } from "@/components/steps";
import { BookingSummary } from "@/components/booking-summary";
import { EmptyState, StatusBadge } from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n";
import { getBookingById } from "@/lib/api/bookings";
import { getPublicSettings, getWhatsAppUrl } from "@/lib/api/settings";

export const Route = createFileRoute("/payment")({
  validateSearch: (search: { bookingId?: string }) => ({
    bookingId: (search.bookingId ?? "").trim().replace(/^["']|["']$/g, ""),
  }),
  head: () => ({
    meta: [
      { title: "Secure payment — step 3 of 4 | Atyketo" },
      {
        name: "description",
        content: "View the payment code and barcode for your Atyketo flight booking.",
      },
      { property: "og:title", content: "Secure payment — step 3 of 4 | Atyketo" },
      {
        property: "og:description",
        content: "View your Atyketo booking payment instructions.",
      },
    ],
  }),
  component: PaymentPage,
});

function PaymentPage() {
  const { t } = useI18n();
  const { bookingId } = Route.useSearch();
  const { data: booking, isLoading } = useQuery({
    queryKey: ["payment-booking", bookingId],
    queryFn: () => getBookingById(bookingId),
    enabled: Boolean(bookingId),
  });
  const {
    data: settings,
    isLoading: isSettingsLoading,
    isError: settingsError,
  } = useQuery({
    queryKey: ["public-settings"],
    queryFn: getPublicSettings,
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
              <h2 className="text-sm font-semibold text-ink">{t("Payment instructions")}</h2>
              {isSettingsLoading ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  {t("Loading payment details...")}
                </p>
              ) : settingsError ? (
                <p className="mt-4 text-sm text-destructive" role="alert">
                  {t("Unable to load payment details. Please try again.")}
                </p>
              ) : !settings ? (
                <p className="mt-4 text-sm text-destructive" role="alert">
                  {t("Payment details are not configured yet.")}
                </p>
              ) : (
                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  {settings.paymentQrCode && (
                    <div className="flex flex-col items-start gap-3">
                      <p className="text-xs font-semibold text-ink">{t("Payment barcode")}</p>
                      <img
                        src={
                          settings.paymentQrCode.startsWith("data:") ||
                          settings.paymentQrCode.startsWith("http") ||
                          settings.paymentQrCode.startsWith("/")
                            ? settings.paymentQrCode
                            : `data:image/png;base64,${settings.paymentQrCode}`
                        }
                        alt={t("Payment barcode")}
                        className="h-48 w-48 rounded-lg border border-hairline bg-white object-contain p-2"
                      />
                    </div>
                  )}
                  {settings.paymentCode && (
                    <div>
                      <p className="text-xs font-semibold text-ink">{t("Payment code")}</p>
                      <p className="mt-2 break-all rounded-lg bg-surface-muted p-4 font-mono text-sm text-ink">
                        {settings.paymentCode}
                      </p>
                    </div>
                  )}
                  {!settings.paymentQrCode && !settings.paymentCode && (
                    <p className="text-sm text-destructive" role="alert">
                      {t("Payment details are not configured yet.")}
                    </p>
                  )}
                </div>
              )}
              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                {t("After payment, contact support to confirm your booking.")}
              </p>
              {settings?.contactPhone && (
                <a
                  href={getWhatsAppUrl(settings.contactPhone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-accent underline underline-offset-2"
                >
                  {settings.contactPhone}
                </a>
              )}
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
                <Lock className="h-3.5 w-3.5" />{" "}
                {t("You will not be charged until the fare is re-verified.")}
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
