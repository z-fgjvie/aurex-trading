"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { sma, type Candle, type Levels } from "@/lib/chart";

type Props = {
  candles: Candle[];
  /** Cuántas velas se dibujan (para animar la aparición). */
  visible: number;
  height?: number;
  /** Espacio vacío a la derecha (para que las líneas de entrada/stop/objetivo respiren). */
  extraSlots?: number;
  levels?: Levels | null;
  showLevels?: boolean;
  exit?: { index: number; price: number; kind: "win" | "loss" } | null;
  showVolume?: boolean;
  symbol: string;
  label: string;
  /** Color del fondo del panel, para que las etiquetas se lean sobre las velas. */
  halo?: string;
  className?: string;
  /** Decimales de los precios (por defecto 2). */
  decimals?: number;
  /** Texto del eje de tiempo por vela (por defecto "Día n"). */
  axisLabel?: (candleIndex: number) => string;
};

const PAD = { l: 8, r: 62, t: 34, b: 26 };

function niceStep(range: number, target: number) {
  const raw = range / target;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / pow;
  const nf = f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10;
  return nf * pow;
}

const fx = (n: number) => n.toFixed(1);

export default function CandleChart({
  candles,
  visible,
  height = 400,
  extraSlots = 0,
  levels = null,
  showLevels = false,
  exit = null,
  showVolume = true,
  symbol,
  label,
  halo = "var(--surface)",
  className = "",
  decimals = 2,
  axisLabel,
}: Props) {
  const dec = decimals;
  const wrap = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setW(Math.floor(entry.contentRect.width)));
    ro.observe(el);
    setW(Math.floor(el.clientWidth));
    return () => ro.disconnect();
  }, []);

  const g = useMemo(() => {
    const n = candles.length + extraSlots;
    const plotW = Math.max(1, w - PAD.l - PAD.r);
    const volH = showVolume ? Math.round(height * 0.15) : 0;
    const gap = showVolume ? 12 : 0;
    const priceH = height - PAD.t - PAD.b - volH - gap;
    let hi = Math.max(...candles.map((c) => c.h));
    let lo = Math.min(...candles.map((c) => c.l));
    if (levels) {
      hi = Math.max(hi, levels.target);
      lo = Math.min(lo, levels.stop);
    }
    const pad = (hi - lo) * 0.07;
    hi += pad;
    lo -= pad;
    const step = niceStep(hi - lo, 5);
    const first = Math.ceil(lo / step);
    const last = Math.floor(hi / step);
    const ticks: number[] = [];
    for (let i = first; i <= last; i++) ticks.push(Number((i * step).toFixed(dec + 2)));
    const slot = plotW / n;
    const vmax = Math.max(...candles.map((c) => c.v));
    return { n, plotW, volH, gap, priceH, hi, lo, ticks, slot, vmax };
  }, [candles, extraSlots, height, levels, showVolume, w]);

  const y = (v: number) => PAD.t + ((g.hi - v) / (g.hi - g.lo)) * g.priceH;
  const x = (i: number) => PAD.l + g.slot * (i + 0.5);
  const volBase = PAD.t + g.priceH + g.gap + g.volH;
  const bw = Math.max(2, Math.min(11, g.slot * 0.62));
  const axisX = w - PAD.r;

  const shownCount = Math.min(visible, candles.length);
  const ma = useMemo(() => sma(candles.slice(0, shownCount), 20), [candles, shownCount]);
  const maPath = ma
    .map((v, i) => (v === null ? "" : `${ma.slice(0, i).some((p) => p !== null) ? "L" : "M"}${fx(x(i))} ${fx(y(v))}`))
    .join(" ");

  // Etiquetas de tiempo: una "sesión" son 7 velas.
  const perSession = 7;
  const sessionsPerLabel = Math.max(1, Math.ceil(84 / (g.slot * perSession)));
  const timeLabels: { i: number; text: string }[] = [];
  for (let s = 0; s * perSession < candles.length; s += sessionsPerLabel) {
    timeLabels.push({ i: s * perSession, text: axisLabel ? axisLabel(s * perSession) : `Día ${s + 1}` });
  }

  const idx = shownCount > 0 ? Math.min(hover ?? shownCount - 1, shownCount - 1) : -1;
  const shown = idx >= 0 ? candles[idx] : null;
  const prevClose = idx > 0 ? candles[idx - 1].c : shown?.o ?? 0;
  const change = shown ? ((shown.c - prevClose) / prevClose) * 100 : 0;

  const lastCandle = shownCount > 0 ? candles[shownCount - 1] : null;
  const lastUp = lastCandle ? lastCandle.c >= lastCandle.o : true;

  const onMove = (e: React.PointerEvent) => {
    const el = wrap.current;
    if (!el || shownCount === 0) return;
    const px = e.clientX - el.getBoundingClientRect().left - PAD.l;
    setHover(Math.max(0, Math.min(shownCount - 1, Math.floor(px / g.slot))));
  };

  const pill = (yy: number, text: string, fill: string, stroke?: string, textFill = "var(--on-mark)") => (
    <g>
      <rect x={axisX + 3} y={yy - 9} width={PAD.r - 5} height={18} rx={4} style={{ fill, stroke: stroke ?? "none" }} />
      <text x={axisX + 3 + (PAD.r - 5) / 2} y={yy + 4} textAnchor="middle" fontSize={11} fontWeight={600} className="tabnum" style={{ fill: textFill }}>
        {text}
      </text>
    </g>
  );

  return (
    <div ref={wrap} className={`relative select-none ${className}`} style={{ height }}>
      {w > 0 && (
        <>
          <svg
            width={w}
            height={height}
            role="img"
            aria-label={label}
            className="block"
            style={{ touchAction: "pan-y" }}
          >
            {/* Cuadrícula y precios */}
            {g.ticks
              .filter((t) => {
                // Oculta el número del eje si se encimaría con una etiqueta (nivel o precio actual).
                const taken = levels && showLevels ? [levels.target, levels.entry, levels.stop] : [];
                if (shown) taken.push(shown.c);
                return !taken.some((v) => Math.abs(y(t) - y(v)) < 17);
              })
              .map((t) => (
              <g key={t}>
                <line x1={PAD.l} x2={axisX} y1={y(t)} y2={y(t)} className="stroke-edge" strokeWidth={1} opacity={0.7} />
                <text x={axisX + 8} y={y(t) + 4} fontSize={11} className="fill-muted tabnum">
                  {t.toFixed(dec)}
                </text>
              </g>
            ))}

            {/* Etiquetas de tiempo */}
            {timeLabels.map((t) => (
              <text key={t.i} x={x(t.i)} y={height - 8} fontSize={11} textAnchor="middle" className="fill-muted">
                {t.text}
              </text>
            ))}

            {/* Zonas de beneficio y riesgo */}
            {levels && (
              <g style={{ opacity: showLevels ? 1 : 0, transition: "opacity .6s ease" }}>
                <rect x={x(levels.entryIndex)} y={y(levels.target)} width={Math.max(0, axisX - x(levels.entryIndex))} height={y(levels.entry) - y(levels.target)} style={{ fill: "var(--up)", opacity: 0.1 }} />
                <rect x={x(levels.entryIndex)} y={y(levels.entry)} width={Math.max(0, axisX - x(levels.entryIndex))} height={y(levels.stop) - y(levels.entry)} style={{ fill: "var(--down)", opacity: 0.1 }} />
              </g>
            )}

            {/* Volumen */}
            {showVolume &&
              candles.slice(0, shownCount).map((c, i) => (
                <rect
                  key={i}
                  x={x(i) - bw / 2}
                  y={volBase - (c.v / g.vmax) * g.volH}
                  width={bw}
                  height={(c.v / g.vmax) * g.volH}
                  rx={1}
                  className={c.c >= c.o ? "fill-up" : "fill-down"}
                  opacity={0.35}
                />
              ))}

            {/* Velas */}
            {candles.slice(0, shownCount).map((c, i) => {
              const up = c.c >= c.o;
              const top = y(Math.max(c.o, c.c));
              const bot = y(Math.min(c.o, c.c));
              return (
                <g key={i} className={up ? "fill-up stroke-up" : "fill-down stroke-down"}>
                  <line x1={x(i)} x2={x(i)} y1={y(c.h)} y2={y(c.l)} strokeWidth={1.3} />
                  <rect x={x(i) - bw / 2} y={top} width={bw} height={Math.max(1.5, bot - top)} rx={1.5} strokeWidth={0} />
                </g>
              );
            })}

            {/* Media móvil de 20 velas */}
            {maPath && <path d={maPath} fill="none" strokeWidth={1.6} strokeLinejoin="round" style={{ stroke: "var(--ma)" }} opacity={0.9} />}

            {/* Líneas de entrada, stop y objetivo */}
            {levels && (
              <g style={{ opacity: showLevels ? 1 : 0, transition: "opacity .6s ease" }}>
                {[
                  { v: levels.target, name: "Objetivo", cls: "stroke-up fill-up", fill: "var(--up)" },
                  { v: levels.entry, name: "Entrada", cls: "stroke-fg fill-fg", fill: "var(--surface-2)" },
                  { v: levels.stop, name: "Stop", cls: "stroke-down fill-down", fill: "var(--down)" },
                ].map((l) => (
                  <g key={l.name}>
                    <line x1={x(levels.entryIndex)} x2={axisX} y1={y(l.v)} y2={y(l.v)} strokeWidth={1.4} strokeDasharray="5 4" className={l.cls.split(" ")[0]} />
                    <text x={x(levels.entryIndex) + 8} y={y(l.v) - 6} fontSize={11} fontWeight={650} className={l.cls.split(" ")[1]} style={{ paintOrder: "stroke", stroke: halo, strokeWidth: 4, strokeLinejoin: "round" }}>
                      {l.name}
                    </text>
                    {l.name === "Entrada"
                      ? pill(y(l.v), l.v.toFixed(dec), "var(--surface-2)", "var(--fg)", "var(--fg)")
                      : pill(y(l.v), l.v.toFixed(dec), l.fill)}
                  </g>
                ))}
              </g>
            )}

            {/* Cierre de la operación */}
            {exit && (
              <circle cx={x(exit.index)} cy={y(exit.price)} r={6} strokeWidth={2.5} style={{ fill: exit.kind === "win" ? "var(--up)" : "var(--down)", stroke: "var(--surface)" }} />
            )}

            {/* Precio actual */}
            {lastCandle && hover === null && !showLevels && pill(y(lastCandle.c), lastCandle.c.toFixed(dec), lastUp ? "var(--up)" : "var(--down)")}

            {/* Cruz al pasar el cursor */}
            {hover !== null && shown && (
              <g>
                <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={volBase} strokeDasharray="3 3" className="stroke-muted" strokeWidth={1} />
                <line x1={PAD.l} x2={axisX} y1={y(shown.c)} y2={y(shown.c)} strokeDasharray="3 3" className="stroke-muted" strokeWidth={1} />
                {pill(y(shown.c), shown.c.toFixed(dec), "var(--surface-2)", "var(--muted)", "var(--fg)")}
              </g>
            )}

            <rect x={PAD.l} y={0} width={g.plotW} height={height} fill="transparent" onPointerMove={onMove} onPointerLeave={() => setHover(null)} />
          </svg>

          {/* Leyenda tipo plataforma: se actualiza al pasar el cursor */}
          <div className="pointer-events-none absolute left-2 top-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11.5px] text-muted tabnum">
            <span className="font-semibold text-fg">{symbol}</span>
            {shown && (
              <>
                <span>
                  A <b className="font-medium text-fg">{shown.o.toFixed(dec)}</b>
                </span>
                <span>
                  Máx <b className="font-medium text-fg">{shown.h.toFixed(dec)}</b>
                </span>
                <span>
                  Mín <b className="font-medium text-fg">{shown.l.toFixed(dec)}</b>
                </span>
                <span>
                  C <b className="font-medium text-fg">{shown.c.toFixed(dec)}</b>
                </span>
                <span className={change >= 0 ? "text-up" : "text-down"}>
                  {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
                </span>
              </>
            )}
            <span className="inline-flex items-center gap-1">
              <i className="inline-block h-0.5 w-3 rounded" style={{ background: "var(--ma)" }} />
              Media 20
            </span>
          </div>
        </>
      )}
    </div>
  );
}
