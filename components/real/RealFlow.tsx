"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Icon from "@/components/panel/Icon";
import { broker } from "@/lib/broker";
import { steps } from "@/components/real/steps";

type Phase = { n: "intro" } | { n: "risk"; then: "wizard" | "go" } | { n: "wizard"; i: number } | { n: "go" };

function ArtTile({ kind }: { kind: string }) {
  return (
    <div className="relative mx-auto grid h-40 w-full max-w-sm place-items-center overflow-hidden rounded-3xl soft-brand sm:h-48" aria-hidden>
      <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full opacity-40 grad-brand blur-2xl" />
      <div className="absolute -bottom-10 -right-6 h-32 w-32 rounded-full bg-[#38bdf8] opacity-30 blur-2xl" />
      <span className="grad-brand relative grid h-24 w-24 place-items-center rounded-3xl text-[#04161c] shadow-xl sm:h-28 sm:w-28">
        <Icon name={kind} size={46} stroke={1.7} />
      </span>
    </div>
  );
}

const guarantees = [
  { t: "Tú tienes el control", d: "Aurex no maneja tu dinero ni opera por ti. Todo lo haces tú, en el sitio del bróker." },
  { t: "Tu dinero vive con el bróker", d: "El bróker regulado custodia tus fondos y tus datos. Aurex no los recibe." },
  { t: "Vuelve al modo DEMO cuando quieras", d: "Tu simulador y tus bots de práctica siguen aquí con saldo virtual." },
];

const risks = [
  "Operar implica un riesgo financiero real, incluida la posible pérdida de todo el capital invertido.",
  "Los bots de Aurex son de práctica: identifican ideas y las explican, pero no garantizan ganancias. Todas las decisiones y sus resultados son tuyos.",
  "Los resultados pasados de la práctica en modo DEMO no reflejan el rendimiento futuro.",
  "El bróker custodia tus fondos y datos. Aurex no ejecuta operaciones, no tiene acceso a tu cuenta y no es asesoría financiera.",
];

export default function RealFlow() {
  const [ph, setPh] = useState<Phase>({ n: "intro" });
  const [ok, setOk] = useState(false);
  const [pick, setPick] = useState<number | null>(null);

  const open = useCallback(() => {
    window.open(broker.url, "_blank", "noopener,noreferrer");
  }, []);

  const go = (i: number) => {
    setPick(null);
    setPh({ n: "wizard", i });
  };

  useEffect(() => {
    if (ph.n !== "wizard") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") ph.i > 0 && go(ph.i - 1);
      if (e.key === "ArrowRight") {
        const s = steps[ph.i];
        if (ph.i < steps.length - 1 && (s.kind !== "quiz" || pick !== null)) go(ph.i + 1);
      }
      if (e.key === "Escape") setPh({ n: "intro" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // ---------- 1) Bienvenida ----------
  if (ph.n === "intro") {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-medium text-brand">Modo REAL</p>
        <h1 className="mt-1 font-display text-[2rem] font-semibold leading-tight sm:text-[2.4rem]">Opera en el mundo real, con un bróker regulado</h1>
        <p className="mt-2 text-[16px] text-muted">Aquí te enseñamos cómo abrir tu cuenta de corretaje. Tú la abres directamente en el sitio del bróker.</p>

        <ol className="mt-8 space-y-0">
          {guarantees.map((g, i) => (
            <li key={g.t} className="relative flex gap-4 pb-7 last:pb-0">
              {i < guarantees.length - 1 && <span className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-0.5 bg-brand/40" aria-hidden />}
              <span className="grad-brand grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#04161c]">
                <Icon name="check" size={20} stroke={2.6} />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold">{g.t}</h2>
                <p className="text-[14.5px] text-muted">{g.d}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button onClick={() => setPh({ n: "risk", then: "wizard" })} className="btn-primary">
            Crear una cuenta de corretaje
          </button>
          <button onClick={() => setPh({ n: "risk", then: "go" })} className="btn-ghost">
            Ya tengo una cuenta
          </button>
        </div>
      </div>
    );
  }

  // ---------- 2) Aviso de riesgos ----------
  if (ph.n === "risk") {
    const then = ph.then;
    return (
      <div className="mx-auto max-w-2xl">
        <button onClick={() => { setOk(false); setPh({ n: "intro" }); }} className="mb-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-muted hover:text-fg">
          <Icon name="back" size={16} /> Volver
        </button>
        <h1 className="font-display text-[2rem] font-semibold leading-tight">Un detalle antes de continuar</h1>
        <p className="mt-2 text-[15.5px] text-muted">Por favor, lee con atención y confirma antes de ir al bróker:</p>
        <ul className="mt-6 space-y-3.5">
          {risks.map((r) => (
            <li key={r} className="flex gap-3 text-[15px] leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              {r}
            </li>
          ))}
        </ul>

        <label className="mt-7 flex cursor-pointer items-start gap-3.5 rounded-2xl border border-edge bg-surface p-4">
          <input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#14b8a6]" />
          <span className="text-[14.5px] leading-relaxed">He leído y acepto el aviso de riesgos. Entiendo que todos los resultados financieros son mi responsabilidad.</span>
        </label>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button onClick={() => { setOk(false); setPh({ n: "intro" }); }} className="btn-ghost">
            Ahora no
          </button>
          <button
            disabled={!ok}
            onClick={() => {
              if (then === "wizard") go(0);
              else {
                open();
                setPh({ n: "go" });
              }
            }}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-45"
          >
            Confirmar
          </button>
        </div>
      </div>
    );
  }

  // ---------- 3) Redirección ----------
  if (ph.n === "go") {
    return (
      <div className="mx-auto max-w-lg text-center">
        <ArtTile kind="external" />
        <h1 className="mt-8 font-display text-[1.9rem] font-semibold leading-tight">Te llevamos al sitio de {broker.name}</h1>
        <p className="mt-2 text-[15.5px] text-muted">Se abrió en una pestaña nueva. Ahí inicias sesión (o creas tu cuenta) directamente con el bróker. Si no se abrió, usa el botón.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a href={broker.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Ir a {broker.name} <Icon name="external" size={16} />
          </a>
          <Link href="/panel" className="btn-ghost">
            Volver al DEMO
          </Link>
        </div>
      </div>
    );
  }

  // ---------- 4) Asistente paso a paso ----------
  const s = steps[ph.i];
  const last = ph.i === steps.length - 1;
  const canNext = s.kind !== "quiz" || pick !== null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col">
      <div className="flex items-center gap-4">
        <button onClick={() => setPh({ n: "intro" })} aria-label="Salir del asistente" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-edge hover:bg-surface2">
          <Icon name="close" />
        </button>
        <div className="h-2.5 flex-1 rounded-full bg-surface2" role="progressbar" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={ph.i + 1} aria-label="Progreso">
          <div className="grad-brand h-full rounded-full transition-all duration-300" style={{ width: `${((ph.i + 1) / steps.length) * 100}%` }} />
        </div>
        <span className="text-[13px] font-semibold text-muted tabnum">{ph.i + 1}/{steps.length}</span>
      </div>

      <div key={ph.i} className="mt-6 animate-rise">
        <ArtTile kind={s.art} />
        {s.kind === "info" && s.tag && <span className="mt-7 inline-block rounded-md bg-brand/15 px-2.5 py-1 text-[11.5px] font-bold tracking-wide text-brand">{s.tag}</span>}
        <h1 className={`${s.kind === "info" && s.tag ? "mt-3" : "mt-7"} font-display text-[1.75rem] font-semibold leading-tight sm:text-[2rem]`}>{s.title}</h1>

        {s.kind === "quiz" ? (
          <>
            <p className="mt-3 text-[16px] text-muted">{s.question}</p>
            <div className="mt-4 space-y-2.5">
              {s.options.map((o, k) => {
                const show = pick !== null;
                const right = k === s.correct;
                return (
                  <button
                    key={o}
                    disabled={show}
                    onClick={() => setPick(k)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-[15.5px] transition-colors ${
                      show && right ? "border-up soft-up" : show && pick === k ? "border-down soft-down" : "border-edge bg-surface hover:border-brand"
                    }`}
                  >
                    {o}
                    {show && right && <Icon name="check" className="text-up" />}
                  </button>
                );
              })}
            </div>
            {pick !== null && <p className={`mt-4 rounded-xl p-4 text-[14.5px] leading-relaxed ${pick === s.correct ? "soft-up" : "soft-down"}`}>{pick === s.correct ? s.ok : s.no}</p>}
          </>
        ) : (
          <div className="mt-4 space-y-3.5 text-[16px] leading-relaxed">
            {s.body.map((b) => (
              <p key={b}>{b}</p>
            ))}
            {s.kind === "list" && (
              <ol className="mt-2 space-y-2.5">
                {s.items.map((it, k) => (
                  <li key={it.t} className="flex gap-3.5 rounded-xl border border-edge bg-surface p-3.5">
                    <span className="grad-brand grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[13px] font-bold text-[#04161c]">{k + 1}</span>
                    <div>
                      <p className="text-[15px] font-semibold leading-tight">{it.t}</p>
                      <p className="mt-0.5 text-[13.5px] text-muted">{it.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>

      <div className="sticky bottom-20 mt-8 flex items-center justify-between gap-3 rounded-2xl border border-edge bg-surface p-3 card-shadow lg:bottom-4">
        <button onClick={() => go(Math.max(0, ph.i - 1))} disabled={ph.i === 0} className="btn-ghost !py-2.5 disabled:opacity-40">
          <Icon name="back" size={16} /> Anterior
        </button>
        {last ? (
          <div className="flex flex-wrap justify-end gap-2.5">
            <Link href="/panel" className="btn-ghost !py-2.5">
              Volver al DEMO
            </Link>
            <a href={broker.url} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2.5">
              Ir a {broker.name} <Icon name="external" size={16} />
            </a>
          </div>
        ) : (
          <button onClick={() => go(ph.i + 1)} disabled={!canNext} className="btn-primary !py-2.5 min-w-36 disabled:opacity-50">
            Continuar <Icon name="arrow" size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
