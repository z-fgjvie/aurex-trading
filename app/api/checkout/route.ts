import { NextResponse } from "next/server";
import { brand, currencyCode, plans } from "@/lib/config";
import { bots } from "@/lib/steps";
import { getStripe, siteUrl } from "@/lib/stripe";

export const runtime = "nodejs";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Body = { planId?: string; botId?: string; email?: string; name?: string };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  // El precio SIEMPRE sale del servidor (lib/config.ts). Nunca confiamos en un precio enviado desde el navegador.
  const plan = plans.find((p) => p.id === body.planId);
  if (!plan) return NextResponse.json({ error: "Plan inválido" }, { status: 400 });

  const email = (body.email ?? "").trim();
  if (!emailRe.test(email)) return NextResponse.json({ error: "Correo inválido" }, { status: 400 });

  const bot = bots.find((b) => b.id === body.botId) ?? bots[0];
  const base = siteUrl(req);

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: currencyCode,
            unit_amount: Math.round(plan.price * 100), // centavos
            product_data: {
              name: `${brand.name} · ${plan.label}`,
              description: `Acceso con ${bot.name}`,
            },
          },
        },
      ],
      metadata: {
        planId: plan.id,
        botId: bot.id,
        name: (body.name ?? "").slice(0, 60),
      },
      // Los métodos de pago (tarjeta, OXXO, SPEI…) se activan desde el panel de Stripe.
      // Después de pagar, el cliente crea su cuenta (su correo ya viene de esta compra).
      success_url: `${base}/registro?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/?pago=cancelado`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Error creando la sesión de pago:", err);
    return NextResponse.json({ error: "No pudimos iniciar el pago. Intenta de nuevo." }, { status: 500 });
  }
}
