// Motor de la simulación del panel. TODO es ficticio: los precios, las velas y los resultados se
// generan en el navegador para enseñar. Ningún dato viene de un mercado real.

import { sma, type Candle } from "@/lib/chart";
import { riskPercent } from "@/lib/landing";

export type AssetKind = "Acciones" | "Cripto" | "Divisas" | "Materias primas";
export type Asset = {
  symbol: string;
  name: string;
  kind: AssetKind;
  price: number;
  vol: number; // volatilidad por vela
  decimals: number;
  color: string;
};

export const assets: Asset[] = [
  { symbol: "AAPL", name: "Apple", kind: "Acciones", price: 228.4, vol: 0.0035, decimals: 2, color: "#94a3b8" },
  { symbol: "MSFT", name: "Microsoft", kind: "Acciones", price: 431.2, vol: 0.003, decimals: 2, color: "#38bdf8" },
  { symbol: "NFLX", name: "Netflix", kind: "Acciones", price: 612.8, vol: 0.005, decimals: 2, color: "#fb7185" },
  { symbol: "TSLA", name: "Tesla", kind: "Acciones", price: 248.6, vol: 0.008, decimals: 2, color: "#f87171" },
  { symbol: "NVDA", name: "Nvidia", kind: "Acciones", price: 138.9, vol: 0.0075, decimals: 2, color: "#86efac" },
  { symbol: "AMZN", name: "Amazon", kind: "Acciones", price: 196.3, vol: 0.0045, decimals: 2, color: "#fbbf24" },
  { symbol: "BTC", name: "Bitcoin", kind: "Cripto", price: 67250, vol: 0.006, decimals: 0, color: "#fb923c" },
  { symbol: "ETH", name: "Ethereum", kind: "Cripto", price: 2610, vol: 0.007, decimals: 1, color: "#a5b4fc" },
  { symbol: "EURUSD", name: "Euro / Dólar", kind: "Divisas", price: 1.0845, vol: 0.0009, decimals: 4, color: "#67e8f9" },
  { symbol: "ORO", name: "Oro", kind: "Materias primas", price: 2685, vol: 0.0025, decimals: 1, color: "#facc15" },
];

export const assetBySymbol = (s: string) => assets.find((a) => a.symbol === s) ?? assets[0];

/** Precio con los decimales propios del activo (sin símbolo de moneda). */
export function fmtPrice(a: Asset | string, v: number): string {
  const asset = typeof a === "string" ? assetBySymbol(a) : a;
  return v.toLocaleString("en-US", { minimumFractionDigits: asset.decimals, maximumFractionDigits: asset.decimals });
}

// ---------- Generador de velas ----------
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function stepCandle(o: number, vol: number, rnd: () => number, drift: number): Candle {
  const norm = () => (rnd() + rnd() + rnd() + rnd() - 2) * 1.732;
  const ret = drift + vol * norm();
  const c = o * (1 + ret);
  const h = Math.max(o, c) * (1 + Math.abs(norm()) * vol * 0.5);
  const l = Math.min(o, c) * (1 - Math.abs(norm()) * vol * 0.5);
  const v = Math.round(800 + rnd() * 900 + (Math.abs(ret) / vol) * 400);
  return { o, h, l, c, v };
}

const HIST = 110;
const MAX = 160;

/** Historial inicial: determinista por activo, con tramos alcistas y bajistas. */
export function seedHistory(a: Asset): Candle[] {
  const rnd = mulberry32(hashSeed(a.symbol));
  const phase = rnd() * 6;
  const out: Candle[] = [];
  let p = a.price * (0.96 + rnd() * 0.04);
  for (let i = 0; i < HIST; i++) {
    const drift = Math.sin(i / 17 + phase) * a.vol * 0.22 + a.vol * 0.02;
    const c = stepCandle(p, a.vol, rnd, drift);
    out.push(c);
    p = c.c;
  }
  // Reescala para que la última vela termine en el precio de referencia del activo.
  const k = a.price / out[out.length - 1].c;
  return out.map((c) => ({ o: c.o * k, h: c.h * k, l: c.l * k, c: c.c * k, v: c.v }));
}

export type Markets = Record<string, Candle[]>;

export function seedMarkets(): Markets {
  const m: Markets = {};
  for (const a of assets) m[a.symbol] = seedHistory(a);
  return m;
}

/** Añade una vela nueva a cada activo ("el tiempo avanza"). */
export function tickMarkets(m: Markets): Markets {
  const out: Markets = {};
  for (const a of assets) {
    const series = m[a.symbol];
    const last = series[series.length - 1];
    const n = series.length;
    const drift = Math.sin((n + a.symbol.length * 7) / 17) * a.vol * 0.2;
    const next = stepCandle(last.c, a.vol, Math.random, drift);
    const arr = [...series, next];
    out[a.symbol] = arr.length > MAX ? arr.slice(arr.length - MAX) : arr;
  }
  return out;
}

export const lastClose = (m: Markets, symbol: string) => {
  const s = m[symbol];
  return s[s.length - 1].c;
};

/** Variación porcentual frente a hace `back` velas. */
export function changePct(series: Candle[], back = 24): number {
  const i = Math.max(0, series.length - 1 - back);
  return ((series[series.length - 1].c - series[i].c) / series[i].c) * 100;
}

// ---------- Indicadores ----------
export function rsi(series: Candle[], n = 14): number {
  if (series.length <= n) return 50;
  let gain = 0;
  let loss = 0;
  for (let i = series.length - n; i < series.length; i++) {
    const d = series[i].c - series[i - 1].c;
    if (d >= 0) gain += d;
    else loss -= d;
  }
  if (loss === 0) return 100;
  const rs = gain / n / (loss / n);
  return 100 - 100 / (1 + rs);
}

export function atrPct(series: Candle[], n = 14): number {
  const s = series.slice(-n);
  const avg = s.reduce((acc, c) => acc + (c.h - c.l), 0) / s.length;
  return (avg / s[s.length - 1].c) * 100;
}

const lastSma = (series: Candle[], n: number) => {
  const v = sma(series, n);
  return v[v.length - 1] ?? series[series.length - 1].c;
};

export type Reading = {
  trend: "alcista" | "bajista" | "lateral";
  rsi: number;
  atr: number;
  sma20: number;
  sma50: number;
  support: number;
  resistance: number;
  momentum: number; // % en 10 velas
  summary: string;
};

/** Lectura técnica de una serie, para la herramienta de análisis. */
export function readSeries(series: Candle[]): Reading {
  const s20 = lastSma(series, 20);
  const s50 = lastSma(series, 50);
  const price = series[series.length - 1].c;
  const gap = (s20 - s50) / s50;
  const trend: Reading["trend"] = gap > 0.003 ? "alcista" : gap < -0.003 ? "bajista" : "lateral";
  const recent = series.slice(-30);
  const support = Math.min(...recent.map((c) => c.l));
  const resistance = Math.max(...recent.map((c) => c.h));
  const mom = ((price - series[Math.max(0, series.length - 11)].c) / series[Math.max(0, series.length - 11)].c) * 100;
  const r = rsi(series);
  const atr = atrPct(series);
  let summary: string;
  if (trend === "alcista") {
    summary = r > 70 ? "Tendencia alcista, pero el precio ya subió mucho: puede venir una pausa." : "Tendencia alcista: la media corta está sobre la larga.";
  } else if (trend === "bajista") {
    summary = r < 30 ? "Tendencia bajista, aunque el precio cayó mucho: podría haber un rebote." : "Tendencia bajista: la media corta está bajo la larga.";
  } else {
    summary = "Sin tendencia clara: el precio se mueve de lado entre su soporte y su resistencia.";
  }
  return { trend, rsi: r, atr, sma20: s20, sma50: s50, support, resistance, momentum: mom, summary };
}

// ---------- Patrones de velas ----------
export type PatternHit = { index: number; name: string; kind: "alcista" | "bajista" | "indecisión"; explain: string };

export function findPatterns(series: Candle[]): PatternHit[] {
  const hits: PatternHit[] = [];
  const start = Math.max(2, series.length - 60);
  for (let i = start; i < series.length; i++) {
    const c = series[i];
    const p = series[i - 1];
    const body = Math.abs(c.c - c.o);
    const range = c.h - c.l || 1e-9;
    const lower = Math.min(c.o, c.c) - c.l;
    const upper = c.h - Math.max(c.o, c.c);
    if (body / range < 0.1) {
      hits.push({ index: i, name: "Doji", kind: "indecisión", explain: "Apertura y cierre casi iguales: compradores y vendedores empatados. Avisa de duda, no de dirección." });
    } else if (lower > body * 2 && upper < body * 0.6 && body / range < 0.4) {
      hits.push({ index: i, name: "Martillo", kind: "alcista", explain: "Cola inferior larga: el precio cayó pero los compradores lo devolvieron arriba. Puede marcar un rebote." });
    } else if (c.c > c.o && p.c < p.o && c.c >= p.o && c.o <= p.c && body > Math.abs(p.c - p.o)) {
      hits.push({ index: i, name: "Envolvente alcista", kind: "alcista", explain: "Una vela verde grande cubre por completo a la roja anterior: los compradores tomaron el control." });
    } else if (c.c < c.o && p.c > p.o && c.o >= p.c && c.c <= p.o && body > Math.abs(p.c - p.o)) {
      hits.push({ index: i, name: "Envolvente bajista", kind: "bajista", explain: "Una vela roja grande cubre a la verde anterior: los vendedores tomaron el control." });
    }
  }
  return hits;
}

// ---------- Escenarios ilustrativos ----------
export type ScenarioPath = { id: "alcista" | "lateral" | "bajista"; label: string; points: number[] };

/** Tres caminos hipotéticos a partir del último precio. Son ilustraciones, no pronósticos. */
export function scenarioPaths(series: Candle[], symbol: string, steps = 24): ScenarioPath[] {
  const a = assetBySymbol(symbol);
  const price = series[series.length - 1].c;
  const defs: { id: ScenarioPath["id"]; label: string; drift: number }[] = [
    { id: "alcista", label: "Escenario alcista", drift: a.vol * 0.22 },
    { id: "lateral", label: "Escenario lateral", drift: 0 },
    { id: "bajista", label: "Escenario bajista", drift: -a.vol * 0.22 },
  ];
  return defs.map((d, k) => {
    const rnd = mulberry32(hashSeed(symbol) + k * 101 + series.length);
    const norm = () => (rnd() + rnd() + rnd() + rnd() - 2) * 1.732;
    const pts = [price];
    for (let i = 0; i < steps; i++) pts.push(pts[i] * (1 + d.drift + a.vol * 0.7 * norm()));
    return { id: d.id, label: d.label, points: pts };
  });
}

// ---------- Bots ----------
export type BotId = "guardian" | "equilibrio" | "camaleon" | "impulso";

type Rule = { p: number; stopPct: number; rr: number; label: string };
export const botRules: Record<BotId, Rule> = {
  guardian: { p: 0.035, stopPct: 0.008, rr: 2, label: "prudente" },
  equilibrio: { p: 0.055, stopPct: 0.012, rr: 2, label: "equilibrado" },
  camaleon: { p: 0.07, stopPct: 0.012, rr: 2, label: "adaptativo" },
  impulso: { p: 0.09, stopPct: 0.02, rr: 2, label: "de impulso" },
};

export type ProposalStatus = "pendiente" | "aprobada" | "rechazada" | "expirada";
export type Proposal = {
  id: string;
  botId: BotId;
  symbol: string;
  entry: number;
  stop: number;
  target: number;
  reason: string;
  createdAt: number;
  expiresAt: number;
  status: ProposalStatus;
};

export const PROPOSAL_SECONDS = 90;

const uid = () => Math.random().toString(36).slice(2, 10);

type Cand = { symbol: string; score: number; reason: string; stopPct?: number };

function evaluate(botId: BotId, symbol: string, series: Candle[]): Cand | null {
  const a = assetBySymbol(symbol);
  const price = series[series.length - 1].c;
  const s20 = lastSma(series, 20);
  const s50 = lastSma(series, 50);
  const r = rsi(series);
  const atr = atrPct(series);
  const up = s20 > s50;
  const prevHigh = Math.max(...series.slice(-11, -1).map((c) => c.h));
  const breakout = price > prevHigh;
  const mom = ((price - series[series.length - 11].c) / series[series.length - 11].c) * 100;
  const f = (n: number) => fmtPrice(a, n);
  const base = `${a.symbol}: media de 20 velas en ${f(s20)} ${up ? "sobre" : "bajo"} la de 50 (${f(s50)}), RSI en ${r.toFixed(0)}.`;

  switch (botId) {
    case "guardian": {
      if (!up || r < 42 || r > 64) return null;
      return { symbol, score: 10 - atr * 6, reason: `${base} Es un movimiento tranquilo (volatilidad ${atr.toFixed(2)}%), justo el tipo de entrada que busca el Bot Guardián: poco ruido y tendencia a favor.` };
    }
    case "equilibrio": {
      if (!up || r < 48 || r > 68) return null;
      return { symbol, score: mom, reason: `${base} La tendencia es alcista y el RSI no está sobrecomprado, así que el Bot Equilibrio ve espacio para subir sin ir al límite.` };
    }
    case "camaleon": {
      const hot = atr > 0.55;
      if (hot) {
        if (!up || !breakout) return null;
        return { symbol, score: mom, stopPct: Math.max(0.012, (atr / 100) * 1.6), reason: `${base} Hay mucha volatilidad (${atr.toFixed(2)}%), así que el Bot Camaleón se vuelve selectivo: solo entra si el precio rompe el máximo de las últimas 10 velas (${f(prevHigh)}). Lo rompió y amplió su stop por el ruido.` };
      }
      const near = Math.abs(price - s20) / s20 < 0.004;
      if (!up || !near || r > 58) return null;
      return { symbol, score: 5 - Math.abs(price - s20) / s20 * 200, stopPct: 0.01, reason: `${base} El mercado está calmado, así que el Bot Camaleón busca retrocesos: el precio volvió a tocar la media de 20 en tendencia alcista, un punto clásico para entrar.` };
    }
    case "impulso": {
      if (!breakout || mom < 0.6) return null;
      return { symbol, score: mom, reason: `${base} El precio rompió su máximo reciente (${f(prevHigh)}) y subió ${mom.toFixed(2)}% en 10 velas. El Bot Impulso persigue estos movimientos fuertes, con un stop más amplio.` };
    }
  }
}

export function makeProposal(botId: BotId, markets: Markets, now: number, relaxed = false): Proposal | null {
  const rule = botRules[botId];
  let best: Cand | null = null;
  for (const a of assets) {
    const c = evaluate(botId, a.symbol, markets[a.symbol]);
    if (c && (!best || c.score > best.score)) best = c;
  }
  if (!best && relaxed) {
    // Al encender un bot elegimos la mejor idea disponible aunque no cumpla todos los criterios,
    // y lo decimos en la explicación.
    let top: { symbol: string; mom: number } | null = null;
    for (const a of assets) {
      const s = markets[a.symbol];
      const mom = ((s[s.length - 1].c - s[s.length - 11].c) / s[s.length - 11].c) * 100;
      if (!top || mom > top.mom) top = { symbol: a.symbol, mom };
    }
    if (top) {
      const a = assetBySymbol(top.symbol);
      best = {
        symbol: top.symbol,
        score: 0,
        reason: `Ahora mismo ningún activo cumple todos los criterios del bot. Como ejemplo de práctica, propone ${a.symbol}, el de mejor impulso reciente (${top.mom.toFixed(2)}% en 10 velas). Fíjate cómo el bot es más selectivo cuando el mercado no le da lo que busca.`,
      };
    }
  }
  if (!best) return null;
  const entry = lastClose(markets, best.symbol);
  const stopPct = best.stopPct ?? rule.stopPct;
  return {
    id: uid(),
    botId,
    symbol: best.symbol,
    entry,
    stop: entry * (1 - stopPct),
    target: entry * (1 + stopPct * rule.rr),
    reason: best.reason,
    createdAt: now,
    expiresAt: now + PROPOSAL_SECONDS * 1000,
    status: "pendiente",
  };
}

// ---------- Cuenta virtual ----------
export type Position = {
  id: string;
  symbol: string;
  qty: number;
  entry: number;
  stop?: number;
  target?: number;
  botId?: BotId | null;
  openedAt: number;
};

export type Order = {
  id: string;
  ts: number;
  symbol: string;
  side: "compra" | "venta";
  qty: number;
  price: number;
  pnl?: number;
  botId?: BotId | null;
  note: string;
};

export type Account = {
  start: number;
  cash: number;
  positions: Position[];
  orders: Order[];
  proposals: Proposal[];
  activeBots: BotId[];
  equity: { t: number; v: number }[];
  learn: Record<string, boolean>;
  streak: { last: string; days: number };
};

export const newAccount = (start: number): Account => ({
  start,
  cash: start,
  positions: [],
  orders: [],
  proposals: [],
  activeBots: [],
  equity: [{ t: Date.now(), v: start }],
  learn: {},
  streak: { last: "", days: 0 },
});

export const equityOf = (acc: Account, m: Markets) =>
  acc.cash + acc.positions.reduce((s, p) => s + p.qty * lastClose(m, p.symbol), 0);

export const positionPnl = (p: Position, m: Markets) => (lastClose(m, p.symbol) - p.entry) * p.qty;

export type Action =
  | { type: "load"; acc: Account }
  | { type: "tick"; markets: Markets; now: number }
  | { type: "buy"; symbol: string; amount: number; markets: Markets; now: number }
  | { type: "close"; id: string; markets: Markets; now: number }
  | { type: "approve"; id: string; markets: Markets; now: number }
  | { type: "reject"; id: string }
  | { type: "toggleBot"; botId: BotId; markets: Markets; now: number }
  | { type: "learn"; key: string }
  | { type: "reset"; start: number };

function closeAt(acc: Account, pos: Position, price: number, now: number, note: string): Account {
  const pnl = (price - pos.entry) * pos.qty;
  return {
    ...acc,
    cash: acc.cash + pos.qty * price,
    positions: acc.positions.filter((p) => p.id !== pos.id),
    orders: [{ id: uid(), ts: now, symbol: pos.symbol, side: "venta" as const, qty: pos.qty, price, pnl, botId: pos.botId ?? null, note }, ...acc.orders].slice(0, 200),
  };
}

export function reduce(acc: Account, a: Action): Account {
  switch (a.type) {
    case "load":
      return a.acc;
    case "reset":
      return { ...newAccount(a.start), learn: acc.learn, streak: acc.streak };
    case "learn": {
      const today = new Date().toISOString().slice(0, 10);
      const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const streak =
        acc.streak.last === today ? acc.streak : { last: today, days: acc.streak.last === y ? acc.streak.days + 1 : 1 };
      return { ...acc, learn: { ...acc.learn, [a.key]: true }, streak };
    }
    case "buy": {
      const price = lastClose(a.markets, a.symbol);
      if (a.amount <= 0 || a.amount > acc.cash + 1e-6) return acc;
      const qty = a.amount / price;
      const pos: Position = { id: uid(), symbol: a.symbol, qty, entry: price, botId: null, openedAt: a.now };
      return {
        ...acc,
        cash: acc.cash - a.amount,
        positions: [pos, ...acc.positions],
        orders: [{ id: uid(), ts: a.now, symbol: a.symbol, side: "compra" as const, qty, price, botId: null, note: "Compra manual en el simulador" }, ...acc.orders].slice(0, 200),
      };
    }
    case "close": {
      const pos = acc.positions.find((p) => p.id === a.id);
      if (!pos) return acc;
      return closeAt(acc, pos, lastClose(a.markets, pos.symbol), a.now, "Cierre manual");
    }
    case "reject":
      return { ...acc, proposals: acc.proposals.map((p) => (p.id === a.id && p.status === "pendiente" ? { ...p, status: "rechazada" as const } : p)) };
    case "approve": {
      const prop = acc.proposals.find((p) => p.id === a.id);
      if (!prop || prop.status !== "pendiente" || prop.expiresAt < a.now) return acc;
      const price = lastClose(a.markets, prop.symbol);
      const equity = equityOf(acc, a.markets);
      const risk = (equity * riskPercent) / 100;
      const perUnit = Math.max(1e-9, prop.entry - prop.stop);
      let cost = (risk / perUnit) * price;
      cost = Math.min(cost, acc.cash, equity * 0.25);
      if (cost < 10) return acc;
      const qty = cost / price;
      // Reajusta stop y objetivo al precio real de ejecución, con la misma distancia.
      const stopPct = (prop.entry - prop.stop) / prop.entry;
      const targetPct = (prop.target - prop.entry) / prop.entry;
      const pos: Position = {
        id: uid(),
        symbol: prop.symbol,
        qty,
        entry: price,
        stop: price * (1 - stopPct),
        target: price * (1 + targetPct),
        botId: prop.botId,
        openedAt: a.now,
      };
      return {
        ...acc,
        cash: acc.cash - cost,
        positions: [pos, ...acc.positions],
        proposals: acc.proposals.map((p) => (p.id === prop.id ? { ...p, status: "aprobada" as const } : p)),
        orders: [{ id: uid(), ts: a.now, symbol: prop.symbol, side: "compra" as const, qty, price, botId: prop.botId, note: "Aprobada por ti" }, ...acc.orders].slice(0, 200),
      };
    }
    case "toggleBot": {
      const on = acc.activeBots.includes(a.botId);
      if (on) return { ...acc, activeBots: acc.activeBots.filter((b) => b !== a.botId) };
      const next: Account = { ...acc, activeBots: [...acc.activeBots, a.botId] };
      const has = next.proposals.some((p) => p.botId === a.botId && p.status === "pendiente");
      if (!has) {
        const prop = makeProposal(a.botId, a.markets, a.now, true);
        if (prop) next.proposals = [prop, ...next.proposals].slice(0, 80);
      }
      return next;
    }
    case "tick": {
      let next = acc;
      // 1) Propuestas vencidas
      if (next.proposals.some((p) => p.status === "pendiente" && p.expiresAt < a.now)) {
        next = { ...next, proposals: next.proposals.map((p) => (p.status === "pendiente" && p.expiresAt < a.now ? { ...p, status: "expirada" as const } : p)) };
      }
      // 2) Stops y objetivos de posiciones de bots
      for (const pos of next.positions) {
        const price = lastClose(a.markets, pos.symbol);
        if (pos.stop !== undefined && price <= pos.stop) next = closeAt(next, pos, pos.stop, a.now, "Se tocó el stop");
        else if (pos.target !== undefined && price >= pos.target) next = closeAt(next, pos, pos.target, a.now, "Se alcanzó el objetivo");
      }
      // 3) Ideas nuevas de los bots activos
      for (const id of next.activeBots) {
        const pending = next.proposals.some((p) => p.botId === id && p.status === "pendiente");
        const openBot = next.positions.some((p) => p.botId === id);
        if (pending || openBot || Math.random() > botRules[id].p) continue;
        const prop = makeProposal(id, a.markets, a.now);
        if (prop) next = { ...next, proposals: [prop, ...next.proposals].slice(0, 80) };
      }
      // 4) Curva de saldo
      const last = next.equity[next.equity.length - 1];
      if (!last || a.now - last.t > 5000) {
        next = { ...next, equity: [...next.equity, { t: a.now, v: equityOf(next, a.markets) }].slice(-180) };
      }
      return next;
    }
  }
}
