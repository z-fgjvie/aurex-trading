// Datos de mercado SIMULADOS. Todo lo que dibujan los gráficos de la landing sale de aquí,
// con un generador determinista (misma semilla = mismas velas). Nada es un precio real.

export type Candle = { o: number; h: number; l: number; c: number; v: number };
export type Levels = { entryIndex: number; entry: number; stop: number; target: number };

export type Scenario = {
  id: string;
  title: string;
  symbol: string;
  candles: Candle[];
  entryIndex: number; // última vela del historial: aquí el bot propone la operación
  entry: number;
  stop: number;
  target: number;
  outcome: "win" | "loss";
  why: string;
  result: string;
};

/** Relación beneficio/riesgo de las ideas de la demo: objetivo al doble de distancia que el stop. */
export const RR = 2;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export function money(n: number, decimals = 2): string {
  const [i, d] = Math.abs(n).toFixed(decimals).split(".");
  const withCommas = i.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${n < 0 ? "-" : ""}$${withCommas}${d ? "." + d : ""}`;
}

export function signedMoney(n: number, decimals = 2): string {
  return `${n >= 0 ? "+" : "−"}${money(Math.abs(n), decimals)}`;
}

/** Media móvil simple; devuelve null donde aún no hay suficientes velas. */
export function sma(candles: Candle[], n: number): (number | null)[] {
  const out: (number | null)[] = [];
  let sum = 0;
  for (let i = 0; i < candles.length; i++) {
    sum += candles[i].c;
    if (i >= n) sum -= candles[i - n].c;
    out.push(i >= n - 1 ? sum / n : null);
  }
  return out;
}

type Spec = {
  id: string;
  title: string;
  symbol: string;
  seed: number;
  hist: number;
  fut: number;
  start: number;
  drift: number;
  vol: number;
  entry: number;
  win: boolean;
  why: string;
  result: string;
};

function build(spec: Spec): Scenario {
  const rnd = mulberry32(spec.seed);
  // Aproximación normal con solo sumas (igual en cualquier navegador).
  const norm = () => (rnd() + rnd() + rnd() + rnd() - 2) * 1.732;

  const raw: Candle[] = [];
  let price = spec.start;
  for (let i = 0; i < spec.hist; i++) {
    const o = price;
    const ret = spec.drift + spec.vol * norm();
    const c = o * (1 + ret);
    const h = Math.max(o, c) * (1 + Math.abs(norm()) * spec.vol * 0.55);
    const l = Math.min(o, c) * (1 - Math.abs(norm()) * spec.vol * 0.55);
    const v = Math.round(900 + rnd() * 800 + (Math.abs(ret) / spec.vol) * 500);
    raw.push({ o, h, l, c, v });
    price = c;
  }

  const k = spec.entry / raw[raw.length - 1].c;
  const candles: Candle[] = raw.map((c) => {
    const o = r2(c.o * k);
    const cl = r2(c.c * k);
    return { o, c: cl, h: Math.max(r2(c.h * k), o, cl), l: Math.min(r2(c.l * k), o, cl), v: c.v };
  });

  const entry = candles[candles.length - 1].c;
  const stop = r2(entry * 0.985);
  const target = r2(entry * 1.03);
  const margin = (target - stop) * 0.1;
  const finalP = spec.win ? target : stop;

  let prev = entry;
  for (let i = 0; i < spec.fut; i++) {
    const p = (i + 1) / spec.fut;
    const last = i === spec.fut - 1;
    const smooth = p * p * (3 - 2 * p);
    const mean = entry + (finalP - entry) * (0.5 * p + 0.5 * smooth);
    let close = mean + norm() * spec.vol * entry * (1 - 0.6 * p) * 1.2;
    if (last) close = finalP;
    else close = Math.min(target - margin, Math.max(stop + margin, close));

    const open = prev;
    let high = Math.max(open, close) + Math.abs(norm()) * spec.vol * entry * 0.5;
    let low = Math.min(open, close) - Math.abs(norm()) * spec.vol * entry * 0.5;
    if (last) {
      if (spec.win) high = Math.max(high, target);
      else low = Math.min(low, stop - 0.02);
    } else {
      high = Math.min(high, target - margin * 0.3);
      low = Math.max(low, stop + margin * 0.3);
    }
    const o = r2(open);
    const c = r2(close);
    candles.push({
      o,
      c,
      h: Math.max(r2(high), o, c),
      l: Math.min(r2(low), o, c),
      v: Math.round(1000 + rnd() * 900 + (Math.abs(close - open) / entry / spec.vol) * 500),
    });
    prev = close;
  }

  return {
    id: spec.id,
    title: spec.title,
    symbol: spec.symbol,
    candles,
    entryIndex: spec.hist - 1,
    entry,
    stop,
    target,
    outcome: spec.win ? "win" : "loss",
    why: spec.why,
    result: spec.result,
  };
}

export const scenarios: Scenario[] = [
  build({
    id: "rebote",
    title: "Rebote en soporte",
    symbol: "NVX",
    seed: 11,
    hist: 56,
    fut: 16,
    start: 52,
    drift: -0.0016,
    vol: 0.0042,
    entry: 48.2,
    win: true,
    why: "El precio bajó varias sesiones seguidas y se frenó en una zona donde ya había rebotado antes. El bot ve un posible rebote y propone comprar con un stop corto, justo debajo de esa zona.",
    result:
      "El precio rebotó y llegó al objetivo. Ganaste el doble de lo que arriesgabas. Si hubiera fallado, el stop corto te sacaba perdiendo poco.",
  }),
  build({
    id: "ruptura",
    title: "Ruptura que falló",
    symbol: "ORBT",
    seed: 29,
    hist: 56,
    fut: 14,
    start: 58,
    drift: 0.0014,
    vol: 0.0038,
    entry: 63.4,
    win: false,
    why: "El precio superó su máximo reciente con más volumen de lo normal. El bot propone seguir esa ruptura, con el stop justo debajo del nivel roto.",
    result:
      "Esta vez la ruptura se desinfló y el precio tocó el stop. Perdiste lo que habías decidido arriesgar, ni un centavo más. Así se ve una pérdida controlada: pequeña y planeada.",
  }),
  build({
    id: "tendencia",
    title: "Tendencia con pausa",
    symbol: "HLIO",
    seed: 47,
    hist: 56,
    fut: 18,
    start: 24,
    drift: 0.0017,
    vol: 0.004,
    entry: 27.9,
    win: true,
    why: "El precio sube con orden y hizo una pausa corta, como quien toma aire. El bot propone entrar a favor de la tendencia, con el stop debajo de la pausa.",
    result:
      "La tendencia retomó y el precio llegó al objetivo. Fíjate que el bot no adivinó nada: solo esperó una pausa y puso un stop pequeño antes de entrar.",
  }),
];
