import { NextResponse } from "next/server";
import { accessUntil, adminConfigured, validatePassword } from "@/lib/auth";
import { getPurchase } from "@/lib/purchase";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Crea la cuenta de quien ya pagó. El correo y el plan salen de Stripe, nunca del navegador:
// por eso nadie puede registrarse sin haber pagado ni con un correo que no sea el de su compra.
export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json({ error: "El registro aún no está disponible. Intenta más tarde." }, { status: 503 });
  }

  let body: { sessionId?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const password = body.password ?? "";
  const pwError = validatePassword(password);
  if (pwError) return NextResponse.json({ error: pwError }, { status: 400 });

  const purchase = await getPurchase(body.sessionId);
  if (purchase.state === "invalid") {
    return NextResponse.json({ error: "No encontramos tu pago. Revisa el enlace o escríbenos." }, { status: 400 });
  }
  if (purchase.state === "pending") {
    return NextResponse.json(
      { error: "Tu pago todavía no se acredita. Cuando se confirme, vuelve a este enlace." },
      { status: 402 }
    );
  }

  const d = purchase.details;
  const now = new Date().toISOString();
  const { error } = await supabaseAdmin().auth.admin.createUser({
    email: d.email,
    password,
    email_confirm: true, // el pago ya confirma al cliente; no se envían correos de verificación
    user_metadata: { name: d.name },
    // app_metadata solo lo puede cambiar el servidor: el usuario no puede darse más días de acceso.
    app_metadata: {
      plan: d.planId,
      bot: d.botId,
      stripe_session_id: d.sessionId,
      activated_at: now,
      access_until: accessUntil(now, d.planId),
    },
  });

  if (error) {
    const exists = error.code === "email_exists" || /already|registered/i.test(error.message);
    if (exists) {
      return NextResponse.json({ error: "Este correo ya tiene una cuenta. Inicia sesión." }, { status: 409 });
    }
    console.error("Error creando la cuenta:", error.message);
    return NextResponse.json({ error: "No pudimos crear tu cuenta. Intenta de nuevo." }, { status: 500 });
  }

  // Abre la sesión de una vez para que entre directo al panel.
  const { error: signInError } = await supabaseServer().auth.signInWithPassword({ email: d.email, password });
  return NextResponse.json({ ok: true, signedIn: !signInError });
}
