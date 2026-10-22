import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cliente para páginas y rutas del servidor: lee y escribe la sesión en las cookies.
export function supabaseServer() {
  const store = cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Desde una página (no ruta) no se pueden escribir cookies; el middleware ya renueva la sesión.
        }
      },
    },
  });
}
