import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { getPublicSettings, getWhatsAppUrl } from "@/lib/api/settings";

const groups = [
  {
    title: "Product",
    items: ["Flight search", "Price alerts", "Deal feed", "Group booking"],
  },
  {
    title: "Company",
    items: ["About Atyketo", "Careers", "Press", "Partners"],
  },
  {
    title: "Support",
    items: ["Help center", "Refund policy", "Baggage rules", "Contact us"],
  },
];

export function SiteFooter() {
  const { t } = useI18n();
  const { data: settings, isError } = useQuery({
    queryKey: ["public-settings"],
    queryFn: getPublicSettings,
  });
  return (
    <footer className="border-t border-hairline bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo-atyketo.png"
                alt=""
                className="h-14 w-14 rounded-lg bg-white object-contain p-0.5"
              />
              <span className="text-display text-lg font-semibold text-ink">Atyketo</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t(
                "A curated flight marketplace. Verified offers, transparent pricing, and a booking flow that respects your time.",
              )}
            </p>
            <div className="mt-4 text-sm text-ink-soft">
              <p className="font-semibold">{t("Support phone")}</p>
              {settings?.contactPhone ? (
                <a
                  href={getWhatsAppUrl(settings.contactPhone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block hover:text-accent"
                >
                  {settings.contactPhone}
                </a>
              ) : (
                <p className="mt-1 text-muted-foreground">
                  {isError
                    ? t("Unable to load the support number.")
                    : t("Support number is not configured.")}
                </p>
              )}
            </div>
          </div>
          {groups.map((g) => (
            <div key={g.title}>
              <p className="eyebrow">{t(g.title)}</p>
              <ul className="mt-4 space-y-2.5">
                {g.items.map((i) => (
                  <li key={i}>
                    <span className="cursor-pointer text-sm text-ink-soft transition-colors hover:text-accent">
                      {t(i)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-hairline pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Atyketo Travel &amp; Tourism. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link to="/help" className="hover:text-ink">
              {t("Terms")}
            </Link>
            <Link to="/help" className="hover:text-ink">
              {t("Privacy")}
            </Link>
            <Link to="/help" className="hover:text-ink">
              {t("Cookies")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
