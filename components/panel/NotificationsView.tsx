"use client";

import { useState } from "react";
import { useDemo } from "@/components/panel/DemoProvider";
import ProposalCard, { StatusPill } from "@/components/panel/ProposalCard";
import { Card, Empty, PageTitle, Segmented, timeAgo } from "@/components/panel/ui";
import { assetBySymbol, fmtPrice, type Proposal } from "@/lib/sim";
import { bots } from "@/lib/steps";

type F = "todas" | Proposal["status"];

export default function NotificationsView() {
  const { acc, now } = useDemo();
  const [f, setF] = useState<F>("todas");
  const list = acc.proposals
    .map((p) => (p.status === "pendiente" && p.expiresAt <= now ? { ...p, status: "expirada" as const } : p))
    .filter((p) => f === "todas" || p.status === f);
  const pending = list.filter((p) => p.status === "pendiente");
  const rest = list.filter((p) => p.status !== "pendiente");

  return (
    <>
      <PageTitle title="Notificaciones de operaciones" sub="Las ideas que te propusieron tus bots y qué decidiste." />
      <div className="mb-5 overflow-x-auto">
        <Segmented
          label="Filtrar por estado"
          value={f}
          onChange={setF}
          options={[
            { value: "todas", label: "Todas" },
            { value: "pendiente", label: "Por decidir" },
            { value: "aprobada", label: "Aprobadas" },
            { value: "rechazada", label: "Rechazadas" },
            { value: "expirada", label: "Expiradas" },
          ]}
        />
      </div>

      {list.length === 0 ? (
        <Empty title="Sin notificaciones" text="Enciende un bot desde la sección Bots y sus ideas aparecerán aquí." />
      ) : (
        <div className="space-y-5">
          {pending.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-2">
              {pending.map((p) => (
                <ProposalCard key={p.id} p={p} />
              ))}
            </div>
          )}
          {rest.length > 0 && (
            <Card className="divide-y divide-edge px-5">
              {rest.slice(0, 40).map((p) => {
                const bot = bots.find((b) => b.id === p.botId)!;
                return (
                  <div key={p.id} className="flex items-center justify-between gap-3 py-3.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="h-9 w-1.5 shrink-0 rounded-full" style={{ background: bot.color }} />
                      <div className="min-w-0">
                        <p className="truncate text-[14.5px] font-semibold">
                          Comprar {p.symbol} <span className="font-normal text-muted">a {fmtPrice(assetBySymbol(p.symbol), p.entry)}</span>
                        </p>
                        <p className="text-[12.5px] text-muted">
                          {bot.name} · {timeAgo(p.createdAt, now)}
                        </p>
                      </div>
                    </div>
                    <StatusPill s={p.status} />
                  </div>
                );
              })}
            </Card>
          )}
        </div>
      )}
    </>
  );
}
