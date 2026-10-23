import type { Candle } from "@/lib/chart";

export default function Spark({ series, w = 84, h = 30 }: { series: Candle[]; w?: number; h?: number }) {
  const pts = series.slice(-40).map((c) => c.c);
  const lo = Math.min(...pts);
  const hi = Math.max(...pts);
  const d = pts.map((v, i) => `${i ? "L" : "M"}${((i / (pts.length - 1)) * w).toFixed(1)} ${(h - 2 - ((v - lo) / (hi - lo || 1)) * (h - 4)).toFixed(1)}`).join(" ");
  const up = pts[pts.length - 1] >= pts[0];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <path d={d} fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ stroke: up ? "var(--up)" : "var(--down)" }} />
    </svg>
  );
}
