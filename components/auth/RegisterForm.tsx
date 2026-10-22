"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import PasswordField from "./PasswordField";
import { validatePassword } from "@/lib/auth";

type Props = { sessionId: string; email: string; configured: boolean };

export default function RegisterForm({ sessionId, email, configured }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(false);

  const mismatch = confirm.length > 0 && confirm !== password;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const pwError = validatePassword(password);
    if (pwError) return setError(pwError);
    if (password !== confirm) return setError("Las contraseñas no coinciden.");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        setExists(true);
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "No pudimos crear tu cuenta. Inténtalo de nuevo.");
        setLoading(false);
        return;
      }
      router.replace(data.signedIn ? "/panel" : "/login");
      router.refresh();
    } catch {
      setError("No pudimos conectarnos. Revisa tu internet e inténtalo otra vez.");
      setLoading(false);
    }
  };

  if (exists) {
    return (
      <div role="status" className="rounded-xl border border-edge bg-surface2 p-4 text-sm leading-relaxed">
        Este correo ya tiene una cuenta creada.{" "}
        <Link href="/login" className="font-semibold text-brand underline underline-offset-4">
          Inicia sesión aquí
        </Link>
        .
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          Tu correo
        </label>
        <div className="relative">
          <input id="email" type="email" value={email} readOnly aria-describedby="email-hint" className="field pr-11" />
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
          </span>
        </div>
        <p id="email-hint" className="mt-1.5 text-xs text-muted">
          Es el correo que usaste en el quiz. Con él vas a iniciar sesión.
        </p>
      </div>

      <PasswordField id="password" label="Crea tu contraseña" value={password} onChange={setPassword} autoComplete="new-password" placeholder="Mínimo 8 caracteres, con letras y números" strength />

      <div>
        <PasswordField id="confirm" label="Repite tu contraseña" value={confirm} onChange={setConfirm} autoComplete="new-password" placeholder="Escríbela otra vez" invalid={mismatch} />
        {mismatch && <p className="mt-1.5 text-xs text-down">Las contraseñas no coinciden.</p>}
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-down/40 bg-down/10 p-3 text-sm leading-snug text-down">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading || !configured} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Creando tu cuenta…" : "Crear cuenta y entrar"}
      </button>

      {!configured && <p className="text-center text-xs text-muted">El registro se está configurando. Vuelve en unos minutos.</p>}
    </form>
  );
}
