"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDemo } from "@/components/panel/DemoProvider";
import Icon from "@/components/panel/Icon";
import { Card, PageTitle } from "@/components/panel/ui";
import { days, totalLessons, weeks, type Day, type Lesson } from "@/lib/demo-content";

function Player({ day, onClose }: { day: Day; onClose: () => void }) {
  const { acc, completeLesson } = useDemo();
  const lessons = day.lessons!;
  const firstOpen = Math.max(0, lessons.findIndex((l) => !acc.learn[l.id]));
  const [i, setI] = useState(firstOpen);
  const [pick, setPick] = useState<number | null>(null);
  const l: Lesson = lessons[i];
  const done = !!acc.learn[l.id];
  const last = i === lessons.length - 1;
  const answered = l.quiz ? pick !== null : true;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const next = () => {
    completeLesson(l.id);
    setPick(null);
    if (last) onClose();
    else setI(i + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-canvas" role="dialog" aria-modal="true" aria-label={`Día ${day.n}: ${day.title}`}>
      <div className="mx-auto flex w-full max-w-2xl items-center gap-4 px-5 py-4">
        <button onClick={onClose} aria-label="Cerrar la lección" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-edge hover:bg-surface2">
          <Icon name="close" />
        </button>
        <div className="h-2.5 flex-1 rounded-full bg-surface2" role="progressbar" aria-valuemin={0} aria-valuemax={lessons.length} aria-valuenow={i + (done ? 1 : 0)}>
          <div className="grad-brand h-full rounded-full transition-all" style={{ width: `${((i + (done ? 1 : 0)) / lessons.length) * 100}%` }} />
        </div>
        <span className="text-[13px] font-semibold text-muted">{i + 1}/{lessons.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl px-5 pb-10 pt-4">
          <span className="rounded-full soft-brand px-3 py-1 text-[12px] font-semibold text-brand">Día {day.n} · {l.kind} · {l.minutes} min</span>
          <h2 className="mt-4 font-display text-[1.9rem] font-semibold leading-tight">{l.title}</h2>
          <div className="mt-5 space-y-4 text-[16px] leading-relaxed">
            {l.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {l.quiz && (
            <div className="mt-8">
              <p className="font-display text-xl font-semibold">{l.quiz.q}</p>
              <div className="mt-4 space-y-2.5">
                {l.quiz.options.map((o, k) => {
                  const chosen = pick === k;
                  const right = l.quiz!.correct === k;
                  const show = pick !== null;
                  return (
                    <button
                      key={o}
                      disabled={show}
                      onClick={() => setPick(k)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-[15.5px] transition-colors ${
                        show && right ? "border-up soft-up" : show && chosen ? "border-down soft-down" : "border-edge bg-surface hover:border-brand"
                      }`}
                    >
                      {o}
                      {show && right && <Icon name="check" className="text-up" />}
                    </button>
                  );
                })}
              </div>
              {pick !== null && (
                <p className={`mt-4 rounded-xl p-4 text-[14.5px] leading-relaxed ${pick === l.quiz.correct ? "soft-up" : "soft-down"}`}>
                  <b>{pick === l.quiz.correct ? "¡Correcto! " : "No exactamente. "}</b>
                  {l.quiz.explain}
                </p>
              )}
            </div>
          )}

          {l.cta && (
            <Link href={l.cta.href} onClick={() => completeLesson(l.id)} className="btn-ghost mt-8">
              {l.cta.label} <Icon name="arrow" size={16} />
            </Link>
          )}
        </div>
      </div>

      <div className="border-t border-edge bg-surface">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-5 py-4">
          <button onClick={() => { setPick(null); setI(Math.max(0, i - 1)); }} disabled={i === 0} className="btn-ghost !py-2.5 disabled:opacity-40">
            Anterior
          </button>
          <button onClick={next} disabled={!answered} className="btn-primary min-w-40 disabled:opacity-50">
            {last ? "Terminar el día" : "Continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LearnView() {
  const { acc } = useDemo();
  const [open, setOpen] = useState<Day | null>(null);
  const done = Object.keys(acc.learn).length;

  const dayDone = (d: Day) => !!d.lessons && d.lessons.every((l) => acc.learn[l.id]);
  const unlocked = (d: Day) => !!d.lessons && (d.n === 1 || dayDone(days[d.n - 2]));

  return (
    <>
      <PageTitle title="Reto Trader IA de 28 días" sub="Aprende paso a paso: lecturas cortas, preguntas y práctica con tu simulador." />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="grad-brand border-0 p-6 text-[#04161c] lg:col-span-2">
          <p className="text-[14px] font-semibold opacity-80">Tu progreso</p>
          <p className="mt-1 font-display text-3xl font-semibold">{done} de {totalLessons} lecciones disponibles</p>
          <div className="mt-4 h-3 rounded-full bg-white/40">
            <div className="h-3 rounded-full bg-[#04161c]" style={{ width: `${(done / totalLessons) * 100}%` }} />
          </div>
          <p className="mt-3 text-[13.5px] font-medium opacity-80">La semana 1 ya está abierta. Los demás días se abren pronto.</p>
        </Card>
        <Card className="flex items-center gap-4 p-6">
          <span className="grid h-14 w-14 place-items-center rounded-2xl soft-down text-down"><Icon name="flame" size={28} /></span>
          <div>
            <p className="text-[13.5px] text-muted">Racha de estudio</p>
            <p className="font-display text-3xl font-semibold">{acc.streak.days} {acc.streak.days === 1 ? "día" : "días"}</p>
          </div>
        </Card>
      </div>

      <div className="mt-8 space-y-9">
        {weeks.map((w) => (
          <section key={w.n} aria-label={w.title}>
            <h2 className="font-display text-xl font-semibold">{w.title}</h2>
            <div className="mt-4 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {days.filter((d) => d.week === w.n).map((d) => {
                const ok = unlocked(d);
                const fin = dayDone(d);
                const count = d.lessons?.filter((l) => acc.learn[l.id]).length ?? 0;
                return (
                  <button
                    key={d.n}
                    disabled={!ok}
                    onClick={() => setOpen(d)}
                    className={`relative rounded-2xl border p-4 text-left transition-all ${
                      ok ? "border-edge bg-surface card-shadow hover:-translate-y-0.5 hover:border-brand" : "border-edge/70 bg-surface/50 opacity-70"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] font-bold uppercase tracking-wide text-muted">Día {String(d.n).padStart(2, "0")}</span>
                      {fin ? (
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-up text-[#04161c]"><Icon name="check" size={14} stroke={2.6} /></span>
                      ) : !d.lessons ? (
                        <Icon name="lock" size={16} className="text-muted" />
                      ) : !ok ? (
                        <Icon name="lock" size={16} className="text-muted" />
                      ) : null}
                    </div>
                    <p className="mt-2 font-display text-[1.05rem] font-semibold leading-snug">{d.title}</p>
                    <p className="mt-1.5 text-[12.5px] text-muted">{!d.lessons ? "Próximamente" : fin ? "Completado" : ok ? `${count} de ${d.lessons.length} lecciones` : "Termina el día anterior"}</p>
                    {ok && !fin && d.lessons && (
                      <div className="mt-3 h-1.5 rounded-full bg-surface2">
                        <div className="grad-brand h-1.5 rounded-full" style={{ width: `${(count / d.lessons.length) * 100}%` }} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {open && <Player day={open} onClose={() => setOpen(null)} />}
    </>
  );
}
