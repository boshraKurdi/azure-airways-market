import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BellRing, Sparkles, TicketPercent, TrendingDown } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SearchPanel } from "@/components/search-panel";
import { OfferCard } from "@/components/flight-card";
import { SectionHeading, StatusBadge } from "@/components/ui-kit";
import { flights, formatPrice } from "@/lib/flight-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skyla — Find your next flight at a better price" },
      {
        name: "description",
        content:
          "Skyla is a curated flight marketplace. Compare verified flight offers, transparent pricing and book in minutes.",
      },
      { property: "og:title", content: "Skyla — Find your next flight at a better price" },
      {
        property: "og:description",
        content: "Compare curated, price-verified flight offers and book in minutes.",
      },
    ],
  }),
  component: Home,
});

const trustPoints = [
  {
    icon: TrendingDown,
    title: "Price-verified offers",
    body: "Every fare is re-checked before it reaches you — no bait pricing.",
  },
  {
    icon: TicketPercent,
    title: "Curated, not scraped",
    body: "Our team negotiates and publishes each offer manually.",
  },
  {
    icon: BellRing,
    title: "Drop alerts",
    body: "We watch your route and tell you the moment the fare moves.",
  },
];

const routesStrip = [
  { pair: "DAM → IST", price: 189 },
  { pair: "CAI → IST", price: 168 },
  { pair: "IST → BER", price: 134 },
  { pair: "BEY → DXB", price: 212 },
  { pair: "DAM → DOH", price: 246 },
  { pair: "AMM → CDG", price: 389 },
];

function Home() {
  const cheapest = [...flights].sort((a, b) => a.price - b.price).slice(0, 6);

  return (
    <PageShell transparentHeader padTop={false}>
      <section className="hero-canvas relative overflow-hidden pb-40 pt-32 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="animate-rise max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground/85">
              <Sparkles className="h-3.5 w-3.5" />
              1,240 offers verified today
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] text-primary-foreground sm:text-6xl">
              Find your next flight
              <br />
              at a better price.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/70">
              A curated marketplace of hand-checked flight offers. Compare real fares, see the full
              price up front, and book in under three minutes.
            </p>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-28 max-w-6xl px-5 sm:px-8">
        <div className="animate-rise">
          <SearchPanel />
        </div>

        <div className="mt-6 flex gap-2.5 overflow-x-auto pb-2">
          {routesStrip.map((r) => (
            <Link
              key={r.pair}
              to="/search"
              search={{ from: "", to: "", depart: "", passengers: 1, cabin: "Economy" }}
              className="group inline-flex shrink-0 items-center gap-2.5 rounded-full border border-hairline bg-surface px-4 py-2 text-xs font-semibold text-ink shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/40"
            >
              <span className="tabular">{r.pair}</span>
              <span className="tabular text-accent">{formatPrice(r.price)}</span>
            </Link>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="Cheapest flights"
          title="Live offers, lowest fare first"
          description="Curated by our team and re-verified every few minutes. Prices shown per passenger, taxes included at checkout."
          action={
            <Link
              to="/search"
              search={{ from: "", to: "", depart: "", passengers: 1, cabin: "Economy" }}
              className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-hairline bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent/40 hover:text-accent sm:inline-flex"
            >
              All offers <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cheapest.map((f) => (
            <OfferCard key={f.id} flight={f} />
          ))}
        </div>
      </section>

      <section className="border-y border-hairline bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow">Why Skyla</p>
            <h2 className="mt-2.5 text-2xl font-semibold text-ink sm:text-3xl">
              Marketplace pricing, without the guesswork.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              We are not an airline. Skyla is the layer between you and dozens of carriers — every
              offer is published, priced and monitored by our operations team.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <StatusBadge tone="success">98.4% on-time fare match</StatusBadge>
              <StatusBadge tone="accent">24h free cancellation</StatusBadge>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {trustPoints.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-hairline bg-background p-5 transition-colors hover:border-accent/35"
              >
                <p.icon className="h-5 w-5 text-accent" strokeWidth={2} />
                <h3 className="mt-4 text-sm font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="hero-canvas relative overflow-hidden rounded-2xl px-6 py-14 text-center sm:px-16">
          <h2 className="text-2xl font-semibold text-primary-foreground sm:text-4xl">
            Ready when the fare drops?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-primary-foreground/70">
            Create a free account to save routes, track fare movements and keep every booking in one
            place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/signup"
              className="rounded-lg bg-primary-foreground px-5 py-3 text-sm font-semibold text-primary transition-all hover:opacity-90"
            >
              Create account
            </Link>
            <Link
              to="/search"
              search={{ from: "", to: "", depart: "", passengers: 1, cabin: "Economy" }}
              className="rounded-lg border border-primary-foreground/25 px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Browse offers
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
