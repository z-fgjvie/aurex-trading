"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "@/components/ui/Header";
import { steps } from "@/lib/steps";
import { emptyAnswers, type Answers, type FlowCtx } from "./types";
import WelcomeStep from "@/components/steps/WelcomeStep";
import ChoiceStep from "@/components/steps/ChoiceStep";
import InfoStep from "@/components/steps/InfoStep";
import AgeStep from "@/components/steps/AgeStep";
import LoadingStep from "@/components/steps/LoadingStep";
import ChallengeStep from "@/components/steps/ChallengeStep";
import SummaryStep from "@/components/steps/SummaryStep";
import BotsIntroStep from "@/components/steps/BotsIntroStep";
import BotPickStep from "@/components/steps/BotPickStep";
import BotDetailStep from "@/components/steps/BotDetailStep";
import EmailStep from "@/components/steps/EmailStep";
import NameStep from "@/components/steps/NameStep";
import DemoStep from "@/components/steps/DemoStep";
import OfferStep from "@/components/steps/OfferStep";

const choiceIndexes = steps.map((s, i) => (s.type === "choice" ? i : -1)).filter((i) => i >= 0);

export default function QuizFlow() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, steps.length - 1)), []);
  const update = useCallback((patch: Partial<Answers>) => setAnswers((a) => ({ ...a, ...patch })), []);
  const setChoice = useCallback(
    (stepId: string, values: string[]) =>
      setAnswers((a) => ({ ...a, choices: { ...a.choices, [stepId]: values } })),
    []
  );

  const ctx: FlowCtx = useMemo(() => ({ answers, update, setChoice, next }), [answers, update, setChoice, next]);

  const step = steps[index];

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [index]);

  // La barra de progreso solo aparece en las preguntas.
  const progress =
    step.type === "choice" ? (choiceIndexes.indexOf(index) + 1) / (choiceIndexes.length + 1) : undefined;

  return (
    <>
      <Header progress={progress} />
      <main>
        {step.type === "welcome" && <WelcomeStep ctx={ctx} />}
        {step.type === "choice" && <ChoiceStep key={step.id} step={step} ctx={ctx} />}
        {step.type === "info" && <InfoStep key={step.id} step={step} ctx={ctx} />}
        {step.type === "age" && <AgeStep ctx={ctx} />}
        {step.type === "loading" && <LoadingStep ctx={ctx} />}
        {step.type === "challenge" && <ChallengeStep ctx={ctx} />}
        {step.type === "summary" && <SummaryStep ctx={ctx} />}
        {step.type === "botsIntro" && <BotsIntroStep ctx={ctx} />}
        {step.type === "botPick" && <BotPickStep ctx={ctx} />}
        {step.type === "botDetail" && <BotDetailStep ctx={ctx} />}
        {step.type === "email" && <EmailStep ctx={ctx} />}
        {step.type === "name" && <NameStep ctx={ctx} />}
        {step.type === "demo" && <DemoStep ctx={ctx} />}
        {step.type === "offer" && <OfferStep ctx={ctx} />}
      </main>
    </>
  );
}
