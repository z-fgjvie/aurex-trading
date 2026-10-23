"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  equityOf,
  newAccount,
  reduce,
  seedMarkets,
  tickMarkets,
  type Account,
  type BotId,
  type Markets,
} from "@/lib/sim";

export type PanelUser = {
  id: string;
  email: string;
  name: string;
  planLabel: string;
  daysLeft: number;
  accessUntil: string | null;
  startedAt: string | null;
  active: boolean;
};

type Ctx = {
  user: PanelUser;
  start: number;
  markets: Markets;
  acc: Account;
  equity: number;
  pendingCount: number;
  now: number;
  buy: (symbol: string, amount: number) => void;
  close: (id: string) => void;
  approve: (id: string) => void;
  reject: (id: string) => void;
  toggleBot: (id: BotId) => void;
  completeLesson: (key: string) => void;
  reset: () => void;
};

const DemoCtx = createContext<Ctx | null>(null);

export function useDemo() {
  const v = useContext(DemoCtx);
  if (!v) throw new Error("useDemo fuera de DemoProvider");
  return v;
}

const TICK_MS = 2000;

export default function DemoProvider({
  user,
  start,
  children,
}: {
  user: PanelUser;
  start: number;
  children: React.ReactNode;
}) {
  const key = `aurex-demo-v1:${user.id}`;
  const [acc, dispatch] = useReducer(reduce, undefined, () =>
    newAccount(start),
  );
  const [markets, setMarkets] = useState<Markets>(() => seedMarkets());
  const [now, setNow] = useState(() => Date.now());
  const mref = useRef(markets);
  const [hydrated, setHydrated] = useState(false);

  // Carga la cuenta guardada en este navegador (si hay).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as Account;
        if (
          parsed &&
          typeof parsed.cash === "number" &&
          Array.isArray(parsed.positions)
        ) {
          dispatch({ type: "load", acc: { ...newAccount(start), ...parsed } });
        }
      }
    } catch {
      /* sin almacenamiento: la demo sigue funcionando en memoria */
    }
    setHydrated(true);
  }, [key, start]);

  // Solo guarda cuando ya se leyó lo guardado (si no, pisaría la cuenta con la inicial).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(key, JSON.stringify(acc));
    } catch {
      /* ignorar */
    }
  }, [acc, key, hydrated]);

  // El tiempo del mercado simulado avanza solo.
  useEffect(() => {
    const id = setInterval(() => {
      if (document.hidden) return;
      const m = tickMarkets(mref.current);
      mref.current = m;
      const t = Date.now();
      setMarkets(m);
      setNow(t);
      dispatch({ type: "tick", markets: m, now: t });
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  const buy = useCallback(
    (symbol: string, amount: number) =>
      dispatch({
        type: "buy",
        symbol,
        amount,
        markets: mref.current,
        now: Date.now(),
      }),
    [],
  );
  const close = useCallback(
    (id: string) =>
      dispatch({ type: "close", id, markets: mref.current, now: Date.now() }),
    [],
  );
  const approve = useCallback(
    (id: string) =>
      dispatch({ type: "approve", id, markets: mref.current, now: Date.now() }),
    [],
  );
  const reject = useCallback(
    (id: string) => dispatch({ type: "reject", id }),
    [],
  );
  const toggleBot = useCallback(
    (botId: BotId) =>
      dispatch({
        type: "toggleBot",
        botId,
        markets: mref.current,
        now: Date.now(),
      }),
    [],
  );
  const completeLesson = useCallback(
    (k: string) => dispatch({ type: "learn", key: k }),
    [],
  );
  const reset = useCallback(() => dispatch({ type: "reset", start }), [start]);

  const equity = useMemo(() => equityOf(acc, markets), [acc, markets]);
  const pendingCount = acc.proposals.filter(
    (p) => p.status === "pendiente" && p.expiresAt > now,
  ).length;

  const value: Ctx = {
    user,
    start,
    markets,
    acc,
    equity,
    pendingCount,
    now,
    buy,
    close,
    approve,
    reject,
    toggleBot,
    completeLesson,
    reset,
  };
  return <DemoCtx.Provider value={value}>{children}</DemoCtx.Provider>;
}
