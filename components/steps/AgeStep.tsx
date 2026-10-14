"use client";

import BotAvatar from "@/components/ui/BotAvatar";
import PrimaryButton from "@/components/ui/PrimaryButton";
import FooterBar from "@/components/ui/FooterBar";
import type { FlowCtx } from "@/components/quiz/types";

export default function AgeStep({ ctx }: { ctx: FlowCtx }) {
  const age = Number(ctx.answers.age);
  const valid = Number.isInteger(age) && age >= 18 && age <= 99;
  const tooYoung = ctx.answers.age !== "" && age < 18;

  return (
    <div className="mx-auto w-full max-w-md animate-rise px-4 pb-32 pt-8 text-center">
      <h2 className="text-2xl font-bold">¿Cuál es tu edad?</h2>
      <input
        inputMode="numeric"
        value={ctx.answers.age}
        onChange={(e) => ctx.update({ age: e.target.value.replace(/\D/g, "").slice(0, 2) })}
        placeholder="Ingresa tu edad"
        className="mt-5 w-full rounded-lg border border-transparent bg-panel px-4 py-3 text-center text-sm outline-none placeholder:text-white/60 focus:border-accent"
      />
      {tooYoung && <p className="mt-2 text-xs text-danger">Este programa es solo para mayores de 18 años.</p>}
      <div className="mt-8 flex justify-center">
        <BotAvatar color="#5eead4" size={230} />
      </div>
      <FooterBar>
        <PrimaryButton disabled={!valid} onClick={ctx.next}>
          Continuar
        </PrimaryButton>
      </FooterBar>
    </div>
  );
}
