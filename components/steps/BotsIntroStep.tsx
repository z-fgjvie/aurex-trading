"use client";

import BotAvatar from "@/components/ui/BotAvatar";
import PrimaryButton from "@/components/ui/PrimaryButton";
import FooterBar from "@/components/ui/FooterBar";
import { bots, botPickCopy } from "@/lib/steps";
import type { FlowCtx } from "@/components/quiz/types";

export default function BotsIntroStep({ ctx }: { ctx: FlowCtx }) {
  return (
    <div className="mx-auto w-full max-w-md animate-rise px-4 pb-32 pt-8 text-center">
      <h2 className="text-2xl font-bold">{botPickCopy.intro}</h2>
      <p className="mt-3 text-sm text-white/80">{botPickCopy.introBody}</p>
      <div className="mt-8 grid grid-cols-2 gap-2 rounded-2xl bg-gradient-to-b from-panel to-ink p-4">
        {bots.map((b) => (
          <div key={b.id} className="flex flex-col items-center">
            <BotAvatar color={b.color} size={96} />
            <span className="text-xs font-semibold">{b.name}</span>
          </div>
        ))}
      </div>
      <FooterBar>
        <PrimaryButton onClick={ctx.next}>Continuar</PrimaryButton>
      </FooterBar>
    </div>
  );
}
