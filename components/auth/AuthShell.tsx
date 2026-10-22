import Link from "next/link";
import type { ReactNode } from "react";
import BrandMark from "@/components/landing/BrandMark";
import ThemeToggle from "@/components/landing/ThemeToggle";
import { riskDisclaimer } from "@/lib/config";

// Marco común de /login y /registro: panel de marca a la izquierda (solo en pantallas grandes)
// y el formulario a la derecha. Usa el mismo tema claro/oscuro que la landing.
export default function AuthShell({ aside, children }: { aside: ReactNode; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas font-body text-fg lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <aside className="relative hidden overflow-hidden border-r border-edge lg:block">
        <div className="grid-bg absolute inset-0" aria-hidden />
        <div className="grad-brand absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-25 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[#38bdf8] opacity-10 blur-3xl" aria-hidden />
        <div className="relative z-10 flex min-h-screen flex-col px-10 py-9 xl:px-14">
          <Link href="/" aria-label="Ir al inicio" className="w-fit">
            <BrandMark />
          </Link>
          <div className="my-auto py-10">{aside}</div>
          <p className="max-w-md text-xs leading-relaxed text-muted">{riskDisclaimer}</p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" aria-label="Ir al inicio" className="lg:hidden">
            <BrandMark />
          </Link>
          <Link href="/" className="hidden items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg lg:inline-flex">
            <span aria-hidden>←</span> Volver al inicio
          </Link>
          <ThemeToggle />
        </div>
        <main className="flex flex-1 items-center justify-center px-5 pb-12 pt-2 sm:px-8">
          <div className="w-full max-w-[26.5rem]">{children}</div>
        </main>
      </div>
    </div>
  );
}
