"use client";

import Art from "@/components/ui/Art";
import PrimaryButton from "@/components/ui/PrimaryButton";
import FooterBar from "@/components/ui/FooterBar";
import type { InfoStep as InfoStepData } from "@/lib/steps";
import type { FlowCtx } from "@/components/quiz/types";

export default function InfoStep({ step, ctx }: { step: InfoStepData; ctx: FlowCtx }) {
  return (
    <div className="mx-auto flex w-full max-w-4xl animate-rise flex-col items-center gap-8 px-5 pb-32 pt-12 md:min-h-[70vh] md:flex-row md:justify-center">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold">{step.title}</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-white/85">
          {step.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
      <div className="w-full max-w-xs shrink-0 md:max-w-sm">
        <Art kind={step.art} />
      </div>
      <FooterBar>
        <PrimaryButton onClick={ctx.next}>Continuar</PrimaryButton>
      </FooterBar>
    </div>
  );
}
