import AsideChart from "./AsideChart";

// Contenido del panel de marca: un título, el gráfico simulado y tres puntos.
export default function AuthAside({ title, sub, points }: { title: string; sub: string; points: string[] }) {
  return (
    <div className="max-w-lg">
      <h2 className="font-display text-[2.35rem] font-semibold leading-[1.1] tracking-tight xl:text-[2.7rem]">{title}</h2>
      <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">{sub}</p>

      <div className="mt-8">
        <AsideChart />
      </div>

      <ul className="mt-8 space-y-3.5">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-3 text-[15.5px] leading-snug">
            <span className="soft-brand mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-brand">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m2.5 6.3 2.4 2.4 4.6-5" />
              </svg>
            </span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
