"use client";

import { useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import { useDemo } from "@/components/panel/DemoProvider";
import Icon from "@/components/panel/Icon";
import { Card, CardHead, PageTitle } from "@/components/panel/ui";
import { days, totalLessons } from "@/lib/demo-content";
import { money } from "@/lib/chart";

export default function ProfileView() {
  const { user, acc, equity, start, reset } = useDemo();
  const [confirm, setConfirm] = useState(false);
  const closed = acc.orders.filter((o) => o.side === "venta");
  const wins = closed.filter((o) => (o.pnl ?? 0) > 0).length;
  const done = Object.keys(acc.learn).length;
  const level = done >= 15 ? "Avanzado" : done >= 6 ? "Intermedio" : "Novato";
  const until = user.accessUntil ? new Date(user.accessUntil).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" }) : "—";
  const initial = (user.name || user.email).trim().charAt(0).toUpperCase();

  return (
    <>
      <PageTitle title="Mi perfil" />
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <div className="flex items-center gap-4">
            <span className="grad-brand grid h-16 w-16 place-items-center rounded-full font-display text-2xl font-semibold text-[#04161c]">{initial}</span>
            <div className="min-w-0">
              <p className="truncate font-display text-xl font-semibold">{user.name || "Mi cuenta"}</p>
              <p className="truncate text-[13.5px] text-muted">{user.email}</p>
            </div>
          </div>
          <dl className="mt-6 space-y-3 text-[14px]">
            <div className="flex justify-between"><dt className="text-muted">Plan</dt><dd className="font-semibold">{user.planLabel}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Acceso hasta</dt><dd className="font-semibold">{until}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Días restantes</dt><dd className="font-semibold">{user.daysLeft}</dd></div>
          </dl>
          <div className="mt-6 border-t border-edge pt-5">
            <LogoutButton />
          </div>
        </Card>

        <div className="space-y-5 lg:col-span-2">
          <Card className="p-6">
            <CardHead title="Resumen" />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-surface2 p-4">
                <p className="flex items-center gap-1.5 text-[12.5px] text-muted"><Icon name="flame" size={15} className="text-down" /> Racha</p>
                <p className="mt-1 font-display text-2xl font-semibold">{acc.streak.days} {acc.streak.days === 1 ? "día" : "días"}</p>
              </div>
              <div className="rounded-xl bg-surface2 p-4">
                <p className="text-[12.5px] text-muted">Nivel</p>
                <p className="mt-1 font-display text-2xl font-semibold">{level}</p>
              </div>
              <div className="rounded-xl bg-surface2 p-4">
                <p className="text-[12.5px] text-muted">Operaciones cerradas</p>
                <p className="mt-1 font-display text-2xl font-semibold">{closed.length}</p>
              </div>
              <div className="rounded-xl bg-surface2 p-4">
                <p className="text-[12.5px] text-muted">Acertadas</p>
                <p className="mt-1 font-display text-2xl font-semibold">{closed.length ? `${Math.round((wins / closed.length) * 100)}%` : "—"}</p>
              </div>
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-[13.5px]"><span className="text-muted">Progreso del reto de 28 días</span><span className="font-semibold">{done} de {totalLessons} lecciones</span></div>
              <div className="mt-2 h-2 rounded-full bg-surface2"><div className="grad-brand h-2 rounded-full" style={{ width: `${(done / totalLessons) * 100}%` }} /></div>
              <p className="mt-1.5 text-[12.5px] text-muted">{days.filter((d) => d.lessons).length} de 28 días disponibles por ahora.</p>
            </div>
          </Card>

          <Card className="p-6">
            <CardHead title="Saldo virtual" sub="Tu práctica se guarda en este navegador." />
            <p className="tabnum mt-3 font-display text-3xl font-semibold">{money(equity)}</p>
            <p className="text-[13.5px] text-muted">Empezaste con {money(start, 0)} virtuales.</p>
            <div className="mt-5">
              {!confirm ? (
                <button onClick={() => setConfirm(true)} className="btn-ghost !py-2.5">Reiniciar mi saldo de práctica</button>
              ) : (
                <div className="flex flex-wrap items-center gap-3 rounded-xl soft-down p-3.5">
                  <p className="flex-1 text-[14px]">Se borrarán tus posiciones, órdenes e ideas. Tu progreso de lecciones se conserva.</p>
                  <button onClick={() => { reset(); setConfirm(false); }} className="rounded-lg bg-down px-4 py-2 text-[14px] font-bold text-[#04161c]">Sí, reiniciar</button>
                  <button onClick={() => setConfirm(false)} className="btn-ghost !px-4 !py-2">Cancelar</button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
