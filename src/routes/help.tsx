import { createFileRoute, Link } from "@tanstack/react-router";
import { LifeBuoy, MessageSquare, Plane, Wallet } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/ui-kit";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help center — bookings, payments and baggage | Skyla" },
      {
        name: "description",
        content:
          "Answers about Skyla bookings, payment methods including Sham Cash, baggage rules and cancellations.",
      },
      { property: "og:title", content: "Help center | Skyla" },
      {
        property: "og:description",
        content: "Answers about bookings, payments, baggage and cancellations.",
      },
    ],
  }),
  component: HelpPage,
});

const topics = [
  {
    icon: Plane,
    title: "Bookings & tickets",
    body: "E-ticket delivery, name corrections, check-in windows.",
  },
  {
    icon: Wallet,
    title: "Payments",
    body: "Sham Cash transfers, cards, refunds and payment status.",
  },
  {
    icon: LifeBuoy,
    title: "Changes & cancellations",
    body: "24-hour free cancellation and airline fare rules.",
  },
];

const faqs = [
  [
    "Is Skyla an airline?",
    "No. Skyla is a flight marketplace. Offers are published by our operations team and the ticket is issued by the operating carrier.",
  ],
  [
    "How is the price verified?",
    "Each offer is re-checked against the carrier before it is shown, and again before payment is taken. The timestamp is displayed on every result.",
  ],
  [
    "Which payment methods are supported?",
    "Sham Cash, international cards and major wallets. Bookings paid by Sham Cash are usually issued within 10 minutes.",
  ],
  [
    "Can I cancel?",
    "Yes — free cancellation within 24 hours of booking, then the airline's fare rules apply.",
  ],
];

function HelpPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <SectionHeading
          eyebrow="Help center"
          title="How can we help?"
          description="Most answers are here. If not, our team replies within a few minutes during working hours."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {topics.map((t) => (
            <div
              key={t.title}
              className="rounded-xl border border-hairline bg-surface p-5 transition-colors hover:border-accent/35"
            >
              <t.icon className="h-5 w-5 text-accent" />
              <h3 className="mt-4 text-sm font-semibold text-ink">{t.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 divide-y divide-hairline rounded-xl border border-hairline bg-surface">
          {faqs.map(([q, a]) => (
            <details key={q} className="group p-6">
              <summary className="cursor-pointer list-none text-sm font-semibold text-ink">
                {q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-hairline bg-surface p-6">
          <div className="flex items-start gap-3">
            <MessageSquare className="mt-0.5 h-5 w-5 text-accent" />
            <div>
              <p className="text-sm font-semibold text-ink">Still need help?</p>
              <p className="mt-1 text-xs text-muted-foreground">Average reply time: 4 minutes.</p>
            </div>
          </div>
          <Link
            to="/bookings"
            className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Contact support
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
