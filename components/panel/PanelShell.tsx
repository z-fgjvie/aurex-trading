"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";
import BrandMark from "@/components/landing/BrandMark";
import ThemeToggle from "@/components/landing/ThemeToggle";
import { useDemo } from "@/components/panel/DemoProvider";
import Icon from "@/components/panel/Icon";
import { riskDisclaimer } from "@/lib/config";

const main = [
  { href: "/panel", label: "Inicio", icon: "home", exact: true },
  { href: "/panel/simulador", label: "Simulador", icon: "chart" },
  { href: "/panel/bots", label: "Bots", icon: "bots" },
  { href: "/panel/herramientas", label: "Herramientas", icon: "tools" },
  { href: "/panel/mentor", label: "Mentor IA", icon: "chat" },
  { href: "/panel/aprender", label: "Aprender", icon: "book" },
  { href: "/panel/novedades", label: "Novedades", icon: "news" },
];

const mobile = [
  { href: "/panel", label: "Inicio", icon: "home", exact: true },
  { href: "/panel/bots", label: "Bots", icon: "bots" },
  { href: "/panel/simulador", label: "Simulador", icon: "chart" },
  { href: "/panel/herramientas", label: "Herramientas", icon: "tools" },
  { href: "/panel/aprender", label: "Aprender", icon: "book" },
];

function useActive() {
  const path = usePathname() ?? "";
  return (href: string, exact?: boolean) =>
    exact ? path === href : path === href || path.startsWith(href + "/");
}

function ModeSwitch() {
  const path = usePathname() ?? "";
  const real = path.startsWith("/panel/real");
  const base =
    "rounded-lg px-3.5 py-1.5 text-[13px] font-bold tracking-wide transition-colors";
  return (
    <div
      className="inline-flex rounded-xl border border-edge bg-surface p-0.5"
      role="group"
      aria-label="Modo"
    >
      <Link
        href="/panel"
        aria-current={!real ? "page" : undefined}
        className={`${base} ${!real ? "grad-brand text-[#04161c]" : "text-muted hover:text-fg"}`}
      >
        DEMO
      </Link>
      <Link
        href="/panel/real"
        aria-current={real ? "page" : undefined}
        className={`${base} ${real ? "bg-fg text-canvas" : "text-muted hover:text-fg"}`}
      >
        REAL
      </Link>
    </div>
  );
}

function Bell() {
  const { pendingCount } = useDemo();
  return (
    <Link
      href="/panel/notificaciones"
      aria-label={`Notificaciones${pendingCount ? `, ${pendingCount} por decidir` : ""}`}
      className="relative grid h-10 w-10 place-items-center rounded-xl border border-edge text-fg transition-colors hover:bg-surface2"
    >
      <Icon name="bell" size={19} />
      {pendingCount > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-down px-1 text-[11px] font-bold text-white">
          {pendingCount}
        </span>
      )}
    </Link>
  );
}

export default function PanelShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useDemo();
  const active = useActive();
  const inReal = (usePathname() ?? "").startsWith("/panel/real");
  const initial = (user.name || user.email).trim().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-canvas font-body text-fg">
      {/* Barra lateral (escritorio) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-edge bg-surface px-4 py-5 lg:flex">
        <Link href="/panel" className="px-2" aria-label="Inicio del panel">
          <BrandMark />
        </Link>
        <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Principal">
          {main.map((n) => {
            const on = active(n.href, n.exact);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={on ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold transition-colors ${on ? "soft-brand text-fg" : "text-muted hover:bg-surface2 hover:text-fg"}`}
              >
                <Icon name={n.icon} className={on ? "text-brand" : ""} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="rounded-xl bg-surface2 p-3.5">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">
            Tu plan
          </p>
          <p className="mt-1 text-[14.5px] font-semibold leading-snug">
            {user.planLabel}
          </p>
          <p className="mt-0.5 text-[13px] text-muted">
            {user.active
              ? `${user.daysLeft} ${user.daysLeft === 1 ? "día" : "días"} de acceso`
              : "Acceso vencido"}
          </p>
        </div>
        <div className="mt-3 flex items-center gap-2.5 px-1">
          <Link
            href="/panel/perfil"
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl p-1.5 hover:bg-surface2"
            aria-label="Mi perfil"
          >
            <span className="grad-brand grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold text-[#04161c]">
              {initial}
            </span>
            <span className="min-w-0 text-left">
              <span className="block truncate text-[14px] font-semibold">
                {user.name || "Mi cuenta"}
              </span>
              <span className="block truncate text-[12px] text-muted">
                {user.email}
              </span>
            </span>
          </Link>
        </div>
        <div className="mt-2 px-1">
          <LogoutButton />
        </div>
      </aside>

      <div className="lg:pl-64">
        {/* Barra superior */}
        <header className="glass sticky top-0 z-20 border-b border-edge">
          <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <Link
              href="/panel"
              className="lg:hidden"
              aria-label="Inicio del panel"
            >
              <BrandMark compact />
            </Link>
            <div className="hidden lg:block">
              <ModeSwitch />
            </div>
            <div className="flex items-center gap-2">
              <div className="lg:hidden">
                <ModeSwitch />
              </div>
              <Bell />
              <ThemeToggle />
              <Link
                href="/panel/perfil"
                aria-label="Mi perfil"
                className="grad-brand grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-[#04161c] lg:hidden"
              >
                {initial}
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1240px] px-4 pb-32 pt-6 sm:px-6 lg:px-8 lg:pb-14 lg:pt-8">
          {user.active ? (
            children
          ) : (
            <div className="mx-auto mt-10 max-w-md rounded-2xl border border-edge bg-surface p-8 text-center card-shadow">
              <h1 className="font-display text-2xl font-semibold">
                Tu acceso venció
              </h1>
              <p className="mt-2 text-[15px] text-muted">
                Elige un plan para seguir practicando con tu simulador y tus
                bots.
              </p>
              <Link href="/quiz" className="btn-primary mt-5">
                Renovar mi plan
              </Link>
            </div>
          )}
          <p className="mt-10 max-w-3xl text-[12.5px] leading-relaxed text-muted">
            {riskDisclaimer}
            {!inReal &&
              " Explora el modo DEMO y practica tu estrategia en un entorno simulado con saldo virtual y precios de referencia."}
          </p>
        </main>
      </div>

      {/* Mentor (móvil) */}
      <Link
        href="/panel/mentor"
        aria-label="Abrir el mentor de IA"
        className="grad-brand fixed bottom-24 right-4 z-30 grid h-14 w-14 place-items-center rounded-full text-[#04161c] shadow-xl lg:hidden"
      >
        <Icon name="chat" size={24} />
      </Link>

      {/* Menú inferior (móvil) */}
      <nav
        aria-label="Principal"
        className="glass fixed inset-x-0 bottom-0 z-30 border-t border-edge pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {mobile.map((n) => {
            const on = active(n.href, n.exact);
            return (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={on ? "page" : undefined}
                  className={`flex flex-col items-center gap-1 px-1 py-2.5 text-[11px] font-semibold ${on ? "text-brand" : "text-muted"}`}
                >
                  <Icon name={n.icon} size={22} />
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
