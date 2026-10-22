import Link from "next/link";
import BrandMark from "./BrandMark";
import { brand, legalLinks, riskDisclaimer } from "@/lib/config";
import { nav } from "@/lib/landing";

export default function SiteFooter() {
  return (
    <footer className="border-t border-edge bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <BrandMark />
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">{brand.description}</p>
          </div>
          <div>
            <h3 className="font-display text-base font-semibold">Producto</h3>
            <ul className="mt-4 space-y-2.5 text-[15px] text-muted">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="hover:text-fg">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/quiz" className="hover:text-fg">
                  Hacer el quiz
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-base font-semibold">Soporte y legal</h3>
            <ul className="mt-4 space-y-2.5 text-[15px] text-muted">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-fg">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${brand.supportEmail}`} className="hover:text-fg">
                  {brand.supportEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-edge pt-8">
          <h3 className="font-display text-base font-semibold">Aviso legal</h3>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted">
            {brand.name} es una plataforma educativa. No ofrecemos asesoría financiera ni de inversión, y todo lo que ves en este sitio (gráficos, precios, operaciones y saldos) es una simulación con datos ficticios. {riskDisclaimer} Operar en mercados reales implica riesgos, incluida la pérdida de tu dinero.
          </p>
          <p className="mt-6 text-sm text-muted">
            © {new Date().getFullYear()} {brand.company}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
