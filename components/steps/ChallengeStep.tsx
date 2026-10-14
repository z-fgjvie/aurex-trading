"use client";

import PrimaryButton from "@/components/ui/PrimaryButton";
import FooterBar from "@/components/ui/FooterBar";
import { riskDisclaimer } from "@/lib/config";
import type { FlowCtx } from "@/components/quiz/types";

const now = [
  "Incertidumbre en tus decisiones",
  "Horas mirando gráficas",
  "Miedo a perder oportunidades",
  "Conocimiento limitado del mercado",
];
const goal = [
  "Mentalidad de trader sostenible",
  "Rutina diaria constante",
  "Práctica guiada sin riesgo",
  "Bases sólidas del mercado",
];

function targetDate() {
  const d = new Date();
  d.setDate(d.getDate() + 28);
  return d.toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" });
}

export default function ChallengeStep({ ctx }: { ctx: FlowCtx }) {
  return (
    <div className="mx-auto w-full max-w-md animate-rise px-4 pb-32 pt-6">
      <div className="rounded-2xl bg-panel p-5 text-center">
        <h2 className="text-xl font-bold">
          Tu reto personal
          <br />
          de Trader con IA
        </h2>
        <p className="mt-3 text-xs text-white/80">
          Según tus respuestas, esperamos que construyas las habilidades de
        </p>
        <p className="mt-1 text-sm font-semibold underline">Trader con IA para el {targetDate()}</p>

        <div className="mt-6 grid grid-cols-2 gap-3 text-left text-sm">
          <div className="rounded-xl border border-danger/70 bg-danger/10 p-3">
            <p className="mb-2 font-bold">Tú ahora:</p>
            {now.map((t) => (
              <p key={t} className="border-t border-danger/40 py-2">
                {t}
              </p>
            ))}
          </div>
          <div className="rounded-xl border border-good/70 bg-good/10 p-3">
            <p className="mb-2 font-bold">Tu meta:</p>
            {goal.map((t) => (
              <p key={t} className="border-t border-good/40 py-2">
                {t}
              </p>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-white/70">*{riskDisclaimer}</p>
      <FooterBar>
        <PrimaryButton onClick={ctx.next}>Continuar</PrimaryButton>
      </FooterBar>
    </div>
  );
}
