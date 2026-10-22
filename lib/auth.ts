// Utilidades de cuentas: configuración, contraseñas y vigencia del plan.
// Este archivo no importa nada del servidor, así que se puede usar también en componentes del navegador.

export const MIN_PASSWORD = 8;
export const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function authConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

// Solo se llama desde el servidor (la clave de servicio nunca debe llegar al navegador).
export function adminConfigured(): boolean {
  return Boolean(authConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** "w4" → 4 semanas. Si el id no sigue ese formato devuelve 0. */
export function planWeeks(planId?: string): number {
  const m = /^w(\d+)$/.exec(planId ?? "");
  return m ? Number(m[1]) : 0;
}

export function accessUntil(fromISO: string, planId?: string): string {
  const d = new Date(fromISO);
  d.setDate(d.getDate() + planWeeks(planId) * 7);
  return d.toISOString();
}

/** Devuelve el mensaje de error, o null si la contraseña sirve. */
export function validatePassword(pw: string): string | null {
  if (pw.length < MIN_PASSWORD) return `Usa al menos ${MIN_PASSWORD} caracteres.`;
  if (pw.length > 72) return "Usa como máximo 72 caracteres.";
  if (!/[a-zA-Z]/.test(pw) || !/\d/.test(pw)) return "Combina letras y números.";
  return null;
}

/** 0 a 4, solo para la barra de ayuda visual. */
export function passwordStrength(pw: string): { score: number; label: string } {
  if (!pw) return { score: 0, label: "" };
  let s = 0;
  if (pw.length >= MIN_PASSWORD) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^a-zA-Z0-9]/.test(pw)) s++;
  if (pw.length < MIN_PASSWORD) return { score: 1, label: "Muy corta" };
  return { score: Math.max(1, s), label: ["", "Débil", "Aceptable", "Buena", "Muy buena"][Math.max(1, s)] };
}
