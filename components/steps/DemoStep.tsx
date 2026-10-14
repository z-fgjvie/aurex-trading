"use client";

import { useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import FooterBar from "@/components/ui/FooterBar";
import { riskDisclaimer } from "@/lib/config";
import type { FlowCtx } from "@/components/quiz/types";

// Todos los datos de esta pantalla son ficticios y están rotulados como simulación.
const trade = { ticker: "ACME", entry: 50.0, stop: 47.5, target: 56.0 };

export default function DemoStep({ ctx }: { ctx: FlowCtx }) {
  const [phase, setPhase] = useState<"proposal" | "result">("proposal");
  const gain = (trade.target - trade.entry).toFixed(2);

  return (
    <div className="mx-auto w-full max-w-md animate-rise px-4 pb-32 pt-6">
      <p className="text-center text-xs text-white/80">
        Esta es una demo simulada con datos ficticios{ctx.answers.name ? `, ${ctx.answers.name}` : ""}.
        Revisa la idea del bot y toca Aprobar.
      </p>

      <div className="mt-4 rounded-2xl bg-panel p-4">
        <p className="flex items-center gap-2 font-semibold text-accent">💡 Por qué esta operación</p>
        <p className="mt-2 text-sm leading-relaxed text-white/90">
          {trade.ticker} (activo ficticio) cae 5% en la sesión. El bot detecta una posible zona de rebote cerca
          de un soporte y propone una entrada con su stop y su objetivo.
        </p>
      </div>
      <p className="mt-3 text-center text-[11px] text-white/70">{riskDisclaimer}</p>

      <div className="mt-4 rounded-2xl bg-white p-4 text-ink">
        {phase === "proposal" ? (
          <>
            <h3 className="text-center text-lg font-bold">{trade.ticker} coincide con la estrategia del bot</h3>
            <div className="mt-3 rounded-xl bg-neutral-100 p-4 text-base">
              {[
                ["Entrada", trade.entry],
                ["Stop", trade.stop],
                ["Objetivo", trade.target],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between py-1">
                  <span>{k}</span>
                  <span className="font-bold">${(v as number).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                onClick={() => setPhase("result")}
                className="rounded-xl bg-rose-300 py-3 text-lg font-semibold"
              >
                Rechazar
              </button>
              <button
                onClick={() => setPhase("result")}
                className="rounded-xl bg-accent py-3 text-lg font-bold shadow-lg shadow-accent/40"
              >
                Aprobar
              </button>
            </div>
            <p className="mt-3 text-center text-xs font-semibold text-neutral-500">Toca para probar ↑</p>
          </>
        ) : (
          <>
            <div className="rounded-xl bg-neutral-100 p-3">
              <svg viewBox="0 0 300 110" className="w-full">
                <path d="M5 40 L60 42 L100 45 L130 80 L150 95 L175 70 L210 60 L240 62 L270 25 L290 10" fill="none" stroke="#10b981" strokeWidth="3" />
                <circle cx="290" cy="10" r="5" fill="#10b981" />
                <text x="215" y="30" fontSize="13" fontWeight="700" fill="#059669">${trade.target.toFixed(2)}</text>
              </svg>
            </div>
            <p className="mt-3 text-center text-4xl font-extrabold text-emerald-600">+${gain}</p>
            <p className="text-center text-sm">Ganancia estimada en el objetivo (simulación)</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-neutral-100 py-2"><b className="block text-base text-emerald-600">${trade.target.toFixed(2)}</b>Objetivo</div>
              <div className="rounded-lg bg-neutral-100 py-2"><b className="block text-base text-rose-500">${trade.stop.toFixed(2)}</b>Stop</div>
              <div className="rounded-lg bg-neutral-100 py-2"><b className="block text-base">${trade.entry.toFixed(2)}</b>Entrada</div>
            </div>
          </>
        )}
      </div>

      {phase === "result" && (
        <FooterBar>
          <PrimaryButton onClick={ctx.next}>Ahora pruébalo de verdad</PrimaryButton>
        </FooterBar>
      )}
    </div>
  );
}
