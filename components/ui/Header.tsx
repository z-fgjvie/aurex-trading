"use client";

import { useState } from "react";
import Logo from "./Logo";
import { brand, legalLinks } from "@/lib/config";

export default function Header({ progress }: { progress?: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-ink/95 backdrop-blur">
        <div className="relative flex h-14 items-center justify-center border-b border-line/60">
          <Logo />
          <button
            aria-label="Abrir menú"
            onClick={() => setOpen(true)}
            className="absolute right-4 flex h-9 w-9 flex-col items-center justify-center gap-1"
          >
            <span className="h-0.5 w-5 bg-white" />
            <span className="h-0.5 w-5 bg-white" />
            <span className="h-0.5 w-5 bg-white" />
          </button>
        </div>
        {progress !== undefined && (
          <div className="h-1 w-full bg-card">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        )}
      </header>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={() => setOpen(false)}>
          <aside
            className="flex h-full w-full max-w-sm flex-col bg-panel p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
              className="mb-6 self-end text-2xl leading-none"
            >
              ✕
            </button>
            <nav className="flex flex-col gap-5">
              {legalLinks.map((l) => (
                <a key={l.label} href={l.href} className="font-semibold">
                  {l.label}
                </a>
              ))}
            </nav>
            <p className="mt-auto text-sm text-white/80">
              Estaremos encantados de ayudarte por correo electrónico. Escríbenos a{" "}
              <a className="text-sky-400 underline" href={`mailto:${brand.supportEmail}`}>
                {brand.supportEmail}
              </a>
              .
            </p>
          </aside>
        </div>
      )}
    </>
  );
}
