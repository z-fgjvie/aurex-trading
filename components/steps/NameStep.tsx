"use client";

import PrimaryButton from "@/components/ui/PrimaryButton";
import FooterBar from "@/components/ui/FooterBar";
import type { FlowCtx } from "@/components/quiz/types";

export default function NameStep({ ctx }: { ctx: FlowCtx }) {
  const valid = ctx.answers.name.trim().length >= 2;

  return (
    <div className="mx-auto w-full max-w-md animate-rise px-4 pb-32 pt-10 text-center">
      <h2 className="text-2xl font-bold leading-snug">
        ¡Tu <span className="text-accent">bot de trading con IA</span>
        <br />
        está listo!
      </h2>
      <p className="mt-6 text-sm">¿Cómo deberíamos llamarte?</p>
      <input
        value={ctx.answers.name}
        onChange={(e) => ctx.update({ name: e.target.value.slice(0, 30) })}
        placeholder="Tu nombre"
        className="mt-3 w-full rounded-lg border border-transparent bg-panel px-4 py-3 text-center text-sm outline-none placeholder:text-white/60 focus:border-accent"
      />
      <FooterBar>
        <PrimaryButton disabled={!valid} onClick={ctx.next}>
          Ver mi bot en acción
        </PrimaryButton>
      </FooterBar>
    </div>
  );
}
