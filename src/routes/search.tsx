import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SearchPanel } from "@/components/search-panel";
import { ResultRow } from "@/components/flight-card";
import { EmptyState, StatusBadge } from "@/components/ui-kit";
import { airlines, flights, formatPrice } from "@/lib/flight-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/search")({
  validateSearch: (search: {
    from?: string;
    to?: string;
    depart?: string;
    passengers?: number;
    cabin?: string;
  }) => ({
    from: search.from ?? "",
    to: search.to ?? "",
    depart: search.depart ?? "",
    passengers: Number(search.passengers ?? 1),
    cabin: search.cabin ?? "Economy",
  }),
  head: () => ({
    meta: [
      { title: "Flight results — compare verified offers | Skyla" },
      {
        name: "description",
        content:
          "Filter by price, airline, stops and departure time to compare price-verified flight offers on Skyla.",
      },
      { property: "og:title", content: "Flight results — compare verified offers | Skyla" },
      {
        property: "og:description",
        content: "Filter and compare price-verified flight offers on Skyla.",
      },
    ],
  }),
  component: SearchPage,
});

type Sort = "cheapest" | "fastest" | "earliest";

function SearchPage() {
  const { passengers } = Route.useSearch();
  const [maxPrice, setMaxPrice] = useState(1200);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [stops, setStops] = useState<"any" | "0" | "1">("any");
  const [departWindow, setDepartWindow] = useState<"any" | "morning" | "afternoon" | "night">("any");
  const [sort, setSort] = useState<Sort>("cheapest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => {
    const hour = (t: string) => Number(t.split(":")[0]);
    let list = flights.filter((f) => {
      if (f.price > maxPrice) return false;
      if (selectedAirlines.length && !selectedAirlines.includes(f.airline)) return false;
      if (stops === "0" && f.stops.length !== 0) return false;
      if (stops === "1" && f.stops.length < 1) return false;
      const h = hour(f.departTime);
      if (departWindow === "morning" && !(h >= 5 && h < 12)) return false;
      if (departWindow === "afternoon" && !(h >= 12 && h < 18)) return false;
      if (departWindow === "night" && h >= 5 && h < 18) return false;
      return true;
    });
    list = [...list].sort((a, b) =>
      sort === "cheapest"
        ? a.price - b.price
        : sort === "fastest"
          ? a.durationMinutes - b.durationMinutes
          : a.departTime.localeCompare(b.departTime),
    );
    return list;
  }, [maxPrice, selectedAirlines, stops, departWindow, sort]);

  const toggleAirline = (a: string) =>
    setSelectedAirlines((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const reset = () => {
    setMaxPrice(1200);
    setSelectedAirlines([]);
    setStops("any");
    setDepartWindow("any");
  };

  const filters = (
    <div className="space-y-7">
      <div>
        <div className="flex items-center justify-between">
          <p className="eyebrow">Price range</p>
          <span className="tabular text-xs font-semibold text-accent">
            up to {formatPrice(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={100}
          max={1200}
          step={10}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="mt-4 h-1 w-full cursor-pointer appearance-none rounded-full bg-hairline accent-accent"
        />
      </div>

      <div>
        <p className="eyebrow">Airlines</p>
        <div className="mt-3 space-y-2.5">
          {airlines.map((a) => (
            <label key={a} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={selectedAirlines.includes(a)}
                onChange={() => toggleAirline(a)}
                className="h-4 w-4 rounded border-input accent-accent"
              />
              {a}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow">Stops</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(
            [
              ["any", "Any"],
              ["0", "Direct"],
              ["1", "1+ stop"],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              type="button"
              onClick={() => setStops(k)}
              className={cn(
                "rounded-lg border px-2 py-2 text-xs font-semibold transition-colors",
                stops === k
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-hairline text-ink-soft hover:border-accent/40",
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow">Departure time</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(
            [
              ["any", "Any time"],
              ["morning", "05–12"],
              ["afternoon", "12–18"],
              ["night", "18–05"],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              type="button"
              onClick={() => setDepartWindow(k)}
              className={cn(
                "rounded-lg border px-2 py-2 text-xs font-semibold transition-colors",
                departWindow === k
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-hairline text-ink-soft hover:border-accent/40",
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow">Arrival time</p>
        <p className="mt-3 text-xs text-muted-foreground">
          Arrival filtering follows your departure window for these offers.
        </p>
      </div>

      <button
        type="button"
        onClick={reset}
        className="w-full rounded-lg border border-hairline py-2.5 text-xs font-semibold text-ink-soft transition-colors hover:border-accent/40 hover:text-accent"
      >
        Reset all filters
      </button>
    </div>
  );

  return (
    <PageShell>
      <div className="border-b border-hairline bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <SearchPanel compact />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold text-ink sm:text-2xl">
              {results.length} offers found
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {passengers} passenger{passengers > 1 ? "s" : ""} · prices per person, taxes shown at
              checkout
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden rounded-lg bg-surface-muted p-1 sm:inline-flex">
              {(
                [
                  ["cheapest", "Cheapest"],
                  ["fastest", "Fastest"],
                  ["earliest", "Earliest"],
                ] as const
              ).map(([k, l]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSort(k)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-semibold transition-all",
                    sort === k ? "bg-surface text-ink shadow-card" : "text-muted-foreground",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface px-3.5 py-2.5 text-xs font-semibold text-ink lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
          </div>
        </div>

        <div className="mt-7 grid gap-8 lg:grid-cols-[264px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-hairline bg-surface p-5">
              {filters}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <StatusBadge tone="accent">Fares verified live</StatusBadge>
              <StatusBadge>Sorted by {sort}</StatusBadge>
            </div>
            {results.length ? (
              results.map((f) => <ResultRow key={f.id} flight={f} />)
            ) : (
              <EmptyState
                title="No offers match these filters"
                description="Try widening your price range or allowing flights with one stop."
                action={
                  <button
                    onClick={reset}
                    className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                  >
                    Reset filters
                  </button>
                }
              />
            )}
          </div>
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-60 lg:hidden">
          <button
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />
          <div className="animate-rise absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-hairline bg-surface p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-ink">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            {filters}
            <button
              onClick={() => setFiltersOpen(false)}
              className="mt-6 w-full rounded-lg bg-accent py-3 text-sm font-semibold text-accent-foreground"
            >
              Show {results.length} offers
            </button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
