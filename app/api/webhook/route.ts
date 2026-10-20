import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

// Stripe avisa aquí cuando un pago se confirma (también los pagos en OXXO/SPEI, que llegan horas o días después).
// Esta es la ÚNICA fuente confiable para saber que alguien pagó: no uses la página /gracias para dar acceso.
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ error: "Webhook no configurado" }, { status: 400 });
  }

  const raw = await req.text(); // se necesita el cuerpo crudo para verificar la firma
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, signature, secret);
  } catch {
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === "paid") {
        // TODO: aquí entregas lo que vendiste. Por ejemplo:
        //  - guardar la compra en tu base de datos (session.id, session.customer_email, session.metadata)
        //  - enviar el correo con el acceso (Resend, SendGrid, etc.)
        console.log("Pago confirmado:", session.id, session.customer_email, session.metadata);
      }
      break;
    }
    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Pago diferido fallido:", session.id);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
