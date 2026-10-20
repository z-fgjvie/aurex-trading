"use client";

import { useEffect, useState } from "react";
import BotAvatar from "@/components/ui/BotAvatar";
import Testimonials from "@/components/ui/Testimonials";
import { bots } from "@/lib/steps";
import {
  brand,
  currency,
  currencyLabel,
  discountPercent,
  offerCountdownSeconds,
  plans,
  riskDisclaimer,
  showCountdown,
  showDiscount,
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
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { mm, ss } = useCountdown(offerCountdownSeconds);
  const plan = plans.find((p) => p.id === planId) ?? plans[1];

  const pay = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          botId: bot.id,
          email: ctx.answers.email,
          name: ctx.answers.name,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "No pudimos iniciar el pago.");
      window.location.href = data.url; // pasa a la página segura de pago de Stripe
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos iniciar el pago.");
      setLoading(false);
    }
  };

  return (
    <div className="animate-rise pb-16">
      <div className="bg-gradient-to-b from-accent-deep to-ink px-4 pb-10 pt-6 text-center">
        {showDiscount && (
          <p className="text-xs">
            🎁 Descuento de bienvenida:{" "}
            <span className="rounded bg-danger px-1.5 py-0.5 font-bold">{discountPercent}%</span>
          </p>
        )}
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

        {showCountdown && (
          <div className="mt-5 rounded-xl border border-accent/60 bg-accent/10 p-3">
            <p className="text-center text-sm font-semibold">🏷️ Tu oferta termina en</p>
            <div className="mt-2 text-center">
              <span className="rounded-lg bg-accent-deep px-3 py-2 text-lg font-bold tabular-nums">{mm} : {ss}</span>
            </div>
          </div>
        )}
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
                {p.label}
                {showDiscount && (
                  <span className="ml-2 rounded bg-accent px-1 text-[10px] text-ink">{discountPercent}% OFF</span>
                )}
              </p>
              <p className="mt-3 rounded-lg bg-card py-3 text-center text-xl font-bold">
                {currency}
                {p.price.toFixed(2)} <span className="text-xs font-normal text-white/70">{currencyLabel}</span>
                {showDiscount && p.oldPrice && (
                  <span className="ml-1 text-xs font-normal text-white/60 line-through">
                    {currency}
                    {p.oldPrice.toFixed(2)}
                  </span>
                )}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mx-auto mt-6 w-full max-w-md px-4 text-center">
        <p className="rounded-lg border border-line p-3 text-[11px] leading-relaxed text-white/80">
          Pago único de {currency}
          {plan.price.toFixed(2)} {currencyLabel} por el {plan.label.toLowerCase()}. No se renueva automáticamente.
          Pagas en la página segura de Stripe: no guardamos los datos de tu tarjeta.
        </p>

        <label className="mt-4 flex items-start gap-3 text-left text-[12px] text-white/85">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[#5eead4]"
          />
          <span>
            Acepto los{" "}
            <a href="#" className="text-sky-400 underline">términos y condiciones</a> y la{" "}
            <a href="#" className="text-sky-400 underline">política de reembolso</a>.
          </span>
        </label>

        <button
          onClick={pay}
          disabled={!accepted || loading}
          className={`mt-4 w-full rounded-lg py-4 text-sm font-bold uppercase text-ink transition ${
            !accepted || loading ? "cursor-not-allowed bg-accent-deep/80 text-ink/70" : "bg-accent hover:bg-accent-dark"
          }`}
        >
          {loading ? "Abriendo el pago seguro…" : "Activar mi bot"}
        </button>
        {error && <p className="mt-3 text-xs text-danger">{error}</p>}

        <p className="mt-4 text-[11px] text-white/70">{riskDisclaimer}</p>
        <p className="mt-2 text-[10px] text-white/50">{brand.company}</p>
      </div>

      <div className="mt-10 px-4">
        <Testimonials />
      </div>
    </div>
  );
}
