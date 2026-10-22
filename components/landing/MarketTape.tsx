import { tape } from "@/lib/landing";

// Cinta de precios con símbolos inventados. La etiqueta lo dice claro: no son cotizaciones reales.
export default function MarketTape() {
  const items = [...tape, ...tape];
  return (
    <div className="flex items-center overflow-hidden border-b border-edge bg-surface text-[13px]">
      <span className="z-10 shrink-0 border-r border-edge bg-surface px-4 py-2.5 font-semibold text-brand">Datos simulados</span>
      <div className="relative min-w-0 flex-1 overflow-hidden" aria-hidden>
        <div className="marquee flex w-max items-center">
          {items.map((t, i) => (
            <span key={i} className="tabnum flex items-center gap-2.5 px-5 py-2.5">
              <b className="font-semibold">{t.s}</b>
              <span className="text-muted">${t.p.toFixed(2)}</span>
              <span className={t.c >= 0 ? "text-up" : "text-down"}>
                {t.c >= 0 ? "▲" : "▼"} {Math.abs(t.c).toFixed(2)}%
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
