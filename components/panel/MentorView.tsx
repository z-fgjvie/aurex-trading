"use client";

import { useEffect, useRef, useState } from "react";
import { Card, SimTag } from "@/components/panel/ui";
import Icon from "@/components/panel/Icon";
import { mentorFallback, mentorName, mentorQa } from "@/lib/demo-content";

type Msg = { id: number; from: "yo" | "mentor"; text: string };

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function answer(q: string): string {
  const n = norm(q);
  let best: { score: number; a: string } | null = null;
  for (const qa of mentorQa) {
    const score = qa.keys.reduce((s, k) => (n.includes(norm(k)) ? s + 1 : s), 0) + (norm(qa.q) === n ? 5 : 0);
    if (score > 0 && (!best || score > best.score)) best = { score, a: qa.a };
  }
  return best ? best.a : mentorFallback;
}

export default function MentorView() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 0, from: "mentor", text: `¡Hola! Soy ${mentorName}, tu mentor de práctica. Pregúntame sobre velas, riesgo, stops, indicadores o cómo funcionan los bots.\n\nEn esta demostración mis respuestas están preparadas de antemano. No soy un asesor financiero.` },
  ]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const id = useRef(1);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, typing]);

  const send = (q: string) => {
    const t = q.trim();
    if (!t || typing) return;
    setMsgs((m) => [...m, { id: id.current++, from: "yo", text: t }]);
    setText("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { id: id.current++, from: "mentor", text: answer(t) }]);
      setTyping(false);
    }, 800 + Math.random() * 500);
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span className="grad-brand grid h-12 w-12 place-items-center rounded-2xl text-[#04161c]">
            <Icon name="chat" size={24} />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold leading-tight">Mentor de IA</h1>
            <p className="text-[13.5px] text-muted">{mentorName} · respuestas preparadas para la demo</p>
          </div>
        </div>
        <SimTag>Demo</SimTag>
      </div>

      <Card className="flex min-h-[420px] flex-col p-4 sm:p-5" as="div">
        <div className="flex-1 space-y-4 overflow-y-auto pb-2" aria-live="polite">
          {msgs.map((m) => (
            <div key={m.id} className={`flex ${m.from === "yo" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed ${m.from === "yo" ? "grad-brand rounded-br-md text-[#04161c]" : "rounded-bl-md bg-surface2"}`}>{m.text}</div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-surface2 px-4 py-3.5" aria-label="El mentor está escribiendo">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={end} />
        </div>

        <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-2">
          {mentorQa.slice(0, 7).map((qa) => (
            <button key={qa.q} onClick={() => send(qa.q)} disabled={typing} className="shrink-0 rounded-full border border-edge px-3.5 py-1.5 text-[13px] font-medium text-muted transition-colors hover:border-brand hover:text-fg disabled:opacity-50">
              {qa.q}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(text);
          }}
          className="mt-1 flex gap-2.5"
        >
          <label htmlFor="q" className="sr-only">
            Tu pregunta
          </label>
          <input id="q" value={text} onChange={(e) => setText(e.target.value)} placeholder="Pregunta lo que quieras…" className="field flex-1" autoComplete="off" />
          <button type="submit" disabled={!text.trim() || typing} className="btn-primary !px-4 disabled:opacity-50" aria-label="Enviar">
            <Icon name="arrow" />
          </button>
        </form>
      </Card>
      <p className="mt-3 text-[12.5px] text-muted">El Mentor de IA no es un asesor de inversiones: invertir conlleva riesgos. No te bases únicamente en estas respuestas.</p>
    </div>
  );
}
