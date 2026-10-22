import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";
import BrandMark from "@/components/landing/BrandMark";
import ThemeToggle from "@/components/landing/ThemeToggle";
import { authConfigured } from "@/lib/auth";
import { brand, plans } from "@/lib/config";
import { planTitle, virtualBalance } from "@/lib/landing";
import { money } from "@/lib/chart";
import { supabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: `Mi panel · ${brand.name}`,
  robots: { index: false },
};

export const dynamic = "force-dynamic";

// Panel provisional: confirma que el login funciona y muestra el plan. El simulador y el agente
// de IA llegan en la siguiente fase.
export default async function PanelPage() {
  if (!authConfigured()) redirect("/login");
  const {
    data: { user },
  } = await supabaseServer().auth.getUser();
  if (!user) redirect("/login");

  const meta = (user.app_metadata ?? {}) as { plan?: string; activated_at?: string; access_until?: string };
  const plan = plans.find((p) => p.id === meta.plan);
  const until = meta.access_until ? new Date(meta.access_until) : null;
  const start = meta.activated_at ? new Date(meta.activated_at) : null;
  const msLeft = until ? until.getTime() - Date.now() : 0;
  const daysLeft = Math.max(0, Math.ceil(msLeft / 86_400_000));
  const active = until !== null && msLeft > 0;
  const total = until && start ? Math.max(1, (until.getTime() - start.getTime()) / 86_400_000) : 1;
  const pct = active ? Math.min(100, Math.max(4, (daysLeft / total) * 100)) : 0;
  const name = (user.user_metadata?.name as string | undefined)?.trim();

  return (
    <div className="min-h-screen bg-canvas font-body text-fg">
      <header className="glass sticky top-0 z-40 border-b border-edge">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 lg:px-8">
          <Link href="/" aria-label="Ir al inicio">
            <BrandMark />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-14">
        <p className="text-sm font-medium text-brand">Mi panel</p>
        <h1 className="mt-2 font-display text-[2rem] font-semibold leading-tight sm:text-4xl">
          Hola{name ? `, ${name}` : ""} 👋
        </h1>
        <p className="mt-2 text-[15px] text-muted">{user.email}</p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <section className="rounded-2xl border border-edge bg-surface p-6 card-shadow">
            <h2 className="text-sm font-medium text-muted">Tu plan</h2>
            <p className="mt-2 font-display text-2xl font-semibold">{plan ? planTitle(plan.label) : "Plan activo"}</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-surface2" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Días de acceso restantes">
              <div className="grad-brand h-full rounded-full" style={{ width: `${pct}%` }} />
            </div>
            {active ? (
              <p className="mt-3 text-sm text-muted">
                Te quedan <span className="font-semibold text-fg">{daysLeft} {daysLeft === 1 ? "día" : "días"}</span> de acceso
                {until && <> · hasta el {until.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}</>}.
              </p>
            ) : (
              <>
                <p className="mt-3 text-sm text-muted">Tu acceso venció. Elige un plan para seguir practicando.</p>
                <Link href="/quiz" className="btn-primary mt-4">
                  Renovar mi plan
                </Link>
              </>
            )}
          </section>

          <section className="rounded-2xl border border-edge bg-surface p-6 card-shadow">
            <h2 className="text-sm font-medium text-muted">Saldo virtual de práctica</h2>
            <p className="tabnum mt-2 font-display text-2xl font-semibold">{money(virtualBalance)}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Es dinero ficticio para aprender. No es dinero real y no se puede retirar.
            </p>
          </section>
        </div>

        <section className="mt-5 rounded-2xl border border-dashed border-edge p-8 text-center">
          <p className="font-display text-xl font-semibold">Tu simulador y tu agente de IA llegan pronto</p>
          <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-muted">
            Estamos terminando el panel con los bots, los gráficos en vivo y las operaciones de práctica. Tu cuenta ya
            está lista.
          </p>
        </section>
      </main>
    </div>
  );
}
