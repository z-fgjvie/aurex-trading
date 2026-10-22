"use client";

import Link from "next/link";
import { useState } from "react";
import BrandMark from "./BrandMark";
import ThemeToggle from "./ThemeToggle";
import { nav } from "@/lib/landing";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-40 border-b border-edge">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <Link href="/" aria-label="Ir al inicio">
          <BrandMark />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="rounded-lg px-3.5 py-2 text-[15px] font-medium text-muted transition-colors hover:text-fg">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className="btn-ghost hidden !py-2.5 sm:inline-flex">
            Iniciar sesión
          </Link>
          <Link href="/quiz" className="btn-primary !py-2.5">
            Empezar
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-xl border border-edge lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-edge bg-canvas lg:hidden">
          <nav aria-label="Menú móvil" className="mx-auto flex max-w-7xl flex-col px-5 py-3">
            {nav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="border-b border-edge py-3.5 text-base font-medium">
                {n.label}
              </a>
            ))}
            <Link href="/login" className="py-3.5 text-base font-medium text-muted">
              Iniciar sesión
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
