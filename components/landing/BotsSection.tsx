import BotAvatar from "@/components/ui/BotAvatar";
import { bots, type Bot } from "@/lib/steps";
import { botTaglines } from "@/lib/landing";

function Stat({ label, value, level, color }: { label: string; value: string; level: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-muted">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 rounded-full bg-surface2">
        <div className="h-1.5 rounded-full" style={{ width: `${level * 100}%`, background: color }} />
      </div>
    </div>
  );
}

function BotCard({ bot }: { bot: Bot }) {
  return (
    <article className="flex flex-col rounded-2xl border border-edge bg-surface p-5 card-shadow">
      <div className="grid place-items-center rounded-xl py-3" style={{ background: `color-mix(in srgb, ${bot.color} 14%, transparent)` }}>
        <BotAvatar color={bot.color} size={104} />
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold">{bot.name}</h3>
      <p className="text-[15px] text-muted">{botTaglines[bot.id]}</p>
      <div className="mt-4 space-y-3">
        <Stat label="Actividad" value={bot.activity.label} level={bot.activity.level} color={bot.color} />
        <Stat label="Riesgo" value={bot.risk.label} level={bot.risk.level} color={bot.color} />
        <Stat label="Volatilidad" value={bot.volatility.label} level={bot.volatility.level} color={bot.color} />
      </div>
      <ul className="mt-4 space-y-1.5 border-t border-edge pt-4 text-[14.5px] text-muted">
        {bot.preset.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: bot.color }} />
            {p}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function BotsSection() {
  return (
    <section id="bots" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
      <div className="max-w-2xl">
        <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Cuatro bots, cuatro formas de practicar</h2>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Cada bot tiene su propio ritmo y su propio nivel de riesgo. Empieza con el que más se parezca a ti y cámbiate cuando quieras.
        </p>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {bots.map((b) => (
          <BotCard key={b.id} bot={b} />
        ))}
      </div>
    </section>
  );
}
