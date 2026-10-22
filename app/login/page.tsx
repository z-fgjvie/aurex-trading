import type { Metadata } from "next";
import AuthAside from "@/components/auth/AuthAside";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import { authConfigured } from "@/lib/auth";
import { brand } from "@/lib/config";

export const metadata: Metadata = {
  title: `Iniciar sesión · ${brand.name}`,
  robots: { index: false },
};

// Se lee la configuración en cada visita, no al compilar.
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <AuthShell
      aside={
        <AuthAside
          title="Vuelve a practicar donde lo dejaste"
          sub="Entra a tu cuenta para seguir aprendiendo con tu simulador y tus bots de práctica."
          points={[
            "Tu saldo virtual de práctica te espera",
            "Cuatro bots que proponen y explican cada operación",
            "Tú decides: nada se ejecuta sin tu aprobación",
          ]}
        />
      }
    >
      <LoginForm configured={authConfigured()} />
    </AuthShell>
  );
}
