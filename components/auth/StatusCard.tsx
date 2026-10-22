import Link from "next/link";
import type { ReactNode } from "react";

// Tarjeta para los casos en que no se puede crear la cuenta (pago no encontrado o pendiente).
export default function StatusCard({
  tone,
  title,
  children,
  actions,
}: {
  tone: "wait" | "error";
  title: string;
  children: ReactNode;
  actions: { href: string; label: string; primary?: boolean }[];
}) {
  return (
    <div className="rounded-2xl border border-edge bg-surface p-7 text-center card-shadow sm:p-8">
      <span className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${tone === "wait" ? "soft-brand text-brand" : "soft-down text-down"}`}>
        {tone === "wait" ? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5M12 16.5v.01" />
          </svg>
        )}
      </span>
      <h1 className="mt-5 font-display text-[1.55rem] font-semibold leading-tight">{title}</h1>
      <div className="mt-3 text-[15px] leading-relaxed text-muted">{children}</div>
      <div className="mt-6 flex flex-col gap-3">
        {actions.map((a) => (
          <Link key={a.href + a.label} href={a.href} className={a.primary ? "btn-primary" : "btn-ghost"}>
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
