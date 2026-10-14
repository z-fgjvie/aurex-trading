// Datos del quiz. Para cambiar preguntas u opciones, edita solo este archivo.

export type Option = { emoji: string; label: string };

export type ChoiceStep = {
  id: string;
  type: "choice";
  title: string;
  subtitle?: string;
  multi?: boolean;
  options: Option[];
};

export type InfoStep = {
  id: string;
  type: "info";
  title: string;
  paragraphs: string[];
  art: "confidence" | "bots" | "stairs" | "fit";
};

export type SimpleStep = {
  id: string;
  type:
    | "welcome"
    | "age"
    | "loading"
    | "challenge"
    | "summary"
    | "botsIntro"
    | "botPick"
    | "botDetail"
    | "email"
    | "name"
    | "demo"
    | "offer";
};

export type Step = ChoiceStep | InfoStep | SimpleStep;

export const steps: Step[] = [
  { id: "welcome", type: "welcome" },
  {
    id: "motivo",
    type: "choice",
    title: "¿Por qué te interesa el trading?",
    subtitle: "Elige todas las que apliquen",
    multi: true,
    options: [
      { emoji: "⏰", label: "Horario flexible" },
      { emoji: "🔓", label: "Libertad financiera" },
      { emoji: "👑", label: "Ser mi propio jefe" },
      { emoji: "🏝️", label: "Trabajar desde cualquier lugar" },
      { emoji: "🤔", label: "Otra razón" },
    ],
  },
  {
    id: "info-miedos",
    type: "info",
    art: "confidence",
    title: "Aurex te ayuda a empezar sin miedo",
    paragraphs: [
      "Mucha gente duda porque no sabe por dónde empezar o porque el proceso parece complicado y largo. Si te pasa, no eres el único.",
      "Aurex lo hace más simple: nuestros bots de IA de práctica analizan escenarios de mercado y te muestran ideas de operación. Tú revisas, decides y aprendes con saldo virtual.",
    ],
  },
  {
    id: "barreras",
    type: "choice",
    title: "¿Qué te impidió empezar antes?",
    subtitle: "Elige todas las que apliquen",
    multi: true,
    options: [
      { emoji: "😵‍💫", label: "No tenía un sistema claro" },
      { emoji: "⏰", label: "Falta de tiempo" },
      { emoji: "👵", label: "Sentía que era muy tarde" },
      { emoji: "🤯", label: "Me parecía muy complicado" },
    ],
  },
  {
    id: "info-bots",
    type: "info",
    art: "bots",
    title: "Empieza a practicar con Aurex",
    paragraphs: [
      "Cada vez más personas se interesan por los mercados, y aprender hoy es más accesible que antes.",
      "Si tú también sientes curiosidad, estás en buena compañía. Aurex convierte los primeros pasos en un camino tranquilo y estructurado que sí puedes seguir.",
    ],
  },
  {
    id: "plan",
    type: "choice",
    title: "¿Qué describe mejor tu plan con el trading de IA ahora?",
    options: [
      { emoji: "💼", label: "Un segundo empleo" },
      { emoji: "📈", label: "Un ingreso extra" },
      { emoji: "🧩", label: "Solo un pasatiempo" },
      { emoji: "🎯", label: "Reemplazar mi trabajo actual" },
    ],
  },
  { id: "edad", type: "age" },
  {
    id: "riesgo",
    type: "choice",
    title: "¿Asumirías mayores riesgos por mayores recompensas?",
    options: [
      { emoji: "🏆", label: "Claro que sí" },
      { emoji: "🎯", label: "Depende de la oportunidad" },
      { emoji: "⚖️", label: "Prefiero un riesgo equilibrado" },
      { emoji: "🛡️", label: "No, voy a lo seguro" },
    ],
  },
  {
    id: "decisiones",
    type: "choice",
    title: "¿Se te dificulta tomar decisiones rápidas?",
    options: [
      { emoji: "🤔", label: "Sí, todo el tiempo" },
      { emoji: "⚖️", label: "A veces" },
      { emoji: "⚡", label: "Para nada" },
    ],
  },
  {
    id: "info-encaje",
    type: "info",
    art: "fit",
    title: "El trading le queda a más personas de las que crees",
    paragraphs: [
      "Muchos creen que es solo para personalidades rápidas y de alto riesgo. En realidad, también le queda a quienes aprenden con paciencia y prefieren un progreso constante.",
      "La clave es una estrategia alineada con tu comodidad y tu mentalidad. Aurex personaliza el camino para que el ritmo se sienta natural.",
    ],
  },
  {
    id: "celebrar",
    type: "choice",
    title: "¿Cómo celebrarías tus primeros resultados?",
    subtitle: "Ponerte metas y recompensarte ayuda a mantener la motivación",
    options: [
      { emoji: "💳", label: "Pagar algunas cuentas" },
      { emoji: "🛡️", label: "Sumar a mi fondo de emergencia" },
      { emoji: "🔁", label: "Reinvertir" },
      { emoji: "🏦", label: "Sumar a mi fondo de retiro" },
      { emoji: "🏝️", label: "Unas mini vacaciones" },
    ],
  },
  {
    id: "info-metas",
    type: "info",
    art: "stairs",
    title: "Ya estás avanzando",
    paragraphs: [
      "Las metas claras y las pequeñas recompensas ayudan a sostener la motivación y la constancia.",
      "Aurex mantiene tus metas a la vista y te envía recordatorios amables mientras aprendes.",
    ],
  },
  { id: "resumen", type: "summary" },
  { id: "bots-intro", type: "botsIntro" },
  {
    id: "ganando",
    type: "choice",
    title: "Cuando una operación va ganando, el bot debe:",
    options: [
      { emoji: "🪙", label: "Cerrar en la primera ganancia" },
      { emoji: "💵", label: "Cerrar pronto con una ganancia pequeña" },
      { emoji: "💰", label: "Esperar una ganancia mediana" },
      { emoji: "🏆", label: "Esperar una ganancia grande" },
    ],
  },
  {
    id: "perdiendo",
    type: "choice",
    title: "Cuando una operación va perdiendo, el bot debería:",
    options: [
      { emoji: "✂️", label: "Salir de inmediato" },
      { emoji: "🚪", label: "Salir pronto" },
      { emoji: "🫱", label: "Darle un poco de margen" },
      { emoji: "🕰️", label: "Darle bastante margen" },
    ],
  },
  {
    id: "actividad",
    type: "choice",
    title: "¿Qué tan activo quieres que sea el bot?",
    options: [
      { emoji: "🛡️", label: "5 operaciones / día" },
      { emoji: "⚖️", label: "10 operaciones / día" },
      { emoji: "🎯", label: "15 operaciones / día" },
      { emoji: "🚀", label: "20 operaciones / día" },
    ],
  },
  { id: "cargando", type: "loading" },
  { id: "reto", type: "challenge" },
  { id: "elige-bot", type: "botPick" },
  { id: "detalle-bot", type: "botDetail" },
  { id: "email", type: "email" },
  { id: "nombre", type: "name" },
  { id: "demo", type: "demo" },
  { id: "oferta", type: "offer" },
];

export type Bot = {
  id: string;
  name: string;
  color: string;
  activity: { label: string; level: number };
  risk: { label: string; level: number };
  volatility: { label: string; level: number };
  description: string;
  tracking: string;
  preset: string[];
};

export const bots: Bot[] = [
  {
    id: "camaleon",
    name: "Bot Camaleón",
    color: "#c084fc",
    activity: { label: "Alta", level: 0.75 },
    risk: { label: "Moderado", level: 0.5 },
    volatility: { label: "Alta", level: 0.75 },
    description:
      "Los mercados cambian y este bot está pensado para ajustarse a ellos. Usa un enfoque adaptativo que puede volverse más selectivo o más activo según las condiciones. Para quienes quieren flexibilidad en lugar de un único estilo fijo.",
    tracking:
      "Sigue el precio actual y reciente, las tendencias de corto y largo plazo con medias móviles y la volatilidad. Cuando los indicadores coinciden con sus criterios, muestra una idea de operación con su stop y su objetivo para que tú decidas.",
    preset: [
      "Cambia de táctica según las condiciones",
      "Se mantiene activo sin sobredimensionar",
      "El comportamiento varía semana a semana",
    ],
  },
  {
    id: "guardian",
    name: "Bot Guardián",
    color: "#86efac",
    activity: { label: "Baja", level: 0.2 },
    risk: { label: "Conservador", level: 0.2 },
    volatility: { label: "Baja", level: 0.2 },
    description:
      "Prioriza cuidar el capital. Opera poco y solo cuando las condiciones son claras. Ideal para empezar con calma.",
    tracking:
      "Vigila activos de baja volatilidad y espera confirmaciones fuertes antes de mostrar una idea de operación.",
    preset: ["Pocas operaciones", "Stops ajustados", "Objetivos pequeños y frecuentes"],
  },
  {
    id: "equilibrio",
    name: "Bot Equilibrio",
    color: "#67e8f9",
    activity: { label: "Moderada", level: 0.5 },
    risk: { label: "Equilibrado", level: 0.5 },
    volatility: { label: "Moderada", level: 0.5 },
    description:
      "Un punto medio entre actividad y prudencia. Busca un ritmo constante sin exponerse de más.",
    tracking:
      "Combina tendencia y momentum en horizontes medios, y muestra ideas con relación riesgo/beneficio balanceada.",
    preset: ["Ritmo constante", "Riesgo repartido", "Objetivos medianos"],
  },
  {
    id: "impulso",
    name: "Bot Impulso",
    color: "#fb7185",
    activity: { label: "Alta", level: 0.75 },
    risk: { label: "Agresivo", level: 0.75 },
    volatility: { label: "Alta", level: 0.78 },
    description:
      "Va tras movimientos fuertes del mercado. Más actividad y más exposición: puede ganar más, pero también perder más.",
    tracking:
      "Detecta aceleraciones de precio y volumen y muestra ideas rápidas con objetivos más amplios.",
    preset: ["Muchas oportunidades", "Más exposición a la volatilidad", "Objetivos amplios"],
  },
];

export const botPickCopy = {
  intro: "¡Ahora elige tu bot de práctica con IA!",
  introBody:
    "Los bots están disponibles para ti. Responde 3 preguntas y filtraremos la lista según lo que prefieras: la decisión sigue siendo tuya.",
};
