import { testimonials } from "@/lib/config";

// Muestra reseñas solo si cargaste reseñas REALES en lib/config.ts.
// Con `fallback` y sin reseñas, muestra puntos de valor de la propuesta (sin cifras inventadas).
export default function Testimonials({ fallback = false }: { fallback?: boolean }) {
  if (testimonials.length === 0) {
    if (!fallback) return null;
    return (
      <ul className="mx-auto max-w-sm space-y-3 text-left text-sm">
        {[
          "Práctica con saldo virtual, sin arriesgar dinero real",
          "Cada idea del bot viene con su explicación",
          "Tú decides: apruebas o rechazas cada operación",
        ].map((t) => (
          <li key={t} className="flex gap-3 rounded-lg bg-panel p-3">
            <span className="text-accent">✔</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-3 text-left">
      <h3 className="text-center text-lg font-bold">Lo que dicen nuestros usuarios</h3>
      {testimonials.map((t) => (
        <figure key={t.name + t.date} className="rounded-lg bg-panel p-4">
          <figcaption className="text-xs text-white/70">
            {t.name} · {t.city}
          </figcaption>
          <p className="mt-2 text-sm font-semibold">{t.title}</p>
          <p className="mt-1 text-sm text-white/85">{t.text}</p>
          <p className="mt-2 text-[11px] text-white/60">{t.date}</p>
        </figure>
      ))}
    </div>
  );
}
