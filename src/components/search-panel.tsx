import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeftRight, CalendarDays, Minus, Plus, Search, Users } from "lucide-react";
import { airports } from "@/lib/flight-data";
import { cn } from "@/lib/utils";
import { inputClass } from "./ui-kit";

const cabins = ["Economy", "Premium Economy", "Business"] as const;

export function SearchPanel({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [trip, setTrip] = useState<"round" | "one">("round");
  const [from, setFrom] = useState("DAM");
  const [to, setTo] = useState("IST");
  const [depart, setDepart] = useState("2026-09-12");
  const [ret, setRet] = useState("2026-09-19");
  const [passengers, setPassengers] = useState(1);
  const [cabin, setCabin] = useState<(typeof cabins)[number]>("Economy");

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate({ to: "/search", search: { from, to, depart, passengers, cabin } });
      }}
      className={cn(
        "rounded-2xl border border-hairline bg-surface p-4 shadow-panel sm:p-5",
        compact && "shadow-card",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg bg-surface-muted p-1">
          {(
            [
              ["round", "Round-trip"],
              ["one", "One-way"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTrip(key)}
              className={cn(
                "rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all",
                trip === key ? "bg-surface text-ink shadow-card" : "text-muted-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="inline-flex rounded-lg bg-surface-muted p-1">
          {cabins.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCabin(c)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold transition-all",
                cabin === c ? "bg-surface text-ink shadow-card" : "text-muted-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,2fr)_auto]">
        <div className="relative grid grid-cols-2 gap-3">
          <label className="block">
            <span className="eyebrow">From</span>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={cn(inputClass, "mt-2 appearance-none pr-8")}
            >
              {airports.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.city} ({a.code})
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="eyebrow">To</span>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={cn(inputClass, "mt-2 appearance-none pr-8")}
            >
              {airports.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.city} ({a.code})
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={swap}
            aria-label="Swap airports"
            className="absolute left-1/2 top-[2.35rem] z-10 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full border border-hairline bg-surface text-ink-soft shadow-card transition-colors hover:text-accent"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="eyebrow">Departure</span>
            <div className="relative mt-2">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="date"
                value={depart}
                onChange={(e) => setDepart(e.target.value)}
                className={cn(inputClass, "pl-9")}
              />
            </div>
          </label>
          <label className={cn("block", trip === "one" && "opacity-45")}>
            <span className="eyebrow">Return</span>
            <div className="relative mt-2">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="date"
                value={ret}
                disabled={trip === "one"}
                onChange={(e) => setRet(e.target.value)}
                className={cn(inputClass, "pl-9")}
              />
            </div>
          </label>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 lg:flex">
          <div className="min-w-0">
            <span className="eyebrow">Passengers</span>
            <div className="mt-2 flex h-11 items-center justify-between gap-2 rounded-lg border border-input bg-surface px-2.5">
              <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setPassengers((p) => Math.max(1, p - 1))}
                className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-ink-soft hover:bg-surface-muted"
                aria-label="Remove passenger"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="tabular w-4 text-center text-sm font-semibold text-ink">
                {passengers}
              </span>
              <button
                type="button"
                onClick={() => setPassengers((p) => Math.min(9, p + 1))}
                className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-ink-soft hover:bg-surface-muted"
                aria-label="Add passenger"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-6 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110 active:scale-[0.98]"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}
