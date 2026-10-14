import { brand } from "@/lib/config";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
        <defs>
          <linearGradient id="aurexg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5eead4" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <path d="M13 2 24 22H17.5L13 13.5 8.5 22H2z" fill="url(#aurexg)" />
        <circle cx="13" cy="19" r="2.2" fill="#0f1012" />
      </svg>
      <span className="text-xl font-semibold tracking-tight text-accent">{brand.name}</span>
    </div>
  );
}
