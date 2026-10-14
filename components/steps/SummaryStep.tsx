"use client";

import PrimaryButton from "@/components/ui/PrimaryButton";
import FooterBar from "@/components/ui/FooterBar";
import type { FlowCtx } from "@/components/quiz/types";

function confidence(decisiones: string | undefined, hasTraded: string) {
  let score = 1;
  if (decisiones === "A veces") score = 1.5;
  if (decisiones === "Para nada") score = 2.4;
  if (hasTraded === "si") score += 0.4;
  if (score < 1.7) return { label: "Baja", pos: 16, note: "Poca experiencia operando y comprensión limitada del mercado" };
  if (score < 2.3) return { label: "Media", pos: 50, note: "Ya tienes una base, falta estructura y práctica" };
  return { label: "Alta", pos: 84, note: "Buena base: toca afinar tu estrategia" };
}

export default function SummaryStep({ ctx }: { ctx: FlowCtx }) {
  const c = ctx.answers.choices;
  const conf = confidence(c["decisiones"]?.[0], ctx.answers.hasTraded);

  const rows = [
    { icon: "🎯", title: "Motivación", value: c["celebrar"]?.[0] ?? "—" },
    { icon: "🧠", title: "Mentalidad", value: c["decisiones"]?.[0] === "Para nada" ? "Decidido" : "Equilibrado" },
    { icon: "⚖️", title: "Tolerancia al riesgo", value: c["riesgo"]?.[0] ?? "—" },
  ];

  return (
    <div className="mx-auto w-full max-w-md animate-rise px-4 pb-32 pt-6">
      <div className="rounded-2xl bg-panel p-5">
        <h2 className="text-center text-xl font-bold">Tu resumen personal</h2>
        <p className="mt-3 text-center text-sm text-white/80">
          El cuestionario indica que tu barrera actual para operar podría ser la falta de claridad y de
          confianza.
        </p>

        <div className="mt-5 rounded-xl bg-card p-4 text-center">
          <p className="text-sm font-semibold">Confianza al operar</p>
          <p className="mt-4 text-4xl font-extrabold">{conf.label}</p>
          <div className="relative mt-3">
            <div className="flex h-2 overflow-hidden rounded-full">
              <div className="w-1/3 bg-danger" />
              <div className="w-1/3 bg-warn" />
              <div className="w-1/3 bg-good" />
            </div>
            <span
              className="absolute -top-1 h-4 w-1.5 -translate-x-1/2 rounded bg-ink ring-1 ring-white/60"
              style={{ left: `${conf.pos}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[11px] text-white/80">
            <span>Baja</span>
            <span>Media</span>
            <span>Alta</span>
          </div>
          <p className="mt-4 rounded-lg border border-danger/70 px-3 py-2 text-left text-xs font-bold text-danger">
            ⚠ {conf.note}
          </p>
        </div>

        <ul className="mt-4 space-y-2">
          {rows.map((r) => (
            <li key={r.title} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-card text-xl">{r.icon}</span>
              <div>
                <p className="text-xs text-white/80">{r.title}</p>
                <p className="text-sm font-bold">{r.value}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <FooterBar>
        <PrimaryButton onClick={ctx.next}>Continuar</PrimaryButton>
      </FooterBar>
    </div>
  );
}
