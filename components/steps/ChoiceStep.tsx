"use client";

import OptionCard from "@/components/ui/OptionCard";
import PrimaryButton from "@/components/ui/PrimaryButton";
import FooterBar from "@/components/ui/FooterBar";
import type { ChoiceStep as ChoiceStepData } from "@/lib/steps";
import type { FlowCtx } from "@/components/quiz/types";

export default function ChoiceStep({ step, ctx }: { step: ChoiceStepData; ctx: FlowCtx }) {
  const selected = ctx.answers.choices[step.id] ?? [];

  const toggle = (label: string) => {
    if (step.multi) {
      const next = selected.includes(label) ? selected.filter((l) => l !== label) : [...selected, label];
      ctx.setChoice(step.id, next);
      return;
    }
    ctx.setChoice(step.id, [label]);
    // Respuesta única: avanza sola después de un instante para que se vea la selección.
    setTimeout(ctx.next, 220);
  };

  const two = step.multi && step.options.length >= 4;

  return (
    <div className="mx-auto w-full max-w-3xl animate-rise px-4 pb-32 pt-8">
      <h2 className="mx-auto max-w-xl text-center text-2xl font-bold leading-snug">{step.title}</h2>
      {step.subtitle && <p className="mt-2 text-center text-sm text-white/80">{step.subtitle}</p>}

      <div className={`mx-auto mt-6 grid gap-3 ${two ? "sm:grid-cols-2" : "max-w-xl"}`}>
        {step.options.map((o) => (
          <OptionCard
            key={o.label}
            emoji={o.emoji}
            label={o.label}
            selected={selected.includes(o.label)}
            onClick={() => toggle(o.label)}
          />
        ))}
      </div>

      {step.multi && (
        <FooterBar>
          <PrimaryButton disabled={selected.length === 0} onClick={ctx.next}>
            Siguiente paso
          </PrimaryButton>
        </FooterBar>
      )}
    </div>
  );
}
