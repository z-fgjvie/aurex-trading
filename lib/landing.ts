import { brand, currency, currencyLabel, plans } from "@/lib/config";

// ---------------------------------------------------------------------------
// Todo el texto de la landing vive aquí. Para cambiar un mensaje, edita este archivo.
// Reglas que seguimos: nada de cifras, premios ni reseñas inventadas; todo lo que se
// muestre del mercado está marcado como simulación.
// ---------------------------------------------------------------------------

export const virtualBalance = 10000;
export const riskPercent = 1;

export const nav = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#demo", label: "Demo" },
  { href: "#bots", label: "Bots" },
  { href: "#planes", label: "Planes" },
  { href: "#faq", label: "Preguntas" },
];

export const hero = {
  title: "Aprende a operar con un bot de IA que te explica cada jugada",
  sub: `Practica con un saldo virtual de $${virtualBalance.toLocaleString("en-US")}. El bot busca oportunidades, te dice por qué las propone y tú decides si las apruebas. Todo es práctica: no arriesgas tu dinero.`,
  primary: "Hacer el quiz gratis",
  secondary: "Ver cómo funciona",
  facts: [
    "Quiz de 1 minuto, sin pagar nada",
    "Nada se ejecuta sin tu aprobación",
    "Pago único, no se renueva solo",
  ],
};

export const benefits = [
  {
    title: "Aprendes haciendo",
    body: "Practicas con velas, stops y objetivos en un simulador, no mirando videos. Cada error te cuesta saldo virtual, no tu dinero.",
  },
  {
    title: "Entiendes cada idea",
    body: "El bot no solo dice «compra». Te explica en palabras simples por qué ve una oportunidad y dónde saldría si se equivoca.",
  },
  {
    title: "Tú tienes el control",
    body: "Cada idea llega con su entrada, su stop y su objetivo. Tú la apruebas o la rechazas con un toque.",
  },
];

export const steps = [
  {
    title: "Cuéntanos cómo eres",
    body: "Responde un quiz de 1 minuto sobre tu experiencia, tu tiempo y cuánto riesgo te acomoda. Con eso te recomendamos el bot que mejor va contigo.",
  },
  {
    title: "Elige tu bot",
    body: "Hay cuatro estilos, del más prudente al más activo. Puedes cambiar de bot en cualquier momento, sin empezar de cero.",
  },
  {
    title: "El bot propone, tú decides",
    body: "Cuando encuentra una oportunidad, te la muestra con su entrada, su stop y su objetivo, y te explica por qué. Tú apruebas o rechazas.",
  },
  {
    title: "Mira qué pasó y aprende",
    body: "Cada operación simulada se cierra con su resultado y una explicación de qué funcionó y qué no. Las ganancias y las pérdidas son parte de aprender.",
  },
];

export const demo = {
  title: "Pruébalo tú mismo",
  sub: "Esta es una demostración con datos ficticios. El bot te propone una operación y tú decides. Te mostramos escenarios donde gana y donde pierde, porque así es el mercado.",
  note: "Los precios, las velas y los resultados de esta demo son inventados para enseñar cómo funciona. No son resultados reales ni una promesa de ganancias.",
};

export const botTaglines: Record<string, string> = {
  guardian: "Para empezar con calma",
  camaleon: "Se adapta al mercado",
  equilibrio: "Ritmo constante",
  impulso: "Va tras los movimientos fuertes",
};

export const honest = {
  title: "Practica sin jugarte tu dinero",
  sub: "Los errores caros se cometen con dinero real. Aquí los cometes con saldo virtual, y aprendes de ellos antes de que cuesten.",
  is: [
    "Una plataforma de aprendizaje con simulador y saldo virtual",
    "Bots de IA que proponen operaciones de práctica y las explican",
    "Un lugar para equivocarte sin consecuencias en tu bolsillo",
  ],
  isNot: [
    "No es asesoría financiera ni de inversión",
    "No opera con tu dinero ni te pide depositar para operar",
    "No promete ni garantiza ganancias",
  ],
};

export const planIncludes = [
  "Acceso al simulador con saldo virtual",
  "Los cuatro bots de práctica",
  "Explicación de cada operación simulada",
];

export const planCopy = {
  title: "Elige cuánto tiempo quieres practicar",
  sub: `Pagas una sola vez en la página segura de Stripe, en ${currencyLabel}. El plan no se renueva solo.`,
  cta: "Empezar con este plan",
  note: "Primero haces el quiz de 1 minuto. No se cobra nada hasta que tú confirmes tu plan.",
};

export function planTitle(label: string): string {
  const s = label.toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const planList = plans;
export { currency, currencyLabel };

export const faq = [
  {
    q: "¿Qué es Aurex?",
    a: `${brand.name} es una plataforma para aprender trading practicando. Usas un simulador con saldo virtual y unos bots de IA que proponen operaciones de práctica y te explican por qué. Tú decides cuáles aprobar.`,
  },
  {
    q: "¿Necesito experiencia para empezar?",
    a: "No. El quiz te hace unas preguntas sencillas y te recomienda un bot según tu estilo. Si nunca has operado, puedes empezar con el bot más prudente y subir de ritmo cuando te sientas listo.",
  },
  {
    q: "¿Opero con dinero real?",
    a: "No. Todo lo que haces dentro es simulación con saldo virtual. Lo que pagas es el acceso al plan que elijas. No depositas dinero para operar y no hay nada que retirar.",
  },
  {
    q: "¿Los resultados de la demo son reales?",
    a: "No. Los gráficos y operaciones de esta página son ficticios y los escribimos para mostrar cómo funciona la plataforma. Incluyen ganancias y pérdidas, y no predicen lo que pasaría en un mercado real.",
  },
  {
    q: "¿Cómo se paga y se renueva?",
    a: "Pagas una sola vez en la página segura de Stripe. No guardamos los datos de tu tarjeta y el plan no se renueva automáticamente.",
  },
  {
    q: "¿Aurex me da asesoría financiera?",
    a: "No. Aurex es educación y práctica. Nada de lo que muestra es una recomendación de inversión. Operar en mercados reales implica riesgos, incluida la pérdida de tu dinero.",
  },
  {
    q: "¿Puedo pedir un reembolso o hablar con alguien?",
    a: `Sí, escríbenos a ${brand.supportEmail} y revisamos tu caso. La política de reembolso completa está en el pie de página.`,
  },
];

export const finalCta = {
  title: "Tu primera operación simulada está a un quiz de distancia",
  sub: "Toma 1 minuto. No se cobra nada hasta que tú elijas un plan.",
  cta: "Hacer el quiz gratis",
};

// Cinta de precios del encabezado: símbolos inventados, valores fijos. No son cotizaciones reales.
export const tape = [
  { s: "NVX", p: 48.2, c: 0.84 },
  { s: "ORBT", p: 63.4, c: -0.41 },
  { s: "HLIO", p: 27.9, c: 1.32 },
  { s: "KRNA", p: 112.65, c: 0.27 },
  { s: "VLTA", p: 9.84, c: -1.18 },
  { s: "MRDN", p: 204.1, c: 0.56 },
  { s: "QSAR", p: 35.77, c: -0.22 },
  { s: "TRNO", p: 76.3, c: 2.05 },
  { s: "ZEPH", p: 18.46, c: -0.63 },
  { s: "AVNT", p: 141.9, c: 0.11 },
];
