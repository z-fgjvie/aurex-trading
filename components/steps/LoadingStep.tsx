"use client";

import { useEffect, useState } from "react";
import type { FlowCtx } from "@/components/quiz/types";
import Testimonials from "@/components/ui/Testimonials";

const messages = [
  "Analizando tus respuestas…",
  "Ajustando el nivel de riesgo…",
  "Preparando tu reto de trading…",
];

export default function LoadingStep({ ctx }: { ctx: FlowCtx }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPct((p) => Math.min(100, p + 2)), 90);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (pct >= 100) {
      const t = setTimeout(ctx.next, 450);
      return () => clearTimeout(t);
    }
  }, [pct, ctx]);

  const r = 46;
  const c = 2 * Math.PI * r;

  return (
    <div className="mx-auto w-full max-w-xl animate-rise px-4 pt-8 text-center">
      <div className="relative mx-auto h-28 w-28">
        <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
          <circle cx="55" cy="55" r={r} fill="none" stroke="#2a2b2f" strokeWidth="7" />
          <circle
            cx="55"
            cy="55"
            r={r}
            fill="none"
            stroke="#5eead4"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - pct / 100)}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">{pct}%</span>
      </div>
      <p className="mt-3 text-sm">{messages[Math.min(2, Math.floor(pct / 34))]}</p>

      <div className="mx-auto mt-6 border-t border-line/60 pt-8">
        <Testimonials fallback />
      </div>
    </div>
  );
}
