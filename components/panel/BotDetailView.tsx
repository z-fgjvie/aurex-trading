"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import BotAvatar from "@/components/ui/BotAvatar";
import { Toggle } from "@/components/panel/BotsView";
import { useDemo } from "@/components/panel/DemoProvider";
import ProposalCard from "@/components/panel/ProposalCard";
import { Card, CardHead, Delta, Empty, Meter, SimTag, timeAgo } from "@/components/panel/ui";
import { botTaglines } from "@/lib/landing";
import { fmtPrice, type BotId } from "@/lib/sim";
import { bots } from "@/lib/steps";

export default function BotDetailView({ id }: { id: string }) {
  const { acc, toggleBot, now } = useDemo();
  const bot = bots.find((b) => b.id === id);
  if (!bot) notFound();
  const on = acc.activeBots.includes(bot.id as BotId);
  const closed = acc.orders.filter((o) => o.botId === bot.id && o.side === "venta");
  const wins = closed.filter((o) => (o.pnl ?? 0) > 0).length;
  const total = closed.reduce((s, o) => s + (o.pnl ?? 0), 0);
  const pending = acc.proposals.filter((p) => p.botId === bot.id && p.status === "pendiente" && p.expiresAt > now);
  const orders = acc.orders.filter((o) => o.botId === bot.id);

  return (
    <div className="space-y-6">
      <Link href="/panel/bots" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-muted hover:text-fg">
        ← Todos los bots
      </Link>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8" style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${bot.color} 20%, transparent), transparent 70%)` }}>
          <div className="grid h-28 w-28 shrink-0 place-items-center rounded-2xl bg-surface/60">
            <BotAvatar color={bot.color} size={96} />
          </div>
          <div className="min-w-0 flex-1">
            <SimTag>Bot de práctica</SimTag>
            <h1 className="mt-2 font-display text-[1.9rem] font-semibold leading-tight">{bot.name}</h1>
            <p className="text-[15px] text-muted">{botTaglines[bot.id]}</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3">
            <span className="text-[14px] font-semibold">{on ? "Activo" : "Apagado"}</span>
            <Toggle on={on} onClick={() => toggleBot(bot.id as BotId)} label={`${on ? "Apagar" : "Encender"} ${bot.name}`} />
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5">
          <CardHead title="Rendimiento simulado" />
          <p className={`tabnum mt-3 font-display text-3xl font-semibold ${total >= 0 ? "text-up" : "text-down"}`}>{total >= 0 ? "+" : "−"}${Math.abs(total).toFixed(2)}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-[13.5px]">
            <div className="rounded-xl bg-surface2 p-3">
              <dt className="text-muted">Operaciones cerradas</dt>
              <dd className="tabnum text-lg font-bold">{closed.length}</dd>
            </div>
            <div className="rounded-xl bg-surface2 p-3">
              <dt className="text-muted">Acertadas</dt>
              <dd className="tabnum text-lg font-bold">{closed.length ? `${wins} / ${closed.length}` : "—"}</dd>
            </div>
          </dl>
          <p className="mt-3 text-[12.5px] leading-relaxed text-muted">Resultados de una simulación con datos ficticios. No indican resultados futuros ni reales.</p>
        </Card>
        <Card className="p-5">
          <CardHead title="Perfil del bot" />
          <div className="mt-4 space-y-3">
            <Meter label="Actividad" value={bot.activity.label} level={bot.activity.level} color={bot.color} />
            <Meter label="Riesgo" value={bot.risk.label} level={bot.risk.level} color={bot.color} />
            <Meter label="Volatilidad" value={bot.volatility.label} level={bot.volatility.level} color={bot.color} />
          </div>
        </Card>
        <Card className="p-5">
          <CardHead title="Qué hace este bot" />
          <ul className="mt-3 space-y-2 text-[14px] text-muted">
            {bot.preset.map((p) => (
              <li key={p} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: bot.color }} />
                {p}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <CardHead title="Cómo decide" />
          <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{bot.description}</p>
          <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{bot.tracking}</p>
        </Card>
        <Card className="p-5 sm:p-6">
          <CardHead title="Idea actual" sub="Aprueba o rechaza: tú decides." />
          <div className="mt-4">
            {pending.length ? (
              <div className="space-y-3">
                {pending.map((p) => (
                  <ProposalCard key={p.id} p={p} />
                ))}
              </div>
            ) : (
              <Empty title={on ? "Buscando una idea…" : "El bot está apagado"} text={on ? "Cuando encuentre una operación que cumpla sus criterios te la mostrará aquí." : "Enciéndelo para recibir ideas de práctica."} />
            )}
          </div>
        </Card>
      </div>

      <Card className="p-5 sm:p-6">
        <CardHead title="Historial de órdenes" />
        <div className="mt-4">
          {orders.length === 0 ? (
            <p className="text-[14px] text-muted">Aún no hay operaciones de este bot.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-[14px]">
                <thead className="text-[12.5px] uppercase tracking-wide text-muted">
                  <tr>
                    <th className="pb-2 font-semibold">Cuándo</th>
                    <th className="pb-2 font-semibold">Operación</th>
                    <th className="pb-2 font-semibold">Precio</th>
                    <th className="pb-2 text-right font-semibold">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-edge">
                  {orders.slice(0, 20).map((o) => (
                    <tr key={o.id}>
                      <td className="py-2.5 text-muted">{timeAgo(o.ts, now)}</td>
                      <td className="py-2.5 font-semibold capitalize">
                        {o.side} {o.symbol}
                        <span className="block text-[12.5px] font-normal normal-case text-muted">{o.note}</span>
                      </td>
                      <td className="tabnum py-2.5">{fmtPrice(o.symbol, o.price)}</td>
                      <td className="py-2.5 text-right">{o.pnl !== undefined ? <Delta value={o.pnl} /> : <span className="text-muted">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
