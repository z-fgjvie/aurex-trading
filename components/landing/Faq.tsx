import { faq } from "@/lib/landing";

export default function Faq() {
  return (
    <section id="faq" className="border-t border-edge bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[1fr_1.6fr] lg:px-8 lg:py-28">
        <div>
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Preguntas frecuentes</h2>
          <p className="mt-4 max-w-sm text-lg leading-relaxed text-muted">Lo que casi todos preguntan antes de empezar.</p>
        </div>
        <div className="divide-y divide-[var(--line)] rounded-2xl border border-edge bg-canvas">
          {faq.map((f) => (
            <details key={f.q} className="group px-5 py-1 sm:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="shrink-0 text-brand transition-transform group-open:rotate-45" aria-hidden>
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <p className="pb-5 pr-8 text-[15.5px] leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
