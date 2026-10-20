// Todo lo que cambia entre marcas vive aquí: nombre, textos, planes y legales.

export const brand = {
  name: "Aurex",
  tagline: "Aprende a operar con bots de IA",
  description:
    "Aurex es una academia con bots de IA de práctica para aprender a operar paso a paso, con saldo virtual.",
  challengeTitle: ["RETO", "TRADER IA", "DE 28 DÍAS"] as const,
  company: "AUREX LABS (nombre de ejemplo)",
  supportEmail: "soporte@tu-dominio.com",
};

export const legalLinks = [
  { label: "Términos y condiciones", href: "#" },
  { label: "Política de privacidad", href: "#" },
  { label: "Condiciones de suscripción", href: "#" },
  { label: "Política de reembolso", href: "#" },
  { label: "Centro de soporte", href: "#" },
];

export const riskDisclaimer =
  "Esto no es una garantía de resultados. El trading implica riesgos y puedes perder dinero. Contenido educativo, no es asesoría financiera.";

// Reseñas: agrega SOLO reseñas reales de clientes que te hayan autorizado.
// Mientras esté vacío, la sección de reseñas no se muestra.
export type Testimonial = { name: string; city: string; title: string; text: string; date: string };
export const testimonials: Testimonial[] = [];

export type Plan = {
  id: string;
  label: string;
  /** Precio real que se cobra, en pesos (no centavos). El servidor es quien lo usa para cobrar. */
  price: number;
  /** Precio anterior REAL. Solo se muestra tachado si showDiscount = true. */
  oldPrice?: number;
  popular?: boolean;
};

// ⚠️ Precios de EJEMPLO: cámbialos por los reales de la empresa.
export const currency = "$";
export const currencyCode = "mxn"; // código ISO que recibe Stripe
export const currencyLabel = "MXN";
export const plans: Plan[] = [
  { id: "w1", label: "PLAN DE 1 SEMANA", price: 199, oldPrice: 398 },
  { id: "w4", label: "PLAN DE 4 SEMANAS", price: 499, oldPrice: 998, popular: true },
  { id: "w12", label: "PLAN DE 12 SEMANAS", price: 999, oldPrice: 1998 },
];

// Descuento tachado y cuenta regresiva: déjalos en false salvo que la promoción sea real
// (que de verdad hayas vendido al precio anterior y que de verdad termine). Los descuentos
// y temporizadores falsos incumplen la ley de protección al consumidor y las políticas de Stripe.
export const showDiscount = false;
export const showCountdown = false;
export const discountPercent = 50;
export const offerCountdownSeconds = 10 * 60;

// Qué recibe el cliente después de pagar (se muestra en /gracias). Sé específico y veraz.
export const afterPurchase = {
  title: "¡Pago recibido!",
  body: "Te enviamos un correo con los pasos para acceder a tu plan.",
  pendingTitle: "Estamos esperando tu pago",
  pendingBody:
    "Si elegiste pagar en efectivo (OXXO) o por transferencia, tu acceso se activa cuando el pago se acredite.",
};
