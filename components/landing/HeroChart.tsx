"use client";

import { useEffect, useMemo, useState } from "react";
import CandleChart from "@/components/charts/CandleChart";
import BotAvatar from "@/components/ui/BotAvatar";
import { scenarios, money, type Levels } from "@/lib/chart";
import { virtualBalance } from "@/lib/landing";

const sc = scenarios[0];

// El hero abre con lo más característico del producto: un gráfico que se dibuja solo
// y donde el bot marca su idea (entrada, stop y objetivo). No muestra el resultado:
// eso lo decide quien prueba la demo.
export default function HeroChart() {
  const history = useMemo(() => sc.candles.slice(0, sc.entryIndex + 1), []);
  const levels: Levels = useMemo(
    () => ({ entryIndex: sc.entryIndex, entry: sc.entry, stop: sc.stop, target: sc.target }),
    []
  );
  const [visible, setVisible] = useState(0);
  const [pins, setPins] = useState(false);

  useEffect(() => {
    const total = history.length;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(total);
      setPins(true);
      return;
    }
    let i = 0;
    let t: ReturnType<typeof setTimeout> | undefined;
    const id = setInterval(() => {
      i += 1;
      setVisible(i);
      if (i >= total) {
        clearInterval(id);
        t = setTimeout(() => setPins(true), 350);
      }
    }, 38);
    return () => {
      clearInterval(id);
      if (t) clearTimeout(t);
    };
  }, [history.length]);

  const last = history[Math.max(0, visible - 1)];
  const prev = history[Math.max(0, visible - 2)];
  const change = visible > 1 ? ((last.c - prev.c) / prev.c) * 100 : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-edge bg-surface card-shadow">
      <div className="flex items-center justify-between gap-3 border-b border-edge px-4 py-3.5 sm:px-5">
        <div>
          <p className="font-display text-lg font-semibold leading-none">{sc.symbol}</p>
          <p className="mt-1 text-[13px] text-muted">Activo ficticio · velas de 1 hora</p>
          <p className="tabnum mt-2 text-2xl font-semibold leading-none">
            {last.c.toFixed(2)}{" "}
            <span className={`text-sm font-medium ${change >= 0 ? "text-up" : "text-down"}`}>
              {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
            </span>
          </p>
        </div>
        <span className="soft-brand rounded-full px-3 py-1.5 text-xs font-semibold text-brand">Simulación</span>
      </div>

      <div className="px-1 pt-1 sm:px-2">
        <CandleChart
          candles={history}
          visible={visible}
          height={380}
          extraSlots={16}
          levels={levels}
          showLevels={pins}
          symbol={sc.symbol}
          label={`Gráfico de velas simulado de ${sc.symbol} con una idea del bot: entrada ${sc.entry}, stop ${sc.stop} y objetivo ${sc.target}.`}
        />
      </div>

      <div className="grid items-center gap-4 border-t border-edge p-4 sm:grid-cols-[1fr_auto] sm:p-5">
        <div
          className="flex items-start gap-3 transition-all duration-500"
          style={{ opacity: pins ? 1 : 0.35, transform: pins ? "none" : "translateY(4px)" }}
        >
          <BotAvatar color="#c084fc" size={46} />
          <div>
            <p className="text-sm font-semibold">Bot Camaleón</p>
            <p className="text-[14.5px] leading-snug text-muted">
              «Detecté un posible rebote. Arriesgas {money(virtualBalance * 0.01, 0)} para ganar {money(virtualBalance * 0.02, 0)} virtuales. ¿La apruebas?»
            </p>
          </div>
        </div>
        <a href="#demo" className="btn-primary w-full sm:w-auto">
          Probar la demo
        </a>
      </div>
    </div>
  );
}
