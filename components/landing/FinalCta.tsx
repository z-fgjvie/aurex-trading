import Link from "next/link";
import BotAvatar from "@/components/ui/BotAvatar";
import { Skyline } from "./Art";
import { finalCta } from "@/lib/landing";

export default function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
      <div className="relative overflow-hidden rounded-3xl border border-edge bg-surface px-6 py-14 sm:px-12 sm:py-16">
        <Skyline className="pointer-events-none absolute inset-y-0 -right-6 hidden h-full w-[46%] opacity-60 lg:block" />
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--brand) 40%, transparent), transparent 70%)" }}
          aria-hidden
        />
        <div className="relative max-w-xl">
          <div className="mb-5">
            <BotAvatar color="#5eead4" size={84} />
          </div>
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">{finalCta.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">{finalCta.sub}</p>
          <Link href="/quiz" className="btn-primary mt-8 !px-8 !py-4 !text-base">
            {finalCta.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
