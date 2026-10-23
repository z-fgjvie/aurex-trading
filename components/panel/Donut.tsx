"use client";

type Seg = { label: string; value: number; color: string };

export default function Donut({ segs, size = 132, center }: { segs: Seg[]; size?: number; center?: React.ReactNode }) {
  const total = segs.reduce((s, x) => s + Math.max(0, x.value), 0) || 1;
  const r = size / 2 - 11;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Distribución de tu saldo">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={14} />
        {segs.map((s) => {
          const len = (Math.max(0, s.value) / total) * c;
          const el = (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={14}
              strokeDasharray={`${Math.max(0, len - 2)} ${c - Math.max(0, len - 2)}`}
              strokeDashoffset={-acc}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              strokeLinecap="butt"
            />
          );
          acc += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{center}</div>
    </div>
  );
}
