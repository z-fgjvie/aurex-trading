// Indicador de progreso del recorrido: Quiz → Pago → Tu cuenta.
const steps = ["Quiz", "Pago", "Tu cuenta"];

export default function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center" aria-label="Progreso">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none" aria-current={active ? "step" : undefined}>
            <span className="flex items-center gap-2">
              <span
                className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${
                  done ? "grad-brand text-[#04161c]" : active ? "border-2 border-brand text-brand" : "border border-edge text-muted"
                }`}
              >
                {done ? (
                  <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m2.5 6.3 2.4 2.4 4.6-5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span className={`text-[13px] font-medium ${active || done ? "text-fg" : "text-muted"}`}>{label}</span>
            </span>
            {i < steps.length - 1 && <span className={`mx-3 h-px flex-1 ${done ? "bg-brand" : "bg-edge"}`} aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
