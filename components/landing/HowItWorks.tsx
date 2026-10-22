"use client";

import { useState } from "react";
import { StepBotsVisual, StepDecideVisual, StepLearnVisual, StepQuizVisual } from "./Art";
import { steps } from "@/lib/landing";
import { brand } from "@/lib/config";

const visuals = [StepQuizVisual, StepBotsVisual, StepDecideVisual, StepLearnVisual];

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const Active = visuals[active];

  return (
    <section id="como-funciona" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
      <div className="max-w-2xl">
        <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Cómo funciona {brand.name}</h2>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Cuatro pasos para pasar de «no sé por dónde empezar» a practicar con método.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <ol className="space-y-3">
          {steps.map((s, i) => {
            const open = i === active;
            const Visual = visuals[i];
            return (
              <li key={s.title}>
                <button
                  onClick={() => setActive(i)}
                  aria-expanded={open}
                  className={`w-full rounded-2xl border p-5 text-left transition-colors ${
                    open ? "card-shadow border-brand bg-surface" : "border-edge hover:bg-surface"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-sm font-bold ${
                        open ? "grad-brand text-[#04161c]" : "bg-surface2 text-muted"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="font-display text-xl font-semibold">{s.title}</span>
                  </span>
                  {open && <p className="mt-3 pl-[3.25rem] text-[15.5px] leading-relaxed text-muted">{s.body}</p>}
                </button>
                {open && (
                  <div className="mt-3 lg:hidden">
                    <Visual />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
        <div className="hidden lg:sticky lg:top-24 lg:block">
          <Active />
        </div>
      </div>
    </section>
  );
}
