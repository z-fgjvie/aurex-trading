import Link from "next/link";
import { currency, currencyLabel, showDiscount } from "@/lib/config";
import { planCopy, planIncludes, planList, planTitle } from "@/lib/landing";

export default function Pricing() {
  return (
    <section id="planes" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
      <div className="max-w-2xl">
        <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">{planCopy.title}</h2>
        <p className="mt-4 text-lg leading-relaxed text-muted">{planCopy.sub}</p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {planList.map((p) => (
          <article
            key={p.id}
            className={`relative flex flex-col rounded-2xl border p-6 sm:p-7 ${
              p.popular ? "card-shadow border-brand bg-surface" : "border-edge bg-surface"
            }`}
          >
            {p.popular && (
              <span className="grad-brand absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-bold text-[#04161c]">Recomendado</span>
            )}
            <h3 className="font-display text-xl font-semibold">{planTitle(p.label)}</h3>
            <p className="mt-5 flex items-baseline gap-2">
              <span className="tabnum font-display text-5xl font-semibold tracking-tight">
                {currency}
                {p.price.toFixed(0)}
              </span>
              <span className="text-sm text-muted">{currencyLabel} · pago único</span>
            </p>
            {showDiscount && p.oldPrice && (
              <p className="tabnum mt-1 text-sm text-muted line-through">
                {currency}
                {p.oldPrice.toFixed(0)} {currencyLabel}
              </p>
            )}
            <ul className="mt-6 flex-1 space-y-3 border-t border-edge pt-6">
              {planIncludes.map((i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-snug">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-brand" aria-hidden>
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                  {i}
                </li>
              ))}
            </ul>
            <Link href="/quiz" className={`mt-7 ${p.popular ? "btn-primary" : "btn-ghost"}`}>
              {planCopy.cta}
            </Link>
          </article>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted">{planCopy.note}</p>
    </section>
  );
}
