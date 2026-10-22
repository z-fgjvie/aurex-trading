"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CandleChart from "@/components/charts/CandleChart";
import { RR, money, scenarios, signedMoney, type Levels } from "@/lib/chart";
import { demo, riskPercent, virtualBalance } from "@/lib/landing";

type Phase = "idle" | "running" | "done";
type Choice = "approve" | "reject";

const RISK = (virtualBalance * riskPercent) / 100;
const REWARD = RISK * RR;

export default function LiveDemo() {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [choice, setChoice] = useState<Choice | null>(null);
  const [visible, setVisible] = useState(scenarios[0].entryIndex + 1);
  const [balance, setBalance] = useState(virtualBalance);
  const [delta, setDelta] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const sc = scenarios[idx];
  const total = sc.candles.length;
  const win = sc.outcome === "win";
  const levels: Levels = { entryIndex: sc.entryIndex, entry: sc.entry, stop: sc.stop, target: sc.target };

  const stop = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };
  useEffect(() => stop, []);

  const select = (i: number) => {
    stop();
    setIdx(i);
    setPhase("idle");
    setChoice(null);
    setDelta(null);
    setVisible(scenarios[i].entryIndex + 1);
  };

  const finish = (c: Choice) => {
    setPhase("done");
    if (c === "approve") {
      const d = win ? REWARD : -RISK;
      setDelta(d);
      setBalance((b) => b + d);
    }
  };

  const decide = (c: Choice) => {
    if (phase !== "idle") return;
    setChoice(c);
    setPhase("running");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(total);
      finish(c);
      return;
    }
    let v = sc.entryIndex + 1;
    timer.current = setInterval(() => {
      v += 1;
      setVisible(v);
      if (v >= total) {
        stop();
        finish(c);
      }
    }, 160);
  };

  const restart = () => {
    setBalance(virtualBalance);
    select(0);
  };

  const exit = phase === "done" ? { index: total - 1, price: win ? sc.target : sc.stop, kind: sc.outcome } : null;

  return (
    <section id="demo" className="border-y border-edge bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">{demo.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">{demo.sub}</p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Escenarios de la demo">
          {scenarios.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === idx}
              onClick={() => select(i)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                i === idx ? "grad-brand border-transparent text-[#04161c]" : "border-edge text-muted hover:text-fg"
              }`}
            >
              {i + 1}. {s.title}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.55fr_1fr]">
          <div className="overflow-hidden rounded-2xl border border-edge bg-canvas card-shadow">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge px-4 py-3.5 sm:px-5">
              <div>
                <p className="font-display text-lg font-semibold leading-none">{sc.symbol}</p>
                <p className="mt-1 text-[13px] text-muted">Activo ficticio · velas de 1 hora</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="tabnum text-sm text-muted">
                  Saldo virtual <b className="text-base font-semibold text-fg">{money(balance)}</b>
                </p>
                <span className="soft-brand rounded-full px-3 py-1.5 text-xs font-semibold text-brand">Simulación</span>
              </div>
            </div>
            <div className="px-1 pt-1 sm:px-2">
              <CandleChart
                candles={sc.candles}
                visible={visible}
                height={400}
                levels={levels}
                showLevels
                exit={exit}
                symbol={sc.symbol}
                halo="var(--bg)"
                label={`Gráfico de velas simulado de ${sc.symbol}: ${sc.title}.`}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-edge bg-canvas p-5 card-shadow sm:p-6">
            {phase === "idle" && (
              <div>
                <p className="font-display text-xl font-semibold">Idea del bot: {sc.title}</p>
                <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{sc.why}</p>
                <dl className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
                  {[
                    ["Entrada", sc.entry, ""],
                    ["Stop", sc.stop, "text-down"],
                    ["Objetivo", sc.target, "text-up"],
                  ].map(([k, v, c]) => (
                    <div key={k as string} className="rounded-lg border border-edge py-2.5">
                      <dt className="text-xs text-muted">{k}</dt>
                      <dd className={`tabnum text-base font-semibold ${c}`}>{(v as number).toFixed(2)}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 rounded-xl bg-surface2 p-3.5 text-[14.5px] leading-relaxed">
                  Arriesgas <b>{money(RISK, 0)}</b> ({riskPercent}% de tu saldo). Si sale bien, ganas <b className="text-up">{money(REWARD, 0)}</b>. Si sale mal, pierdes <b className="text-down">{money(RISK, 0)}</b>.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button onClick={() => decide("reject")} className="btn-ghost">
                    Rechazar
                  </button>
                  <button onClick={() => decide("approve")} className="btn-primary">
                    Aprobar
                  </button>
                </div>
              </div>
            )}

            {phase === "running" && (
              <div className="py-10 text-center" role="status">
                <p className="font-display text-xl font-semibold">{choice === "approve" ? "Operación en curso…" : "Veamos qué habría pasado…"}</p>
                <p className="mt-2 text-[15px] text-muted">El precio se mueve vela a vela. Mira el gráfico.</p>
                <div className="mx-auto mt-6 h-1.5 max-w-[14rem] overflow-hidden rounded-full bg-surface2">
                  <div className="grad-brand h-full rounded-full transition-all" style={{ width: `${((visible - sc.entryIndex - 1) / (total - sc.entryIndex - 1)) * 100}%` }} />
                </div>
              </div>
            )}

            {phase === "done" && (
              <div role="status" aria-live="polite">
                {choice === "approve" && delta !== null ? (
                  <>
                    <p className="text-sm text-muted">Operación cerrada · saldo virtual</p>
                    <p className={`tabnum font-display text-5xl font-semibold ${delta >= 0 ? "text-up" : "text-down"}`}>{signedMoney(delta)}</p>
                  </>
                ) : (
                  <>
                    <p className="font-display text-2xl font-semibold">Rechazaste esta idea</p>
                    <p className="mt-1 text-[15px] text-muted">
                      Tu saldo no cambió. Habría sido <b className={win ? "text-up" : "text-down"}>{signedMoney(win ? REWARD : -RISK)}</b>.
                    </p>
                  </>
                )}
                <p className="mt-4 rounded-xl bg-surface2 p-3.5 text-[14.5px] leading-relaxed">
                  <b>Qué aprendiste:</b> {sc.result}
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  {idx < scenarios.length - 1 ? (
                    <button onClick={() => select(idx + 1)} className="btn-primary">
                      Siguiente escenario
                    </button>
                  ) : (
                    <>
                      <Link href="/quiz" className="btn-primary">
                        Elegir mi bot (quiz gratis)
                      </Link>
                      <button onClick={restart} className="btn-ghost">
                        Volver a empezar la demo
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">{demo.note}</p>
      </div>
    </section>
  );
}
