"use client";

import { useEffect, useMemo, useState } from "react";
import CandleChart from "@/components/charts/CandleChart";
import { scenarios } from "@/lib/chart";

const sc = scenarios[2]; // tendencia al alza: más amable para una pantalla de bienvenida

// Gráfico simulado que se dibuja solo en el panel lateral de login y registro.
export default function AsideChart() {
  const history = useMemo(() => sc.candles.slice(0, sc.entryIndex + 1), []);
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const total = history.length;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(total);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setVisible(i);
      if (i >= total) clearInterval(id);
    }, 34);
    return () => clearInterval(id);
  }, [history.length]);

  const last = history[Math.max(0, visible - 1)];
  const prev = history[Math.max(0, visible - 2)];
  const change = visible > 1 ? ((last.c - prev.c) / prev.c) * 100 : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-edge bg-surface card-shadow">
      <div className="flex items-center justify-between gap-3 border-b border-edge px-5 py-3.5">
        <div>
          <p className="font-display text-base font-semibold leading-none">{sc.symbol}</p>
          <p className="tabnum mt-1.5 text-xl font-semibold leading-none">
            {last.c.toFixed(2)}{" "}
            <span className={`text-[13px] font-medium ${change >= 0 ? "text-up" : "text-down"}`}>
              {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
            </span>
          </p>
        </div>
        <span className="soft-brand rounded-full px-3 py-1.5 text-xs font-semibold text-brand">Simulación</span>
      </div>
      <div className="px-1 pt-1">
        <CandleChart
          candles={history}
          visible={visible}
          height={290}
          extraSlots={6}
          symbol={sc.symbol}
          label={`Gráfico de velas simulado de ${sc.symbol}. Datos ficticios con fines educativos.`}
        />
      </div>
    </div>
  );
}
