"use client";

import { useState } from "react";
import AssetPicker from "@/components/panel/AssetPicker";
import { useDemo } from "@/components/panel/DemoProvider";
import LiveChart, { PriceHead } from "@/components/panel/LiveChart";
import {
  Card,
  CardHead,
  Delta,
  Empty,
  PageTitle,
  SimTag,
  timeAgo,
} from "@/components/panel/ui";
import { money } from "@/lib/chart";
import { assetBySymbol, fmtPrice, lastClose, positionPnl } from "@/lib/sim";

export default function SimulatorView() {
  const { acc, markets, buy, close, equity, now, start } = useDemo();
  const [sym, setSym] = useState("BTC");
  const [amount, setAmount] = useState("500");
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const a = assetBySymbol(sym);
  const price = lastClose(markets, sym);
  const amt = Number(amount.replace(/,/g, ""));
  const valid = Number.isFinite(amt) && amt >= 10 && amt <= acc.cash + 1e-6;

  const submit = () => {
    if (!valid) {
      setMsg({
        ok: false,
        t:
          amt > acc.cash
            ? "No tienes tanto saldo disponible."
            : "Escribe un monto de al menos $10.",
      });
      return;
    }
    buy(sym, amt);
    setMsg({
      ok: true,
      t: `Compraste ${(amt / price).toFixed(a.decimals > 2 ? 2 : 4)} ${a.symbol} con saldo virtual.`,
    });
    setTimeout(() => setMsg(null), 3500);
  };

  const quick = (pct: number) =>
    setAmount(String(Math.floor((acc.cash * pct) / 100)));
  const open = acc.positions;
  const open$ = open.reduce((s, p) => s + positionPnl(p, markets), 0);

  return (
    <>
      <PageTitle
        title="Simulador de trading"
        sub="Practica con saldo virtual y precios ficticios que se mueven en vivo. Nada de esto es dinero real."
        right={<SimTag>Saldo actual</SimTag>}
      />

      <div className="grid gap-5 lg:grid-cols-12">
        <Card className="min-w-0 p-5 lg:col-span-8">
          <AssetPicker value={sym} onChange={setSym} />
          <div className="mt-3">
            <PriceHead symbol={sym} />
          </div>
          <div className="mt-2">
            <LiveChart symbol={sym} height={430} />
          </div>
          <p className="mt-2 text-[12.5px] text-muted">
            Pasa el cursor (o el dedo) sobre el gráfico para ver apertura,
            máximo, mínimo y cierre. La línea naranja es la media de 20 velas.
            Cada vela son 5 minutos de mercado ficticio.
          </p>
        </Card>

        <div className="min-w-0 space-y-5 lg:col-span-4">
          <Card className="p-5">
            <CardHead
              title={`Comprar ${a.symbol}`}
              sub={`Precio actual: $${fmtPrice(a, price)}`}
            />
            <div className="mt-4 rounded-xl bg-surface2 p-3.5 text-[13.5px]">
              <div className="flex justify-between">
                <span className="text-muted">Disponible</span>
                <span className="tabnum font-bold">{money(acc.cash)}</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-muted">Saldo total</span>
                <span className="tabnum font-bold">{money(equity)}</span>
              </div>
            </div>
            <label
              htmlFor="amount"
              className="mt-4 block text-[13.5px] font-semibold"
            >
              Monto de saldo
            </label>
            <div className="relative mt-1.5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                $
              </span>
              <input
                id="amount"
                inputMode="decimal"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value.replace(/[^0-9.,]/g, ""))
                }
                className="field !pl-8 tabnum"
              />
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {[10, 25, 50, 100].map((p) => (
                <button
                  key={p}
                  onClick={() => quick(p)}
                  className="rounded-lg bg-surface2 py-1.5 text-[12.5px] font-semibold text-muted transition-colors hover:text-fg"
                >
                  {p === 100 ? "Todo" : `${p}%`}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[13px] text-muted tabnum">
              Recibirás ≈{" "}
              {valid ? (amt / price).toFixed(a.decimals > 2 ? 2 : 4) : "—"}{" "}
              {a.symbol}
            </p>
            <button onClick={submit} className="btn-primary mt-4 w-full">
              Comprar
            </button>
            <div aria-live="polite" className="min-h-6">
              {msg && (
                <p
                  className={`mt-3 text-[13.5px] font-medium ${msg.ok ? "text-up" : "text-down"}`}
                >
                  {msg.t}
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-5 p-5 sm:p-6">
        <CardHead
          title="Posiciones abiertas"
          right={open.length ? <Delta value={open$} /> : undefined}
          sub={open.length ? "Resultado sin cerrar" : undefined}
        />
        <div className="mt-4">
          {open.length === 0 ? (
            <Empty
              title="No tienes posiciones abiertas"
              text="Compra un activo arriba o aprueba la idea de un bot y la verás aquí."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-[14px]">
                <thead className="text-[12.5px] uppercase tracking-wide text-muted">
                  <tr>
                    <th className="pb-2 font-semibold">Activo</th>
                    <th className="pb-2 font-semibold">Entrada</th>
                    <th className="pb-2 font-semibold">Actual</th>
                    <th className="pb-2 font-semibold">Stop / Objetivo</th>
                    <th className="pb-2 text-right font-semibold">Resultado</th>
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-edge">
                  {open.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 font-semibold">
                        {p.symbol}
                        <span className="block text-[12.5px] font-normal text-muted">
                          {p.botId ? "De un bot" : "Manual"}
                        </span>
                      </td>
                      <td className="tabnum py-3">
                        {fmtPrice(p.symbol, p.entry)}
                      </td>
                      <td className="tabnum py-3">
                        {fmtPrice(p.symbol, lastClose(markets, p.symbol))}
                      </td>
                      <td className="tabnum py-3 text-[13px] text-muted">
                        {p.stop !== undefined
                          ? `${fmtPrice(p.symbol, p.stop)} / ${fmtPrice(p.symbol, p.target!)}`
                          : "—"}
                      </td>
                      <td className="py-3 text-right">
                        <Delta value={positionPnl(p, markets)} />
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <button
                          onClick={() => close(p.id)}
                          className="btn-ghost !px-3 !py-1.5 !text-[13px]"
                        >
                          Cerrar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      <Card className="mt-5 p-5 sm:p-6">
        <CardHead
          title="Historial de órdenes"
          sub={`Saldo inicial: ${money(start, 0)} virtuales`}
        />
        <div className="mt-4">
          {acc.orders.length === 0 ? (
            <p className="text-[14px] text-muted">Aún no hay operaciones.</p>
          ) : (
            <ul className="divide-y divide-edge">
              {acc.orders.slice(0, 12).map((o) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between gap-3 py-2.5 text-[14px]"
                >
                  <div className="min-w-0">
                    <p className="font-semibold capitalize">
                      {o.side} {o.symbol}{" "}
                      <span className="font-normal normal-case text-muted">
                        · {o.note}
                      </span>
                    </p>
                    <p className="text-[12.5px] text-muted">
                      {timeAgo(o.ts, now)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="tabnum">{fmtPrice(o.symbol, o.price)}</p>
                    {o.pnl !== undefined && (
                      <Delta value={o.pnl} className="text-[13px]" />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </>
  );
}
