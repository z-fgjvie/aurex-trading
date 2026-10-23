"use client";

import { useEffect, useRef, useState } from "react";
import { money } from "@/lib/chart";

type Pt = { t: number; v: number };

/** Curva de saldo: área suave con línea punteada del saldo inicial. */
export default function EquityChart({ points, baseline, height = 150, onHero = false }: { points: Pt[]; baseline: number; height?: number; onHero?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.floor(e.contentRect.width)));
    ro.observe(el);
    setW(Math.floor(el.clientWidth));
    return () => ro.disconnect();
  }, []);

  const pts = points.length > 1 ? points : [{ t: 0, v: baseline }, { t: 1, v: baseline }];
  const vals = pts.map((p) => p.v);
  let hi = Math.max(...vals, baseline);
  let lo = Math.min(...vals, baseline);
  const pad = Math.max((hi - lo) * 0.2, baseline * 0.0008);
  hi += pad;
  lo -= pad;
  const X = (i: number) => (i / (pts.length - 1)) * (w - 2) + 1;
  const Y = (v: number) => 6 + ((hi - v) / (hi - lo)) * (height - 12);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(p.v).toFixed(1)}`).join(" ");
  const area = `${line} L${X(pts.length - 1).toFixed(1)} ${height} L${X(0).toFixed(1)} ${height} Z`;
  const up = pts[pts.length - 1].v >= baseline;
  const color = onHero ? "#04161c" : up ? "var(--up)" : "var(--down)";
  const gid = onHero ? "eqg-hero" : "eqg";
  const idx = hover ?? pts.length - 1;

  return (
    <div ref={ref} className="relative select-none" style={{ height }}>
      {w > 0 && (
        <svg
          width={w}
          height={height}
          role="img"
          aria-label="Curva de tu saldo virtual"
          style={{ touchAction: "pan-y" }}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setHover(Math.max(0, Math.min(pts.length - 1, Math.round(((e.clientX - r.left) / w) * (pts.length - 1)))));
          }}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={color} stopOpacity={onHero ? 0.25 : 0.28} />
              <stop offset="1" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1={0} x2={w} y1={Y(baseline)} y2={Y(baseline)} stroke={color} strokeOpacity={0.35} strokeDasharray="4 5" />
          <path d={area} fill={`url(#${gid})`} />
          <path d={line} fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={X(idx)} cy={Y(pts[idx].v)} r={4.5} fill={color} stroke={onHero ? "#5eead4" : "var(--surface)"} strokeWidth={2.5} />
        </svg>
      )}
      {hover !== null && w > 0 && (
        <div
          className="pointer-events-none absolute -top-1 rounded-lg border border-edge bg-surface px-2 py-1 text-[12px] font-semibold text-fg tabnum shadow"
          style={{ left: Math.min(Math.max(X(hover) - 40, 0), w - 92) }}
        >
          {money(pts[hover].v)}
        </div>
      )}
    </div>
  );
}
