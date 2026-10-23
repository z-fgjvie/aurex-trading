"use client";

import Link from "next/link";
import BotAvatar from "@/components/ui/BotAvatar";
import { useDemo } from "@/components/panel/DemoProvider";
import { Card, Meter, PageTitle, SimTag } from "@/components/panel/ui";
import { botTaglines } from "@/lib/landing";
import { bots } from "@/lib/steps";
import type { BotId } from "@/lib/sim";

export function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={onClick} className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-brand" : "bg-edge"}`}>
      <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

export default function BotsView() {
  const { acc, toggleBot } = useDemo();
  return (
    <>
      <PageTitle title="Tienda de bots" sub="Elige con qué estilo quieres practicar. Los bots solo proponen y explican: tú decides cada operación." right={<SimTag>Bots de práctica</SimTag>} />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {bots.map((b) => {
          const on = acc.activeBots.includes(b.id as BotId);
          const mine = acc.orders.filter((o) => o.botId === b.id && o.side === "venta");
          const pnl = mine.reduce((s, o) => s + (o.pnl ?? 0), 0);
          return (
            <Card as="article" key={b.id} className="flex flex-col p-5">
              <div className="relative grid place-items-center rounded-xl py-4" style={{ background: `color-mix(in srgb, ${b.color} 14%, transparent)` }}>
                <BotAvatar color={b.color} size={104} />
                {on && <span className="absolute right-2.5 top-2.5 rounded-full bg-up px-2.5 py-1 text-[11px] font-bold text-[#04161c]">ACTIVO</span>}
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold">{b.name}</h2>
              <p className="text-[14.5px] text-muted">{botTaglines[b.id]}</p>
              <div className="mt-4 space-y-3">
                <Meter label="Actividad" value={b.activity.label} level={b.activity.level} color={b.color} />
                <Meter label="Riesgo" value={b.risk.label} level={b.risk.level} color={b.color} />
                <Meter label="Volatilidad" value={b.volatility.label} level={b.volatility.level} color={b.color} />
              </div>
              <p className="mt-4 text-[13px] text-muted">{mine.length ? `${mine.length} operaciones cerradas (simuladas)` : "Sin operaciones cerradas todavía"}</p>
              {mine.length > 0 && <p className={`tabnum text-[14px] font-semibold ${pnl >= 0 ? "text-up" : "text-down"}`}>{pnl >= 0 ? "+" : "−"}${Math.abs(pnl).toFixed(2)} simulados</p>}
              <div className="mt-auto flex items-center gap-3 pt-5">
                <Link href={`/panel/bots/${b.id}`} className="btn-ghost flex-1 !py-2.5">
                  Ver detalle
                </Link>
                <Toggle on={on} onClick={() => toggleBot(b.id as BotId)} label={`${on ? "Apagar" : "Encender"} ${b.name}`} />
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
