import { brand } from "@/lib/config";

export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
        <defs>
          <linearGradient id="brandmark-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5eead4" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <path d="M13 2 24 22H17.5L13 13.5 8.5 22H2z" fill="url(#brandmark-g)" />
      </svg>
      <span className="font-display text-[1.35rem] font-semibold tracking-tight text-fg">{brand.name}</span>
    </span>
  );
}
