"use client";

import BotAvatar from "@/components/ui/BotAvatar";
import BotStats from "@/components/ui/BotStats";
import PrimaryButton from "@/components/ui/PrimaryButton";
import FooterBar from "@/components/ui/FooterBar";
import { bots } from "@/lib/steps";
import type { FlowCtx } from "@/components/quiz/types";

export default function BotDetailStep({ ctx }: { ctx: FlowCtx }) {
  const bot = bots.find((b) => b.id === ctx.answers.botId) ?? bots[0];

  return (
    <div className="mx-auto w-full max-w-md animate-rise px-4 pb-32 pt-6">
      <div className="flex items-center gap-3">
        <BotAvatar color={bot.color} size={52} />
        <h2 className="text-xl font-bold">{bot.name}</h2>
      </div>

      <h3 className="mt-6 text-sm font-bold">Descripción</h3>
      <p className="mt-2 rounded-lg bg-panel p-4 text-sm leading-relaxed text-white/90">{bot.description}</p>

      <h3 className="mt-6 text-sm font-bold">Estilo de trading</h3>
      <div className="mt-2 rounded-lg bg-panel p-4">
        <BotStats bot={bot} />
      </div>

      <h3 className="mt-6 text-sm font-bold">Cómo rastrea</h3>
      <p className="mt-2 rounded-lg bg-panel p-4 text-sm leading-relaxed text-white/90">{bot.tracking}</p>

      <FooterBar>
        <PrimaryButton onClick={ctx.next}>Iniciar el bot</PrimaryButton>
      </FooterBar>
    </div>
  );
}
