import BotAvatar from "@/components/ui/BotAvatar";
import { bots, botPickCopy } from "@/lib/steps";
import { scenarios, signedMoney } from "@/lib/chart";

// Ilustraciones originales de la landing. Todo es SVG/HTML propio y usa los colores del tema.

export function Sparkline({ values, w = 240, h = 64, id }: { values: number[]; w?: number; h?: number; id: string }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const px = (i: number) => (i / (values.length - 1)) * w;
  const py = (v: number) => h - 4 - ((v - min) / (max - min || 1)) * (h - 8);
  const d = values.map((v, i) => `${i ? "L" : "M"}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-16 w-full" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--up)", stopOpacity: 0.35 }} />
          <stop offset="1" style={{ stopColor: "var(--up)", stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <path d={`${d} L${w} ${h} L0 ${h} Z`} fill={`url(#${id})`} />
      <path d={d} fill="none" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" style={{ stroke: "var(--up)" }} />
    </svg>
  );
}

const frame = "rounded-2xl border border-edge bg-surface p-5 card-shadow sm:p-6";

export function StepQuizVisual() {
  const options = [
    { icon: "🛡️", text: "Prefiero ir a lo seguro", on: false },
    { icon: "⚖️", text: "Un riesgo equilibrado", on: true },
    { icon: "🚀", text: "Más riesgo por más recompensa", on: false },
  ];
  return (
    <div className={frame} aria-hidden>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface2">
        <div className="grad-brand h-full w-2/5 rounded-full" />
      </div>
      <p className="mt-6 font-display text-2xl font-semibold leading-snug">¿Cuánto riesgo te acomoda?</p>
      <div className="mt-5 space-y-2.5">
        {options.map((o) => (
          <div
            key={o.text}
            className={`flex items-center gap-4 rounded-xl border px-4 py-3.5 text-[15px] font-medium ${
              o.on ? "soft-brand border-brand" : "border-edge bg-surface2"
            }`}
          >
            <span className="text-2xl">{o.icon}</span>
            {o.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StepBotsVisual() {
  return (
    <div className={frame} aria-hidden>
      <p className="font-display text-2xl font-semibold">{botPickCopy.intro.replace("¡Ahora ", "").replace("!", "")}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {bots.map((b, i) => (
          <div
            key={b.id}
            className="relative rounded-xl border bg-surface2 p-3 text-center"
            style={{ borderColor: i === 1 ? b.color : "var(--line)" }}
          >
            {i === 1 && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[10.5px] font-semibold" style={{ background: b.color, color: "#04161c" }}>
                Recomendado
              </span>
            )}
            <div className="mx-auto w-fit">
              <BotAvatar color={b.color} size={72} />
            </div>
            <p className="mt-1 text-sm font-semibold">{b.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StepDecideVisual() {
  const s = scenarios[0];
  const closes = s.candles.slice(s.entryIndex - 22, s.entryIndex + 1).map((c) => c.c);
  return (
    <div className={frame} aria-hidden>
      <div className="flex items-center gap-3">
        <BotAvatar color="#c084fc" size={44} />
        <div>
          <p className="text-sm font-semibold">Bot Camaleón</p>
          <p className="text-xs text-muted">Idea de práctica sobre {s.symbol} (ficticio)</p>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-surface2 p-3">
        <p className="text-[13px] leading-relaxed text-muted">
          «El precio se frenó en una zona donde ya rebotó antes. Propongo comprar con un stop corto.»
        </p>
        <Sparkline values={closes} id="sp-decide" />
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        {[
          ["Entrada", s.entry.toFixed(2), ""],
          ["Stop", s.stop.toFixed(2), "text-down"],
          ["Objetivo", s.target.toFixed(2), "text-up"],
        ].map(([k, v, c]) => (
          <div key={k} className="rounded-lg border border-edge py-2">
            <dt className="text-xs text-muted">{k}</dt>
            <dd className={`tabnum font-semibold ${c}`}>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-semibold">
        <div className="soft-down rounded-xl py-3 text-center text-down">Rechazar</div>
        <div className="grad-brand rounded-xl py-3 text-center text-[#04161c]">Aprobar</div>
      </div>
    </div>
  );
}

export function StepLearnVisual() {
  const rows = scenarios.map((s) => ({
    title: s.title,
    win: s.outcome === "win",
    value: s.outcome === "win" ? 200 : -100,
  }));
  const closes = scenarios[0].candles.slice(scenarios[0].entryIndex).map((c) => c.c);
  return (
    <div className={frame} aria-hidden>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted">Operación cerrada · simulación</p>
          <p className="tabnum mt-1 font-display text-4xl font-semibold text-up">{signedMoney(200)}</p>
          <p className="text-xs text-muted">saldo virtual</p>
        </div>
        <span className="soft-brand rounded-full px-3 py-1 text-xs font-semibold text-brand">Demo</span>
      </div>
      <Sparkline values={closes} id="sp-learn" />
      <div className="mt-3 rounded-xl bg-surface2 p-3 text-[13px] leading-relaxed text-muted">
        <b className="text-fg">Qué aprendiste:</b> el stop corto te protegía y el objetivo estaba al doble del riesgo.
      </div>
      <ul className="mt-4 divide-y divide-[var(--line)] text-sm">
        {rows.map((r) => (
          <li key={r.title} className="flex items-center justify-between py-2.5">
            <span>{r.title}</span>
            <span className={`tabnum font-semibold ${r.win ? "text-up" : "text-down"}`}>{signedMoney(r.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const sky = [
  { x: 10, y: 120, h: 70, up: true },
  { x: 46, y: 90, h: 56, up: false },
  { x: 82, y: 100, h: 80, up: true },
  { x: 118, y: 60, h: 90, up: true },
  { x: 154, y: 80, h: 50, up: false },
  { x: 190, y: 40, h: 96, up: true },
  { x: 226, y: 66, h: 60, up: true },
  { x: 262, y: 30, h: 84, up: true },
  { x: 298, y: 56, h: 52, up: false },
  { x: 334, y: 18, h: 90, up: true },
];

/** Fondo decorativo de velas con brillo suave. */
export function Skyline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 200" className={className} aria-hidden preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="sky-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="sky-mask">
          <rect width="360" height="200" fill="url(#sky-fade)" />
        </mask>
      </defs>
      <g mask="url(#sky-mask)">
        {sky.map((c) => (
          <g key={c.x} className={c.up ? "fill-up stroke-up" : "fill-down stroke-down"}>
            <line x1={c.x + 10} x2={c.x + 10} y1={c.y - 14} y2={c.y + c.h + 14} strokeWidth={2} />
            <rect x={c.x} y={c.y} width={20} height={c.h} rx={4} strokeWidth={0} />
          </g>
        ))}
      </g>
    </svg>
  );
}
