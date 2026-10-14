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
  price: number;
  oldPrice: number;
  popular?: boolean;
};

export const currency = "S/";
export const discountPercent = 50;
export const plans: Plan[] = [
  { id: "w1", label: "PLAN DE 1 SEMANA", price: 19, oldPrice: 38 },
  { id: "w4", label: "PLAN DE 4 SEMANAS", price: 49, oldPrice: 98, popular: true },
  { id: "w12", label: "PLAN DE 12 SEMANAS", price: 99, oldPrice: 198 },
];

export const offerCountdownSeconds = 10 * 60;
