import AuthAside from "@/components/auth/AuthAside";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";
import Stepper from "@/components/auth/Stepper";
import StatusCard from "@/components/auth/StatusCard";
import { money } from "@/lib/chart";
import { brand, currencyLabel } from "@/lib/config";
import { planIncludes, planTitle, virtualBalance } from "@/lib/landing";
import type { PurchaseResult } from "@/lib/purchase";

function Aside() {
  return (
    <AuthAside
      title="¡Todo listo para empezar a practicar!"
      sub="Crea tu contraseña y entra a tu simulador. Es práctica con saldo virtual: no arriesgas tu dinero."
      points={[`Saldo virtual de práctica de ${money(virtualBalance, 0)}`, ...planIncludes.slice(1)]}
    />
  );
}

// Las tres caras de /registro según lo que Stripe diga de la compra.
export default function RegisterView({ purchase, configured }: { purchase: PurchaseResult; configured: boolean }) {
  // 1) El enlace no es válido, venció o el pago no existe.
  if (purchase.state === "invalid") {
    return (
      <AuthShell aside={<Aside />}>
        <StatusCard
          tone="error"
          title="No encontramos tu pago"
          actions={[
            { href: "/quiz", label: "Hacer el quiz y elegir mi plan", primary: true },
            { href: "/login", label: "Ya tengo cuenta" },
          ]}
        >
          <p>
            Este enlace no es válido o ya venció. Si ya pagaste, escríbenos a{" "}
            <a className="font-medium text-fg underline underline-offset-4" href={`mailto:${brand.supportEmail}`}>
              {brand.supportEmail}
            </a>{" "}
            con el correo que usaste y lo resolvemos.
          </p>
        </StatusCard>
      </AuthShell>
    );
  }

  const d = purchase.details;

  // 2) Pagó en efectivo o por transferencia y el dinero aún no se acredita.
  if (purchase.state === "pending") {
    return (
      <AuthShell aside={<Aside />}>
        <StatusCard
          tone="wait"
          title="Estamos esperando tu pago"
          actions={[
            { href: `/registro?session_id=${d.sessionId}`, label: "Revisar de nuevo", primary: true },
            { href: "/", label: "Volver al inicio" },
          ]}
        >
          <p>
            Elegiste un método que tarda en acreditarse (efectivo o transferencia). Cuando se confirme, vuelve a este
            mismo enlace para crear tu contraseña. Guárdalo en tus favoritos.
          </p>
        </StatusCard>
      </AuthShell>
    );
  }

  // 3) Pago confirmado: crea tu contraseña. El correo ya viene de la compra.
  return (
    <AuthShell aside={<Aside />}>
      <div className="mb-7">
        <Stepper current={2} />
      </div>

      <div className="rounded-2xl border border-edge bg-surface p-7 card-shadow sm:p-8">
        <h1 className="font-display text-[1.7rem] font-semibold leading-tight">Crea tu contraseña</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">Tu pago está confirmado. Solo falta tu contraseña para entrar.</p>

        <div className="soft-up mt-5 flex items-center gap-3 rounded-xl p-3.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-up text-[#04161c]" aria-hidden>
            <svg width="15" height="15" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m2.5 6.3 2.4 2.4 4.6-5" />
            </svg>
          </span>
          <p className="text-sm leading-snug">
            <span className="font-semibold">Pago confirmado</span>
            {d.planLabel && <> · {planTitle(d.planLabel)}</>}
            <span className="tabnum text-muted">
              {" "}
              · {money(d.amount)} {currencyLabel}
            </span>
          </p>
        </div>

        <div className="mt-6">
          <RegisterForm sessionId={d.sessionId} email={d.email} configured={configured} />
        </div>
      </div>

      <p className="mt-5 text-center text-xs leading-relaxed text-muted">
        Al crear tu cuenta aceptas los términos y la política de privacidad de {brand.name}.
      </p>
    </AuthShell>
  );
}
