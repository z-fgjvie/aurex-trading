import { createClient } from "@supabase/supabase-js";

// Cliente con la clave de SERVICIO: puede crear cuentas sin pasar por el navegador.
// Úsalo solo en rutas /api del servidor. Nunca lo importes desde un componente "use client".
export function supabaseAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY en las variables de entorno");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
