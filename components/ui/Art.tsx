import BotAvatar from "./BotAvatar";
import { bots } from "@/lib/steps";

// Ilustraciones simples y originales para las pantallas informativas.

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-2xl bg-[#1b2420] p-3">{children}</div>;
}

function Confidence() {
  return (
    <Frame>
      <svg viewBox="0 0 300 200" className="w-full">
        {[40, 90, 140, 190, 240].map((x) => (
          <rect key={x} x={x} y="20" width="22" height="140" rx="4" fill="#ffffff" opacity="0.05" />
        ))}
        <path
          d="M15 45 C70 50 90 70 130 80 S190 130 235 150 285 160 285 160"
          fill="none"
          stroke="#fb7185"
          strokeWidth="3"
        />
        <path
          d="M15 150 C70 145 90 130 130 110 S200 85 285 40"
          fill="none"
          stroke="#5eead4"
          strokeWidth="3"
        />
        <circle cx="285" cy="40" r="5" fill="#5eead4" />
        <circle cx="285" cy="160" r="5" fill="#fb7185" />
        <text x="15" y="35" fontSize="9" fill="#fb7185">Miedos y dudas</text>
        <text x="15" y="168" fontSize="9" fill="#5eead4">Confianza al operar</text>
        <text x="15" y="190" fontSize="8" fill="#ffffff" opacity="0.7">Ahora</text>
        <text x="255" y="190" fontSize="8" fill="#ffffff" opacity="0.7">Tu meta</text>
      </svg>
    </Frame>
  );
}

function Bots() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {bots.map((b) => (
        <div key={b.id} className="flex items-center gap-2 rounded-lg bg-panel p-2">
          <BotAvatar color={b.color} size={44} />
          <div className="min-w-0 flex-1 text-[10px]">
            <p className="mb-1 truncate font-semibold">{b.name}</p>
            <div className="h-1 rounded bg-card">
              <div className="h-1 rounded" style={{ width: `${b.activity.level * 100}%`, background: b.color }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Stairs() {
  const rows = ["ÉXITO", "PRÁCTICA", "DESAFÍO", "METAS CLARAS"];
  return (
    <Frame>
      <div className="flex flex-col items-center gap-1 py-2">
        <span className="text-4xl">🏆</span>
        {rows.map((r, i) => (
          <div
            key={r}
            className="rounded bg-[#2f4228] py-1 text-center text-[10px] font-semibold text-white/90"
            style={{ width: `${45 + i * 18}%` }}
          >
            {r}
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Fit() {
  return (
    <Frame>
      <div className="flex items-center justify-center gap-4 py-6">
        <span className="text-6xl">💻</span>
        <span className="text-6xl">📈</span>
        <span className="text-6xl">🙂</span>
      </div>
    </Frame>
  );
}

export default function Art({ kind }: { kind: "confidence" | "bots" | "stairs" | "fit" }) {
  if (kind === "confidence") return <Confidence />;
  if (kind === "bots") return <Bots />;
  if (kind === "stairs") return <Stairs />;
  return <Fit />;
}
