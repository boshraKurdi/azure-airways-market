import type { FlightLeg } from "@/lib/types/flights";
import { useI18n } from "@/lib/i18n";

export function FlightLegs({ legs }: { legs: FlightLeg[] }) {
  const { t } = useI18n();

  if (legs.length < 2) return null;

  return (
    <section className="border-t border-hairline pt-4" aria-label={t("Flight segments")}>
      <p className="eyebrow">{t("Flight segments")}</p>
      <ol className="mt-3 space-y-3">
        {legs.map((leg, index) => (
          <li key={leg.id}>
            <div className="rounded-lg bg-surface-muted/60 p-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-xs font-semibold text-ink">
                  {leg.flightNumber} · {leg.airline}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {leg.departDate} · {leg.duration}
                </p>
              </div>
              <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div>
                  <p className="tabular text-sm font-semibold text-ink">
                    {leg.departTime} · {leg.from.code}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{leg.from.city}</p>
                </div>
                <span aria-hidden="true" className="text-xs text-muted-foreground">
                  →
                </span>
                <div className="text-right">
                  <p className="tabular text-sm font-semibold text-ink">
                    {leg.arriveTime} · {leg.to.code}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {leg.to.city}
                    {leg.arriveDate !== leg.departDate ? ` · ${leg.arriveDate}` : ""}
                  </p>
                </div>
              </div>
            </div>
            {index < legs.length - 1 && (
              <p className="mt-2 px-3 text-[11px] font-medium text-muted-foreground">
                {t("Connection at")} {leg.to.city} ({leg.to.code})
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
