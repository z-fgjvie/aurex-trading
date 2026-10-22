import Link from "next/link";
import HeroChart from "./HeroChart";
import { benefits, hero } from "@/lib/landing";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--brand) 35%, transparent), transparent 70%)" }}
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 lg:grid-cols-[1fr_1.08fr] lg:gap-14 lg:px-8 lg:pb-24 lg:pt-20">
        <div>
          <h1 className="font-display text-[2.6rem] font-semibold leading-[1.04] tracking-tight sm:text-6xl">{hero.title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{hero.sub}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/quiz" className="btn-primary !px-7 !py-4 !text-base">
              {hero.primary}
            </Link>
            <a href="#como-funciona" className="btn-ghost !px-7 !py-4 !text-base">
              {hero.secondary}
            </a>
          </div>
          <ul className="mt-8 space-y-2.5">
            {hero.facts.map((f) => (
              <li key={f} className="flex items-center gap-3 text-[15px] text-muted">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand" aria-hidden>
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <HeroChart />
      </div>

      <div className="relative border-y border-edge bg-surface">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-3 lg:px-8">
          {benefits.map((b) => (
            <div key={b.title}>
              <h2 className="font-display text-xl font-semibold">{b.title}</h2>
              <p className="mt-2 max-w-sm text-[15.5px] leading-relaxed text-muted">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
