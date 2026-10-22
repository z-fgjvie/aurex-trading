"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import PasswordField from "./PasswordField";
import { emailRe } from "@/lib/auth";
import { brand } from "@/lib/config";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!emailRe.test(email.trim()) || !password) {
      setError("Escribe tu correo y tu contraseña.");
      return;
    }
    setLoading(true);
    try {
      const { error: err } = await supabaseBrowser().auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (err) {
        setError(
          /invalid|credentials/i.test(err.message)
            ? "El correo o la contraseña no coinciden. Revísalos e inténtalo de nuevo."
            : "No pudimos iniciar tu sesión. Inténtalo en un momento."
        );
        setLoading(false);
        return;
      }
      router.replace("/panel");
      router.refresh();
    } catch {
      setError("No pudimos conectarnos. Revisa tu internet e inténtalo otra vez.");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="rounded-2xl border border-edge bg-surface p-7 card-shadow sm:p-8">
        <h1 className="font-display text-[1.7rem] font-semibold leading-tight">Inicia sesión</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">Entra con el correo y la contraseña de tu cuenta.</p>

        {!configured && (
          <p role="status" className="mt-5 rounded-xl border border-warn/40 bg-warn/10 p-3.5 text-sm leading-snug">
            El inicio de sesión se está configurando. Vuelve en unos minutos.
          </p>
        )}

        <form onSubmit={submit} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="field"
            />
          </div>

          <PasswordField id="password" label="Contraseña" value={password} onChange={setPassword} autoComplete="current-password" placeholder="Tu contraseña" />

          {error && (
            <p role="alert" className="rounded-xl border border-down/40 bg-down/10 p-3 text-sm leading-snug text-down">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading || !configured} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Entrando…" : "Entrar"}
          </button>

          <p className="text-center text-sm text-muted">
            ¿Olvidaste tu contraseña?{" "}
            <a
              href={`mailto:${brand.supportEmail}?subject=${encodeURIComponent("Ayuda con mi contraseña")}`}
              className="font-medium text-fg underline underline-offset-4"
            >
              Escríbenos
            </a>
          </p>
        </form>
      </div>

      <div className="mt-5 rounded-2xl border border-edge p-5 text-center">
        <p className="text-[15px] font-medium">¿Aún no tienes cuenta?</p>
        <p className="mt-1 text-sm leading-snug text-muted">
          Primero haces el quiz de 1 minuto y eliges tu plan. Después creas tu contraseña.
        </p>
        <Link href="/quiz" className="btn-ghost mt-4 w-full">
          Crear cuenta
        </Link>
      </div>
    </div>
  );
}
