import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Corre antes de /panel y /login: renueva la sesión y protege el panel.
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const path = request.nextUrl.pathname;

  // Sin Supabase configurado nadie puede estar logueado: el panel queda cerrado y el login se muestra normal.
  if (!url || !anon) {
    return path.startsWith("/panel") ? NextResponse.redirect(new URL("/login", request.url)) : NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(list) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (path.startsWith("/panel") && !user) return NextResponse.redirect(new URL("/login", request.url));
  if (path === "/login" && user) return NextResponse.redirect(new URL("/panel", request.url));
  return response;
}

export const config = { matcher: ["/panel/:path*", "/login"] };
