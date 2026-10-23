"use client";

import CandleChart from "@/components/charts/CandleChart";
import { useDemo } from "@/components/panel/DemoProvider";
import { assetBySymbol, changePct } from "@/lib/sim";

const WINDOW = 70;

const clock = (back: number) => {
  // Cada vela representa 5 minutos de mercado simulado.
  const d = new Date(Date.now() - back * 5 * 60 * 1000);
  return `${String(d.getHours()).padStart(2, "0")}:${String(Math.floor(d.getMinutes() / 5) * 5).padStart(2, "0")}`;
};

export default function LiveChart({ symbol, height = 380, showVolume = true }: { symbol: string; height?: number; showVolume?: boolean }) {
  const { markets } = useDemo();
  const a = assetBySymbol(symbol);
  const series = markets[symbol].slice(-WINDOW);
  const total = series.length;
  return (
    <CandleChart
      candles={series}
      visible={series.length}
      height={height}
      symbol={a.symbol}
      label={`Gráfico de velas simulado de ${a.name}`}
      decimals={a.decimals}
      showVolume={showVolume}
      axisLabel={(i) => clock(total - 1 - i)}
    />
  );
}

export function PriceHead({ symbol }: { symbol: string }) {
  const { markets } = useDemo();
  const a = assetBySymbol(symbol);
  const s = markets[symbol];
  const price = s[s.length - 1].c;
  const ch = changePct(s, 12);
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="font-display text-2xl font-semibold tabnum">${price.toLocaleString("en-US", { minimumFractionDigits: a.decimals, maximumFractionDigits: a.decimals })}</span>
      <span className={`tabnum text-sm font-semibold ${ch >= 0 ? "text-up" : "text-down"}`}>
        {ch >= 0 ? "▲" : "▼"} {Math.abs(ch).toFixed(2)}%
      </span>
      <span className="text-[13px] text-muted">{a.name} · precio simulado</span>
    </div>
  );
}
