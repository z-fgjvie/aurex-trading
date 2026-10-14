import type { Bot } from "@/lib/steps";

function Row({ icon, label, value, level, color }: { icon: string; label: string; value: string; level: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-white/85">
          {icon} {label}
        </span>
        <span className="font-bold">{value}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-card">
        <div className="h-1.5 rounded-full" style={{ width: `${level * 100}%`, background: color }} />
      </div>
    </div>
  );
}

export default function BotStats({ bot }: { bot: Bot }) {
  return (
    <div className="space-y-3">
      <Row icon="🚀" label="Actividad del bot" value={bot.activity.label} level={bot.activity.level} color={bot.color} />
      <Row icon="⚠️" label="Perfil de riesgo" value={bot.risk.label} level={bot.risk.level} color={bot.color} />
      <Row icon="📉" label="Exposición a la volatilidad" value={bot.volatility.label} level={bot.volatility.level} color={bot.color} />
    </div>
  );
}
