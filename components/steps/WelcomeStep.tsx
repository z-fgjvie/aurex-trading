"use client";

import BotAvatar from "@/components/ui/BotAvatar";
import { brand, legalLinks } from "@/lib/config";
import type { FlowCtx } from "@/components/quiz/types";

const candles = [
  { x: 40, y: 150, h: 70, up: true },
  { x: 80, y: 110, h: 60, up: false },
  { x: 120, y: 140, h: 40, up: false },
  { x: 230, y: 120, h: 60, up: true },
  { x: 270, y: 70, h: 90, up: true },
  { x: 310, y: 90, h: 60, up: false },
  { x: 350, y: 130, h: 70, up: false },
];

export default function WelcomeStep({ ctx }: { ctx: FlowCtx }) {
  const choose = (v: "si" | "no") => {
    ctx.update({ hasTraded: v });
    ctx.next();
  };

  return (
    <div className="mx-auto w-full max-w-lg animate-rise px-4 pb-10 pt-5">
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg border border-accent/50 p-3">
          <p className="text-[10px] uppercase text-white/80">Práctica guiada</p>
          <p className="font-semibold">Aprende con saldo virtual</p>
        </div>
        <div className="rounded-lg border border-accent/50 p-3">
          <p className="text-[10px] uppercase text-white/80">Bots de IA</p>
          <p className="font-semibold">Ideas de operación explicadas</p>
        </div>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-3xl bg-gradient-to-b from-[#161a26] to-[#10121a]">
        <svg viewBox="0 0 400 250" className="w-full">
          <text x="24" y="40" fontSize="26" fontWeight="700" fill="#fff">130.81</text>
          <rect x="24" y="50" width="86" height="22" rx="4" fill="#14532d" opacity="0.6" />
          <text x="32" y="66" fontSize="11" fill="#4ade80">↑ 13,6%  +9.00</text>
          {[60, 110, 160, 210].map((y) => (
            <line key={y} x1="20" x2="385" y1={y + 20} y2={y + 20} stroke="#fff" opacity="0.06" />
          ))}
          {candles.map((c) => (
            <g key={c.x}>
              <line x1={c.x + 9} x2={c.x + 9} y1={c.y - 18} y2={c.y + c.h + 14} stroke={c.up ? "#34d399" : "#fb7185"} strokeWidth="2" />
              <rect x={c.x} y={c.y} width="18" height={c.h} rx="2" fill={c.up ? "#34d399" : "#fb7185"} />
            </g>
          ))}
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <BotAvatar color="#5eead4" size={150} />
        </div>
      </div>

      <h1 className="mt-6 text-center text-3xl font-extrabold leading-tight">
        {brand.challengeTitle[0]} <span className="text-accent">{brand.challengeTitle[1]}</span>
        <br />
        {brand.challengeTitle[2]}
      </h1>
      <p className="mt-2 text-center text-sm uppercase tracking-wide text-white/80">
        ¿Alguna vez has operado antes?
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button onClick={() => choose("si")} className="rounded-lg bg-accent py-4 font-bold text-ink hover:bg-accent-dark">
          SÍ ›
        </button>
        <button onClick={() => choose("no")} className="rounded-lg bg-accent py-4 font-bold text-ink hover:bg-accent-dark">
          NO ›
        </button>
      </div>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-white/80">
        Al continuar, aceptas los{" "}
        {legalLinks.slice(0, 3).map((l, i) => (
          <span key={l.label}>
            <a href={l.href} className="text-sky-400 underline">
              {l.label}
            </a>
            {i < 2 ? ", " : ""}
          </span>
        ))}
        .
        <br />
        {brand.company}
      </p>
    </div>
  );
}
