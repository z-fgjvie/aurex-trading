"use client";

import PrimaryButton from "@/components/ui/PrimaryButton";
import FooterBar from "@/components/ui/FooterBar";
import type { FlowCtx } from "@/components/quiz/types";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function EmailStep({ ctx }: { ctx: FlowCtx }) {
  const valid = emailRe.test(ctx.answers.email.trim());

  const submit = () => {
    // TODO: aquí conecta tu backend / CRM / lista de correo (ej. POST /api/lead).
    ctx.next();
  };

  return (
    <div className="mx-auto w-full max-w-lg animate-rise px-4 pb-32 pt-10">
      <h2 className="text-center text-2xl font-bold leading-snug">
        Ingresa tu correo para obtener tu
        <br />
        <span className="text-accent">bot de trading con IA</span>
      </h2>

      <label className="mt-10 flex items-center gap-3 rounded-lg border border-transparent bg-panel px-4 py-3 focus-within:border-accent">
        <span aria-hidden>✉️</span>
        <input
          type="email"
          autoComplete="email"
          value={ctx.answers.email}
          onChange={(e) => ctx.update({ email: e.target.value })}
          placeholder="Tu correo electrónico"
          className="w-full bg-transparent text-sm outline-none placeholder:text-white/60"
        />
      </label>

      <p className="mt-3 flex gap-2 text-[11px] leading-relaxed text-white/80">
        <span>🔒</span>
        <span>
          Respetamos tu privacidad y nos comprometemos a proteger tus datos personales. Tus datos serán
          tratados de acuerdo con nuestra{" "}
          <a href="#" className="font-semibold underline">
            Política de Privacidad
          </a>
          .
        </span>
      </p>

      <div className="mt-4 flex items-center gap-4 rounded-lg bg-[#16231f] p-4">
        <span className="text-4xl">🎁</span>
        <p className="text-sm font-semibold">
          Asegúrate de que tu correo sea válido, no te pierdas tu <span className="text-accent">BONO</span>
        </p>
      </div>

      <FooterBar>
        <PrimaryButton disabled={!valid} onClick={submit}>
          Continuar
        </PrimaryButton>
      </FooterBar>
    </div>
  );
}
