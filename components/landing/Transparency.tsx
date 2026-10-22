import { honest } from "@/lib/landing";

function Check({ ok }: { ok: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={`mt-0.5 shrink-0 ${ok ? "stroke-up" : "stroke-down"}`} aria-hidden>
      {ok ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <path d="M6 6l12 12M18 6L6 18" />}
    </svg>
  );
}

export default function Transparency() {
  return (
    <section className="border-y border-edge bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">{honest.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">{honest.sub}</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-edge bg-canvas p-6 sm:p-8">
            <h3 className="font-display text-xl font-semibold">Aurex es</h3>
            <ul className="mt-5 space-y-4">
              {honest.is.map((t) => (
                <li key={t} className="flex gap-3 text-[15.5px] leading-relaxed">
                  <Check ok />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-edge bg-canvas p-6 sm:p-8">
            <h3 className="font-display text-xl font-semibold">Aurex no es</h3>
            <ul className="mt-5 space-y-4">
              {honest.isNot.map((t) => (
                <li key={t} className="flex gap-3 text-[15.5px] leading-relaxed">
                  <Check ok={false} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
