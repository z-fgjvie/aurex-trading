import type { ReactNode } from "react";
import { money, signedMoney } from "@/lib/chart";

export function Card({ children, className = "", as: Tag = "section" }: { children: ReactNode; className?: string; as?: "section" | "div" | "article" }) {
  return <Tag className={`rounded-2xl border border-edge bg-surface card-shadow ${className}`}>{children}</Tag>;
}

export function CardHead({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="font-display text-lg font-semibold leading-tight">{title}</h2>
        {sub && <p className="mt-0.5 text-[13.5px] text-muted">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function SimTag({ children = "Simulación" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full soft-brand px-2.5 py-1 text-[11.5px] font-semibold text-brand">
      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
      {children}
    </span>
  );
}

export function Delta({ value, pct, className = "" }: { value?: number; pct?: number; className?: string }) {
  const n = value ?? pct ?? 0;
  const up = n >= 0;
  return (
    <span className={`tabnum font-semibold ${up ? "text-up" : "text-down"} ${className}`}>
      {value !== undefined ? signedMoney(value) : `${up ? "+" : "−"}${Math.abs(n).toFixed(2)}%`}
    </span>
  );
}

export function PageTitle({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-[1.75rem] font-semibold leading-tight sm:text-[2.1rem]">{title}</h1>
        {sub && <p className="mt-1 max-w-2xl text-[15px] text-muted">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function Empty({ title, text, children }: { title: string; text: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-edge px-5 py-8 text-center">
      <p className="font-display text-base font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-[14px] text-muted">{text}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function Meter({ label, value, level, color }: { label: string; value: string; level: number; color: string }) {
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

export const fmtMoney = money;

export function Segmented<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex rounded-xl bg-surface2 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-lg px-3.5 py-1.5 text-[13.5px] font-semibold transition-colors ${value === o.value ? "bg-surface text-fg shadow-sm" : "text-muted hover:text-fg"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function timeAgo(ts: number, now: number): string {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 60) return `hace ${s} s`;
  const m = Math.round(s / 60);
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.round(h / 24)} d`;
}
