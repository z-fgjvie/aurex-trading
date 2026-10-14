"use client";

import BotAvatar from "@/components/ui/BotAvatar";
import BotStats from "@/components/ui/BotStats";
import PrimaryButton from "@/components/ui/PrimaryButton";
import FooterBar from "@/components/ui/FooterBar";
import { bots } from "@/lib/steps";
import type { FlowCtx } from "@/components/quiz/types";

// Recomienda un bot según la respuesta de riesgo.
export function recommendedBotId(riesgo: string | undefined): string {
  switch (riesgo) {
    case "Claro que sí":
      return "impulso";
    case "Prefiero un riesgo equilibrado":
      return "equilibrio";
    case "No, voy a lo seguro":
      return "guardian";
    default:
      return "camaleon";
  }
}

export default function BotPickStep({ ctx }: { ctx: FlowCtx }) {
  const recId = recommendedBotId(ctx.answers.choices["riesgo"]?.[0]);
  const ordered = [...bots].sort((a, b) => (a.id === recId ? -1 : b.id === recId ? 1 : 0));
  const selected = ctx.answers.botId || recId;

  return (
    <div className="mx-auto w-full max-w-md animate-rise px-4 pb-32 pt-6">
      <h2 className="text-center text-2xl font-bold">Elige tu bot de IA</h2>
      <p className="mt-2 text-center text-sm text-white/80">
        Elige cualquiera de los bots. Puedes cambiar de configuración en cualquier momento.
      </p>

      <div className="mt-5 space-y-3">
        {ordered.map((b) => {
          const active = selected === b.id;
          return (
            <button
              key={b.id}
              onClick={() => ctx.update({ botId: b.id })}
              className={`block w-full overflow-hidden rounded-lg border text-left ${
                active ? "" : "border-line"
              }`}
              style={active ? { borderColor: b.color } : undefined}
            >
              {b.id === recId && (
                <div className="py-1 text-center text-[10px] font-bold uppercase text-ink" style={{ background: b.color }}>
                  👍 Coincide con tus filtros
                </div>
              )}
              <div className="flex items-center gap-3 bg-ink p-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="h-4 w-4 rounded-full border-2"
                      style={{ borderColor: b.color, background: active ? b.color : "transparent" }}
                    />
                    <span className="text-sm font-bold">{b.name}</span>
                  </div>
                  <BotStats bot={b} />
                </div>
                <div className="rounded-lg bg-card p-1">
                  <BotAvatar color={b.color} size={80} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <FooterBar>
        <PrimaryButton
          onClick={() => {
            ctx.update({ botId: selected });
            ctx.next();
          }}
        >
          Continuar
        </PrimaryButton>
      </FooterBar>
    </div>
  );
}
