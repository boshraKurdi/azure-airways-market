import { Link } from "@tanstack/react-router";
import { Plane } from "lucide-react";

const groups = [
  {
    title: "Product",
    items: ["Flight search", "Price alerts", "Deal feed", "Group booking"],
  },
  {
    title: "Company",
    items: ["About Skyla", "Careers", "Press", "Partners"],
  },
  {
    title: "Support",
    items: ["Help center", "Refund policy", "Baggage rules", "Contact us"],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Plane className="h-4.5 w-4.5 -rotate-45" strokeWidth={2.2} />
              </span>
              <span className="text-display text-lg font-semibold text-ink">Skyla</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A curated flight marketplace. Verified offers, transparent pricing, and a booking flow
              that respects your time.
            </p>
          </div>
          {groups.map((g) => (
            <div key={g.title}>
              <p className="eyebrow">{g.title}</p>
              <ul className="mt-4 space-y-2.5">
                {g.items.map((i) => (
                  <li key={i}>
                    <span className="cursor-pointer text-sm text-ink-soft transition-colors hover:text-accent">
                      {i}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-hairline pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Skyla Travel Technologies. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link to="/help" className="hover:text-ink">
              Terms
            </Link>
            <Link to="/help" className="hover:text-ink">
              Privacy
            </Link>
            <Link to="/help" className="hover:text-ink">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
