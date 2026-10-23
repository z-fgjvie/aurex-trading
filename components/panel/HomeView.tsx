"use client";

import Link from "next/link";
import { useState } from "react";
import BotAvatar from "@/components/ui/BotAvatar";
import Donut from "@/components/panel/Donut";
import EquityChart from "@/components/panel/EquityChart";
import Icon from "@/components/panel/Icon";
import LiveChart, { PriceHead } from "@/components/panel/LiveChart";
import ProposalCard from "@/components/panel/ProposalCard";
import Spark from "@/components/panel/Spark";
import { useDemo } from "@/components/panel/DemoProvider";
import { Card, CardHead, Delta, Empty, SimTag } from "@/components/panel/ui";
import { days, news, totalLessons } from "@/lib/demo-content";
import { money, signedMoney } from "@/lib/chart";
import {
  assetBySymbol,
  assets,
  changePct,
  fmtPrice,
  positionPnl,
} from "@/lib/sim";
import { bots } from "@/lib/steps";

export default function HomeView() {
  const { user, acc, markets, equity, start, toggleBot, now } = useDemo();
  const [sel, setSel] = useState("AAPL");
  const pnl = equity - start;
  const pnlPct = (pnl / start) * 100;
  const pending = acc.proposals.filter(
    (p) => p.status === "pendiente" && p.expiresAt > now,
  );
  const invested = equity - acc.cash;
  const first = (user.name || "").split(" ")[0];
  const doneCount = Object.keys(acc.learn).length;
  const nextDay = days.find(
    (d) => d.lessons && d.lessons.some((l) => !acc.learn[l.id]),
  );
  const nextLesson = nextDay?.lessons?.find((l) => !acc.learn[l.id]);

  const segs = [
    {
      label: "Efectivo",
      value: acc.cash,
      color: "color-mix(in srgb, var(--brand) 38%, var(--surface-2))",
    },
    ...Object.values(
      acc.positions.reduce<
        Record<string, { label: string; value: number; color: string }>
      >((m, p) => {
        const a = assetBySymbol(p.symbol);
        const v = p.qty * markets[p.symbol][markets[p.symbol].length - 1].c;
        m[p.symbol] = {
          label: p.symbol,
          value: (m[p.symbol]?.value ?? 0) + v,
          color: a.color,
        };
        return m;
      }, {}),
    ),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-brand">Panel · modo DEMO</p>
          <h1 className="mt-1 font-display text-[1.75rem] font-semibold leading-tight sm:text-[2.1rem]">
            Hola{first ? `, ${first}` : ""} 👋
          </h1>
        </div>
        <SimTag>Saldo disponible · precios de mercado</SimTag>
      </div>

      {/* Saldo + bots */}
      <div className="grid gap-5 lg:grid-cols-12">
        <section
          className="min-w-0 grad-brand relative overflow-hidden rounded-3xl p-6 text-[#04161c] shadow-xl lg:col-span-8 lg:p-8"
          aria-label="Saldo disponible"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[14px] font-semibold opacity-80">
                Saldo disponible
              </p>
              <p className="tabnum mt-1 font-display text-[2.6rem] font-semibold leading-none sm:text-[3.2rem]">
                {money(equity)}
              </p>
              <p className="mt-2 text-[14.5px] font-semibold">
                {signedMoney(pnl)} ({pnlPct >= 0 ? "+" : "−"}
                {Math.abs(pnlPct).toFixed(2)}%){" "}
                <span className="font-medium opacity-75">
                  desde que empezaste
                </span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-[13px]">
              <div className="rounded-xl bg-white/35 px-3.5 py-2.5">
                <p className="font-medium opacity-80">Disponible</p>
                <p className="tabnum text-[15px] font-bold">
                  {money(acc.cash, 0)}
                </p>
              </div>
              <div className="rounded-xl bg-white/35 px-3.5 py-2.5">
                <p className="font-medium opacity-80">Invertido</p>
                <p className="tabnum text-[15px] font-bold">
                  {money(invested, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <EquityChart
              points={acc.equity}
              baseline={start}
              height={150}
              onHero
            />
          </div>
        </section>

        <Card className="min-w-0 p-5 lg:col-span-4">
          <CardHead
            title="Tus bots"
            sub="Actívalos para recibir ideas de práctica."
            right={
              <Link
                href="/panel/bots"
                className="text-[13.5px] font-semibold text-brand hover:underline"
              >
                Ver todos
              </Link>
            }
          />
          <ul className="mt-4 space-y-2.5">
            {bots.map((b) => {
              const on = acc.activeBots.includes(b.id as never);
              return (
                <li
                  key={b.id}
                  className="flex items-center gap-3 rounded-xl bg-surface2 px-3 py-2.5"
                >
                  <BotAvatar color={b.color} size={34} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14.5px] font-semibold">
                      {b.name}
                    </p>
                    <p className="text-[12.5px] text-muted">
                      {on ? "Activo · buscando ideas" : "Apagado"}
                    </p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={on}
                    aria-label={`${on ? "Apagar" : "Encender"} ${b.name}`}
                    onClick={() => toggleBot(b.id as never)}
                    className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-brand" : "bg-edge"}`}
                  >
                    <span
                      className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* Propuestas */}
      <Card className="p-5 sm:p-6">
        <CardHead
          title="Ideas de tus bots"
          sub="Tú decides: nada se ejecuta sin tu aprobación."
          right={
            pending.length > 0 ? (
              <span className="rounded-full bg-down px-2.5 py-1 text-xs font-bold text-white">
                {pending.length} por decidir
              </span>
            ) : undefined
          }
        />
        <div className="mt-4">
          {pending.length === 0 ? (
            <Empty
              title="Aún no hay ideas por decidir"
              text={
                acc.activeBots.length
                  ? "Tus bots están mirando el mercado. Cuando encuentren algo, aparecerá aquí."
                  : "Enciende un bot y te propondrá una operación de práctica con su explicación."
              }
            >
              {!acc.activeBots.length && (
                <button
                  onClick={() => toggleBot("equilibrio")}
                  className="btn-primary !py-2.5"
                >
                  Encender el Bot Equilibrio
                </button>
              )}
            </Empty>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {pending.slice(0, 2).map((p) => (
                <ProposalCard key={p.id} p={p} compact />
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Gráfico + posiciones */}
      <div className="grid gap-5 lg:grid-cols-12">
        <Card className="min-w-0 p-5 lg:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <PriceHead symbol={sel} />
            <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted">
              <span className="h-2 w-2 animate-pulse rounded-full bg-up" /> En
              vivo
            </span>
          </div>
          <div
            className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto pb-1"
            role="tablist"
            aria-label="Activos"
          >
            {assets.map((a) => (
              <button
                key={a.symbol}
                role="tab"
                aria-selected={sel === a.symbol}
                onClick={() => setSel(a.symbol)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${sel === a.symbol ? "grad-brand text-[#04161c]" : "bg-surface2 text-muted hover:text-fg"}`}
              >
                {a.symbol}
              </button>
            ))}
          </div>
          <div className="mt-2">
            <LiveChart symbol={sel} height={340} />
          </div>
          <div className="mt-2 text-right">
            <Link
              href="/panel/simulador"
              className="text-[13.5px] font-semibold text-brand hover:underline"
            >
              Operar en el simulador →
            </Link>
          </div>
        </Card>

        <Card className="min-w-0 p-5 lg:col-span-4">
          <CardHead title="Tu cartera" sub="Posiciones abiertas" />
          <div className="mt-4 flex items-center gap-4">
            <Donut
              segs={segs}
              size={116}
              center={
                <div>
                  <p className="text-[11px] text-muted">Invertido</p>
                  <p className="tabnum text-[14px] font-bold">
                    {equity > 0 ? Math.round((invested / equity) * 100) : 0}%
                  </p>
                </div>
              }
            />
            <ul className="min-w-0 flex-1 space-y-1.5 text-[13px]">
              {segs.slice(0, 5).map((s) => (
                <li key={s.label} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: s.color }}
                  />
                  <span className="flex-1 truncate text-muted">{s.label}</span>
                  <span className="tabnum font-semibold">
                    {money(s.value, 0)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 border-t border-edge pt-4">
            {acc.positions.length === 0 ? (
              <p className="text-[13.5px] text-muted">
                Sin posiciones abiertas. Compra en el simulador o aprueba una
                idea de un bot.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {acc.positions.slice(0, 4).map((p) => {
                  const v = positionPnl(p, markets);
                  return (
                    <li
                      key={p.id}
                      className="flex items-center justify-between text-[14px]"
                    >
                      <span className="font-semibold">{p.symbol}</span>
                      <span className="tabnum text-muted">
                        {fmtPrice(p.symbol, p.entry)}
                      </span>
                      <Delta value={v} />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Card>
      </div>

      {/* Mercados */}
      <Card className="p-5 sm:p-6">
        <CardHead
          title="Mercados"
          sub="Precios ficticios que se mueven en vivo para practicar."
        />
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-5">
          {assets.map((a) => {
            const s = markets[a.symbol];
            const ch = changePct(s, 24);
            return (
              <button
                key={a.symbol}
                onClick={() => setSel(a.symbol)}
                className="flex items-center justify-between gap-2 rounded-xl border border-edge bg-canvas px-3.5 py-3 text-left transition-colors hover:border-brand"
              >
                <div className="min-w-0">
                  <p className="text-[14.5px] font-bold">{a.symbol}</p>
                  <p className="tabnum text-[13px] text-muted">
                    {fmtPrice(a, s[s.length - 1].c)}
                  </p>
                  <p
                    className={`tabnum text-[12.5px] font-semibold ${ch >= 0 ? "text-up" : "text-down"}`}
                  >
                    {ch >= 0 ? "▲" : "▼"} {Math.abs(ch).toFixed(2)}%
                  </p>
                </div>
                <Spark series={s} />
              </button>
            );
          })}
        </div>
      </Card>

      {/* Aprender, mentor, novedades */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="flex flex-col p-5">
          <div className="flex items-center gap-2 text-brand">
            <Icon name="book" />
            <span className="text-[13px] font-semibold">Reto de 28 días</span>
          </div>
          <p className="mt-3 font-display text-lg font-semibold leading-snug">
            {nextLesson ? nextLesson.title : "¡Completaste la semana 1!"}
          </p>
          <p className="mt-1 text-[13.5px] text-muted">
            {nextDay
              ? `Día ${nextDay.n} · ${nextDay.title}`
              : "Pronto se abren los siguientes días."}
          </p>
          <div className="mt-4 h-2 rounded-full bg-surface2">
            <div
              className="grad-brand h-2 rounded-full"
              style={{ width: `${(doneCount / totalLessons) * 100}%` }}
            />
          </div>
          <p className="mt-1.5 text-[12.5px] text-muted">
            {doneCount} de {totalLessons} lecciones disponibles
          </p>
          <Link
            href="/panel/aprender"
            className="btn-primary mt-auto !py-2.5 self-start"
          >
            {doneCount ? "Continuar" : "Empezar"}
          </Link>
        </Card>
        <Card className="flex flex-col p-5">
          <div className="flex items-center gap-2 text-brand">
            <Icon name="chat" />
            <span className="text-[13px] font-semibold">Mentor de IA</span>
          </div>
          <p className="mt-3 font-display text-lg font-semibold leading-snug">
            Pregúntale a Roberto lo que quieras aprender
          </p>
          <p className="mt-1 text-[13.5px] text-muted">
            Velas, riesgo, stops, indicadores… Respuestas claras para
            principiantes.
          </p>
          <Link
            href="/panel/mentor"
            className="btn-ghost mt-auto !py-2.5 self-start"
          >
            Abrir el chat
          </Link>
        </Card>
        <Card className="flex flex-col p-5">
          <div className="flex items-center gap-2 text-brand">
            <Icon name="news" />
            <span className="text-[13px] font-semibold">Novedades</span>
          </div>
          <p className="mt-3 font-display text-lg font-semibold leading-snug">
            {news[0].title}
          </p>
          <p className="mt-1 text-[13.5px] text-muted">{news[0].text}</p>
          <Link
            href="/panel/novedades"
            className="btn-ghost mt-auto !py-2.5 self-start"
          >
            Ver novedades
          </Link>
        </Card>
      </div>
    </div>
  );
}
