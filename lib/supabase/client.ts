import { createBrowserClient } from "@supabase/ssr";

// Cliente para componentes del navegador (formulario de login, cerrar sesión).
export function supabaseBrowser() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}
