"use client";

import { useEffect, useState } from "react";
import BotAvatar from "@/components/ui/BotAvatar";
import Testimonials from "@/components/ui/Testimonials";
import { bots } from "@/lib/steps";
import {
  brand,
  currency,
  discountPercent,
  offerCountdownSeconds,
  plans,
  riskDisclaimer,
} from "@/lib/config";
import type { FlowCtx } from "@/components/quiz/types";

function useCountdown(total: number) {
  const [left, setLeft] = useState(total);
  useEffect(() => {
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return { mm, ss };
}

export default function OfferStep({ ctx }: { ctx: FlowCtx }) {
  const bot = bots.find((b) => b.id === ctx.answers.botId) ?? bots[0];
  const [planId, setPlanId] = useState("w4");
  const [modal, setModal] = useState(false);
  const { mm, ss } = useCountdown(offerCountdownSeconds);
  const plan = plans.find((p) => p.id === planId) ?? plans[1];
  const saved = plan.oldPrice - plan.price;

  return (
    <div className="animate-rise pb-16">
      <div className="bg-gradient-to-b from-accent-deep to-ink px-4 pb-10 pt-6 text-center">
        <p className="text-xs">
          🎁 Descuento de bienvenida:{" "}
          <span className="rounded bg-danger px-1.5 py-0.5 font-bold">{discountPercent}%</span>
        </p>
        <h2 className="mt-2 text-xl font-bold">
          Empieza el trading con IA
          <br />
          en {brand.name}
        </h2>
        <p className="mt-2 inline-block rounded bg-accent px-2 py-0.5 text-[11px] font-semibold text-ink">
          ¡Haz tu primera práctica hoy!
        </p>
      </div>

      <div className="mx-auto w-full max-w-md px-4">
        <div className="rounded-xl bg-panel">
          <div className="flex items-center gap-3 border-b border-line p-4">
            <BotAvatar color={bot.color} size={48} />
            <span className="font-bold">{bot.name}</span>
          </div>
          <div className="space-y-1 p-4 text-xs">
            <p className="flex justify-between"><span>Operaciones por día:</span><b>HASTA 8</b></p>
            <p className="flex justify-between"><span>Activos en seguimiento:</span><b>POR SELECCIONAR</b></p>
            <p className="flex justify-between"><span>Estado:</span><b className="text-danger">NO ACTIVADO</b></p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-accent/60 bg-accent/10 p-3">
          <p className="text-center text-sm font-semibold">🏷️ ¡Tu código promocional se aplicó!</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-accent bg-ink px-3 py-2 text-xs">✓ AUREX{discountPercent}</div>
            <div className="rounded-lg bg-accent-deep px-3 py-2 text-lg font-bold tabular-nums">{mm} : {ss}</div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 grid w-full max-w-3xl gap-3 px-4 sm:grid-cols-3">
        {plans.map((p) => {
          const active = p.id === planId;
          return (
            <button
              key={p.id}
              onClick={() => setPlanId(p.id)}
              className={`relative rounded-xl border p-4 text-left ${
                active ? "border-accent bg-panel" : "border-line bg-ink"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded bg-accent px-2 py-0.5 text-[10px] font-bold text-ink">
                  👍 MÁS POPULAR
                </span>
              )}
              <p className="text-sm font-bold">
                {p.label}{" "}
                <span className="ml-1 rounded bg-accent px-1 text-[10px] text-ink">{discountPercent}% OFF</span>
              </p>
              <p className="mt-3 rounded-lg bg-card py-3 text-center text-xl font-bold">
                {currency}
                {p.price.toFixed(2)}{" "}
                <span className="text-xs font-normal text-white/60 line-through">
                  {currency}
                  {p.oldPrice.toFixed(2)}
                </span>
              </p>
            </button>
          );
        })}
      </div>

      <div className="mx-auto mt-6 w-full max-w-md px-4 text-center">
        <p className="rounded-lg border border-line p-3 text-[11px] leading-relaxed text-white/80">
          Al hacer clic en Activar mi bot, aceptas pagar {currency}
          {plan.price.toFixed(2)} por el {plan.label.toLowerCase()}. {/* TODO: define aquí tus condiciones reales de renovación y cancelación. */}
        </p>
        <button
          onClick={() => setModal(true)}
          className="mt-4 w-full rounded-lg bg-accent py-4 text-sm font-bold uppercase text-ink hover:bg-accent-dark"
        >
          Activar mi bot
        </button>
        <p className="mt-4 text-[11px] text-white/70">{riskDisclaimer}</p>
        <p className="mt-2 text-[10px] text-white/50">{brand.company}</p>
      </div>

      <div className="mt-10 px-4">
        <Testimonials />
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/70" onClick={() => setModal(false)}>
          <div
            className="h-full w-full max-w-sm overflow-y-auto bg-ink p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <button aria-label="Cerrar" onClick={() => setModal(false)} className="text-lg">
                ✕
              </button>
              <h3 className="text-sm font-bold">Resumen de pago</h3>
              <span className="w-5" />
            </div>

            <div className="mt-4 rounded-lg bg-danger/90 p-3 text-center text-xs font-bold">
              ⏱ Tu descuento está reservado por {mm}:{ss} min
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <p className="flex justify-between"><span>Reto de trading con IA</span><b>{currency}{plan.oldPrice.toFixed(2)}</b></p>
              <p className="flex justify-between text-danger"><span>{discountPercent}% de descuento</span><b>-{currency}{saved.toFixed(2)}</b></p>
            </div>
            <div className="mt-3 border-t border-line pt-3">
              <p className="flex justify-between text-sm font-bold"><span>Total</span><span>{currency}{plan.price.toFixed(2)}</span></p>
              <p className="mt-1 text-right text-[11px] text-danger">
                Acabas de ahorrar {currency}{saved.toFixed(2)} ({discountPercent}% de descuento)
              </p>
            </div>

            <div className="mt-5 rounded-lg border border-dashed border-line p-4 text-center text-xs text-white/70">
              Pasarela de pago de demostración.
              <br />
              Conecta aquí tu proveedor (Stripe, Niubiz, Culqi, Mercado Pago…). Esta pantalla no procesa pagos
              ni solicita datos de tarjeta.
            </div>

            <button disabled className="mt-4 w-full cursor-not-allowed rounded-lg bg-accent-deep/80 py-3 text-xs font-bold uppercase text-ink/70">
              🔒 Confirmar pago (demo)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
