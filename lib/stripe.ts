import Stripe from "stripe";

// Solo se usa en el servidor (rutas /api). Nunca importes este archivo desde un componente "use client".
let client: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Falta STRIPE_SECRET_KEY en las variables de entorno");
  if (!client) client = new Stripe(key);
  return client;
}

export function siteUrl(req: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return new URL(req.url).origin;
}
