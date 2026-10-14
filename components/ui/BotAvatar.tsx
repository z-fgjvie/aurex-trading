// Robot original dibujado en SVG (sin imágenes externas). El color cambia por bot.
export default function BotAvatar({ color, size = 72 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden>
      <defs>
        <radialGradient id={`glow-${color}`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={color} stopOpacity="0.35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="38" fill={`url(#glow-${color})`} />
      <rect x="31" y="9" width="18" height="6" rx="3" fill={color} opacity="0.8" />
      <rect x="18" y="16" width="44" height="36" rx="14" fill="#15161a" stroke={color} strokeWidth="3" />
      <circle cx="31" cy="34" r="5" fill="#fff" />
      <circle cx="49" cy="34" r="5" fill="#fff" />
      <circle cx="31" cy="34" r="2" fill={color} />
      <circle cx="49" cy="34" r="2" fill={color} />
      <rect x="33" y="44" width="14" height="3" rx="1.5" fill={color} opacity="0.7" />
      <ellipse cx="40" cy="64" rx="14" ry="4" fill={color} opacity="0.5" />
      <ellipse cx="40" cy="64" rx="8" ry="2" fill="#fff" opacity="0.7" />
    </svg>
  );
}
