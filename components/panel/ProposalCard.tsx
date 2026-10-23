"use client";

import { useState } from "react";
import BotAvatar from "@/components/ui/BotAvatar";
import { useDemo } from "@/components/panel/DemoProvider";
import { money } from "@/lib/chart";
import { assetBySymbol, fmtPrice, type Proposal } from "@/lib/sim";
import { bots } from "@/lib/steps";
import { riskPercent } from "@/lib/landing";


const statusStyle: Record<Proposal["status"], string> = {
  pendiente: "soft-brand text-brand",
  aprobada: "soft-up text-up",
  rechazada: "bg-surface2 text-muted",
  expirada: "bg-surface2 text-muted",
};

export function StatusPill({ s }: { s: Proposal["status"] }) {
  return <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold capitalize ${statusStyle[s]}`}>{s}</span>;
}

export default function ProposalCard({ p, compact = false }: { p: Proposal; compact?: boolean }) {
  const { approve, reject, now, equity, acc } = useDemo();
  const [open, setOpen] = useState(!compact);
  const bot = bots.find((b) => b.id === p.botId)!;
  const a = assetBySymbol(p.symbol);
  const left = Math.max(0, Math.ceil((p.expiresAt - now) / 1000));
  const live = p.status === "pendiente" && left > 0;
  const status: Proposal["status"] = p.status === "pendiente" && left === 0 ? "expirada" : p.status;
  const riskUsd = (equity * riskPercent) / 100;
  const cost = Math.min((riskUsd / Math.max(1e-9, p.entry - p.stop)) * p.entry, acc.cash, equity * 0.25);

  return (
    <article className="rounded-2xl border border-edge bg-surface p-4 sm:p-5">
      <div className="flex items-start gap-3.5">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl" style={{ background: `color-mix(in srgb, ${bot.color} 16%, transparent)` }}>
          <BotAvatar color={bot.color} size={38} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="font-display text-[1.05rem] font-semibold">
              Comprar {a.symbol}
            </h3>
            <StatusPill s={status} />
          </div>
          <p className="text-[13px] text-muted">
            {bot.name} · {a.name}
          </p>
        </div>
        {live && (
          <div className="text-right text-[12px] text-muted">
            <span className="tabnum font-semibold text-fg">{left}s</span>
            <br />
            para decidir
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          { k: "Entrada", v: p.entry, c: "" },
          { k: "Stop", v: p.stop, c: "text-down" },
          { k: "Objetivo", v: p.target, c: "text-up" },
        ].map((x) => (
          <div key={x.k} className="rounded-xl bg-surface2 px-2 py-2.5">
            <p className="text-[11.5px] font-medium text-muted">{x.k}</p>
            <p className={`tabnum text-[14.5px] font-semibold ${x.c}`}>{fmtPrice(a, x.v)}</p>
          </div>
        ))}
      </div>

      <button onClick={() => setOpen((o) => !o)} className="mt-3 text-[13.5px] font-semibold text-brand hover:underline" aria-expanded={open}>
        {open ? "Ocultar por qué" : "¿Por qué propone esto?"}
      </button>
      {open && <p className="mt-2 text-[14px] leading-relaxed text-muted">{p.reason}</p>}

      {live && (
        <>
          <p className="mt-3 text-[12.5px] text-muted">
            Si apruebas, arriesgas cerca de {money(riskUsd, 0)} ({riskPercent}% de tu saldo) y la posición sería de unos {money(cost, 0)} de saldo virtual.
          </p>
          <div className="mt-3 flex gap-2.5">
            <button onClick={() => approve(p.id)} className="btn-primary flex-1 !py-2.5">
              Aprobar
            </button>
            <button onClick={() => reject(p.id)} className="btn-ghost flex-1 !py-2.5">
              Rechazar
            </button>
          </div>
        </>
      )}
    </article>
  );
}
