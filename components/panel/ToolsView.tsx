"use client";

import Link from "next/link";
import { useState } from "react";
import AssetPicker from "@/components/panel/AssetPicker";
import { useDemo } from "@/components/panel/DemoProvider";
import Icon from "@/components/panel/Icon";
import LiveChart, { PriceHead } from "@/components/panel/LiveChart";
import { Card, CardHead, PageTitle, SimTag } from "@/components/panel/ui";
import { assetBySymbol, findPatterns, fmtPrice, readSeries, scenarioPaths } from "@/lib/sim";

type Tool = "analizar" | "patrones" | "escenarios";

const hub: { id: Tool | "simulador" | "mentor"; title: string; text: string; icon: string; href?: string }[] = [
  { id: "analizar", title: "Analiza un activo", text: "Tendencia, RSI, volatilidad, soporte y resistencia en un vistazo, explicados en simple.", icon: "chart" },
  { id: "patrones", title: "Buscador de patrones", text: "Encuentra velas clásicas (martillo, envolvente, doji) en el gráfico y aprende qué significan.", icon: "spark" },
  { id: "escenarios", title: "Escenarios", text: "Tres caminos hipotéticos a partir del precio actual, para pensar en riesgo. No son pronósticos.", icon: "tools" },
  { id: "simulador", title: "Simulador de trading", text: "Opera con saldo virtual sobre gráficos en vivo.", icon: "bots", href: "/panel/simulador" },
  { id: "mentor", title: "Mentor de IA", text: "Resuelve tus dudas con respuestas claras para principiantes.", icon: "chat", href: "/panel/mentor" },
];

function Gauge({ value }: { value: number }) {
  const tone = value > 70 ? "var(--down)" : value < 30 ? "var(--up)" : "var(--brand)";
  return (
    <div>
      <div className="relative h-2.5 rounded-full bg-surface2">
        <div className="absolute inset-y-0 left-[30%] w-[40%] rounded-full bg-edge/60" />
        <span className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-surface" style={{ left: `${value}%`, background: tone }} />
      </div>
      <div className="mt-1.5 flex justify-between text-[11.5px] text-muted">
        <span>Sobreventa &lt;30</span>
        <span>Sobrecompra &gt;70</span>
      </div>
    </div>
  );
}

function Analyzer() {
  const { markets } = useDemo();
  const [sym, setSym] = useState("NVDA");
  const a = assetBySymbol(sym);
  const r = readSeries(markets[sym]);
  const trendColor = r.trend === "alcista" ? "text-up" : r.trend === "bajista" ? "text-down" : "text-fg";
  return (
    <div className="space-y-5">
      <AssetPicker value={sym} onChange={setSym} />
      <div className="grid gap-5 lg:grid-cols-12">
        <Card className="min-w-0 p-5 lg:col-span-7">
          <PriceHead symbol={sym} />
          <div className="mt-2">
            <LiveChart symbol={sym} height={360} />
          </div>
        </Card>
        <Card className="min-w-0 p-5 lg:col-span-5">
          <CardHead title="Lectura técnica" sub="Calculada sobre las velas que ves" />
          <p className={`mt-4 font-display text-2xl font-semibold capitalize ${trendColor}`}>Tendencia {r.trend}</p>
          <p className="mt-1 text-[14.5px] leading-relaxed text-muted">{r.summary}</p>
          <dl className="mt-5 space-y-4 text-[14px]">
            <div>
              <div className="mb-2 flex justify-between">
                <dt className="font-semibold">RSI (14)</dt>
                <dd className="tabnum font-bold">{r.rsi.toFixed(0)}</dd>
              </div>
              <Gauge value={r.rsi} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-surface2 p-3">
                <dt className="text-[12.5px] text-muted">Soporte (30 velas)</dt>
                <dd className="tabnum font-bold">{fmtPrice(a, r.support)}</dd>
              </div>
              <div className="rounded-xl bg-surface2 p-3">
                <dt className="text-[12.5px] text-muted">Resistencia (30 velas)</dt>
                <dd className="tabnum font-bold">{fmtPrice(a, r.resistance)}</dd>
              </div>
              <div className="rounded-xl bg-surface2 p-3">
                <dt className="text-[12.5px] text-muted">Media 20 / 50</dt>
                <dd className="tabnum text-[13.5px] font-bold">
                  {fmtPrice(a, r.sma20)} / {fmtPrice(a, r.sma50)}
                </dd>
              </div>
              <div className="rounded-xl bg-surface2 p-3">
                <dt className="text-[12.5px] text-muted">Volatilidad</dt>
                <dd className="tabnum font-bold">{r.atr.toFixed(2)}% por vela</dd>
              </div>
            </div>
          </dl>
        </Card>
      </div>
      <p className="text-[12.5px] text-muted">Es una lectura educativa de datos ficticios. No es una recomendación de compra o venta.</p>
    </div>
  );
}

function Patterns() {
  const { markets } = useDemo();
  const [sym, setSym] = useState("TSLA");
  const series = markets[sym];
  const hits = findPatterns(series).reverse().slice(0, 8);
  const tone = { alcista: "soft-up text-up", bajista: "soft-down text-down", indecisión: "bg-surface2 text-muted" } as const;
  return (
    <div className="space-y-5">
      <AssetPicker value={sym} onChange={setSym} />
      <div className="grid gap-5 lg:grid-cols-12">
        <Card className="min-w-0 p-5 lg:col-span-7">
          <PriceHead symbol={sym} />
          <div className="mt-2">
            <LiveChart symbol={sym} height={360} />
          </div>
        </Card>
        <Card className="min-w-0 p-5 lg:col-span-5">
          <CardHead title="Patrones encontrados" sub="En las últimas 60 velas" />
          <ul className="mt-4 space-y-3">
            {hits.length === 0 && <li className="text-[14px] text-muted">No se encontraron patrones claros por ahora. El mercado cambia cada pocos segundos: vuelve a mirar.</li>}
            {hits.map((h) => (
              <li key={h.index} className="rounded-xl border border-edge p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{h.name}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold capitalize ${tone[h.kind]}`}>{h.kind}</span>
                </div>
                <p className="text-[12.5px] text-muted">Hace {series.length - 1 - h.index} {series.length - 1 - h.index === 1 ? "vela" : "velas"}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{h.explain}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <p className="text-[12.5px] text-muted">Un patrón por sí solo no garantiza nada: úsalo junto con la tendencia y tu plan de riesgo.</p>
    </div>
  );
}

function Scenarios() {
  const { markets } = useDemo();
  const [sym, setSym] = useState("ETH");
  const a = assetBySymbol(sym);
  const series = markets[sym];
  const past = series.slice(-30).map((c) => c.c);
  const paths = scenarioPaths(series, sym);
  const all = [...past, ...paths.flatMap((p) => p.points)];
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const W = 800;
  const H = 330;
  const pad = 14;
  const split = 440;
  const Y = (v: number) => pad + ((hi - v) / (hi - lo || 1)) * (H - pad * 2);
  const Xp = (i: number) => (i / (past.length - 1)) * split;
  const Xf = (i: number, n: number) => split + (i / (n - 1)) * (W - split - 70);
  const colors = { alcista: "var(--up)", lateral: "var(--muted)", bajista: "var(--down)" } as const;
  const pastD = past.map((v, i) => `${i ? "L" : "M"}${Xp(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(" ");
  return (
    <div className="space-y-5">
      <AssetPicker value={sym} onChange={setSym} />
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PriceHead symbol={sym} />
          <SimTag>Ilustrativo, no es un pronóstico</SimTag>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img" aria-label={`Tres escenarios hipotéticos para ${a.name}`}>
          <line x1={split} x2={split} y1={pad} y2={H - pad} stroke="var(--line)" strokeDasharray="4 5" />
          <text x={split - 8} y={pad + 10} textAnchor="end" fontSize={12} fill="var(--muted)">Pasado</text>
          <text x={split + 8} y={pad + 10} fontSize={12} fill="var(--muted)">Hipótesis</text>
          <path d={pastD} fill="none" stroke="var(--fg)" strokeWidth={2.2} strokeLinejoin="round" />
          {paths.map((p) => {
            const d = p.points.map((v, i) => `${i ? "L" : "M"}${Xf(i, p.points.length).toFixed(1)} ${Y(v).toFixed(1)}`).join(" ");
            const endY = Y(p.points[p.points.length - 1]);
            return (
              <g key={p.id}>
                <path d={d} fill="none" stroke={colors[p.id]} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
                <circle cx={Xf(p.points.length - 1, p.points.length)} cy={endY} r={4.5} fill={colors[p.id]} />
                <text x={W - 62} y={endY + 4} fontSize={12} fontWeight={600} fill={colors[p.id]} className="capitalize">{p.id}</text>
              </g>
            );
          })}
        </svg>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {paths.map((p) => {
            const end = p.points[p.points.length - 1];
            const ch = ((end - p.points[0]) / p.points[0]) * 100;
            return (
              <div key={p.id} className="rounded-xl bg-surface2 p-3.5">
                <p className="text-[13px] font-semibold" style={{ color: colors[p.id] }}>{p.label}</p>
                <p className="tabnum mt-0.5 text-[15px] font-bold">{fmtPrice(a, end)}</p>
                <p className="tabnum text-[13px] text-muted">{ch >= 0 ? "+" : "−"}{Math.abs(ch).toFixed(2)}% desde ahora</p>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
          Sirve para pensar en riesgo: si compraras ahora, ¿dónde pondrías tu stop para que el camino bajista no te saque con una pérdida mayor a la que aceptas? Los caminos se generan al azar con la volatilidad de este activo; nadie sabe qué hará el precio.
        </p>
      </Card>
    </div>
  );
}

export default function ToolsView() {
  const [tool, setTool] = useState<Tool | null>(null);
  if (tool) {
    const t = hub.find((h) => h.id === tool)!;
    return (
      <>
        <button onClick={() => setTool(null)} className="mb-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-muted hover:text-fg">
          ← Herramientas
        </button>
        <PageTitle title={t.title} sub={t.text} right={<SimTag>Datos simulados</SimTag>} />
        {tool === "analizar" && <Analyzer />}
        {tool === "patrones" && <Patterns />}
        {tool === "escenarios" && <Scenarios />}
      </>
    );
  }
  return (
    <>
      <PageTitle title="Herramientas" sub="Aprende a leer el mercado con ayudas visuales. Todo funciona con datos simulados." right={<SimTag>Datos simulados</SimTag>} />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {hub.map((h) => {
          const inner = (
            <>
              <span className="grad-brand grid h-12 w-12 place-items-center rounded-xl text-[#04161c]">
                <Icon name={h.icon} size={24} />
              </span>
              <h2 className="mt-4 font-display text-xl font-semibold">{h.title}</h2>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{h.text}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand">
                Abrir <Icon name="arrow" size={16} />
              </span>
            </>
          );
          const cls = "group block rounded-2xl border border-edge bg-surface p-6 text-left card-shadow transition-transform hover:-translate-y-0.5 hover:border-brand";
          return h.href ? (
            <Link key={h.id} href={h.href} className={cls}>
              {inner}
            </Link>
          ) : (
            <button key={h.id} onClick={() => setTool(h.id as Tool)} className={cls}>
              {inner}
            </button>
          );
        })}
      </div>
    </>
  );
}
