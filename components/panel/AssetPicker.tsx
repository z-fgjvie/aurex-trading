"use client";

import { assets } from "@/lib/sim";

export default function AssetPicker({ value, onChange }: { value: string; onChange: (s: string) => void }) {
  return (
    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Activos">
      {assets.map((a) => (
        <button
          key={a.symbol}
          role="tab"
          aria-selected={value === a.symbol}
          onClick={() => onChange(a.symbol)}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${value === a.symbol ? "grad-brand text-[#04161c]" : "bg-surface2 text-muted hover:text-fg"}`}
        >
          {a.symbol}
        </button>
      ))}
    </div>
  );
}
