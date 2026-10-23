// Contenido educativo del panel DEMO. Es contenido general para aprender, no asesoría financiera.

export type Quiz = { q: string; options: string[]; correct: number; explain: string };
export type Lesson = {
  id: string;
  title: string;
  kind: "Lectura" | "Quiz" | "Práctica";
  minutes: number;
  body: string[];
  quiz?: Quiz;
  cta?: { label: string; href: string };
};
export type Day = { n: number; title: string; week: number; lessons: Lesson[] | null };

export const weeks = [
  { n: 1, title: "Semana 1 · Las bases" },
  { n: 2, title: "Semana 2 · Leer el mercado" },
  { n: 3, title: "Semana 3 · Riesgo y disciplina" },
  { n: 4, title: "Semana 4 · Práctica con bots" },
];

const L = (id: string, title: string, kind: Lesson["kind"], minutes: number, body: string[], extra: Partial<Lesson> = {}): Lesson => ({ id, title, kind, minutes, body, ...extra });

const full: Day[] = [
  {
    n: 1,
    week: 1,
    title: "Comenzando con el trading",
    lessons: [
      L("d1l1", "Qué es operar (y qué no)", "Lectura", 4, [
        "Operar es comprar y vender activos esperando que su precio cambie a tu favor. Nadie puede asegurar que eso ocurra: unas veces se gana y otras se pierde, y por eso aprender a manejar el riesgo importa más que adivinar.",
        "Aquí vas a practicar con saldo virtual. No es dinero real, no se puede retirar y está pensado para que cometas errores sin que cuesten nada. Lo valioso es lo que aprendes de cada operación.",
      ]),
      L("d1l2", "Qué puedes operar", "Lectura", 4, [
        "Los mercados se agrupan en categorías: acciones (partes de una empresa), criptomonedas, divisas (un par como euro/dólar) y materias primas como el oro.",
        "Cada categoría se mueve distinto. Las divisas suelen variar poco por vela; las criptomonedas, mucho más. En el simulador verás ejemplos de todas con precios ficticios.",
      ]),
      L("d1l3", "Comprueba lo aprendido", "Quiz", 2, ["Una pregunta rápida para fijar la idea."], {
        quiz: {
          q: "¿Qué es lo más importante al empezar a operar?",
          options: ["Adivinar siempre hacia dónde va el precio", "Aprender a manejar el riesgo", "Operar lo más rápido posible", "Copiar lo que hace otra persona"],
          correct: 1,
          explain: "Nadie acierta siempre. Quien dura en el mercado es quien controla cuánto puede perder en cada operación.",
        },
      }),
    ],
  },
  {
    n: 2,
    week: 1,
    title: "Cómo leer un gráfico",
    lessons: [
      L("d2l1", "La vela japonesa", "Lectura", 5, [
        "Cada vela resume un periodo de tiempo con cuatro precios: apertura, máximo, mínimo y cierre. El cuerpo va de la apertura al cierre y las mechas muestran hasta dónde llegó el precio.",
        "Si el cierre es mayor que la apertura, la vela es verde (sube); si es menor, es roja (baja). Una vela con mechas largas indica que el precio fue empujado y rechazado.",
      ]),
      L("d2l2", "Volumen y tiempo", "Lectura", 4, [
        "Debajo de las velas verás barras de volumen: cuántas unidades se negociaron. Un movimiento con mucho volumen suele tener más respaldo que uno con poco.",
        "El eje horizontal es el tiempo. Una vela de 5 minutos y una de 1 día cuentan historias distintas; en el simulador cada vela representa 5 minutos de mercado ficticio.",
      ]),
      L("d2l3", "Comprueba lo aprendido", "Quiz", 2, ["Una pregunta rápida."], {
        quiz: {
          q: "Una vela verde significa que…",
          options: ["El precio cerró por encima de donde abrió", "El precio cerró por debajo de donde abrió", "No hubo operaciones", "El precio no se movió"],
          correct: 0,
          explain: "Verde = cierre mayor que apertura. Roja = cierre menor que apertura.",
        },
      }),
    ],
  },
  {
    n: 3,
    week: 1,
    title: "Tendencias y medias móviles",
    lessons: [
      L("d3l1", "Alcista, bajista o lateral", "Lectura", 4, [
        "Una tendencia alcista forma máximos y mínimos cada vez más altos. Una bajista, cada vez más bajos. Si el precio rebota entre dos niveles sin avanzar, el mercado está lateral.",
        "Identificar en qué situación estás evita operar a contramano. Es una lectura, no una garantía: las tendencias también se terminan.",
      ]),
      L("d3l2", "La media móvil", "Lectura", 5, [
        "La media móvil promedia los últimos cierres y suaviza el ruido. En el gráfico del simulador la línea naranja es la media de 20 velas.",
        "Cuando una media corta (20) se coloca sobre una larga (50), suele leerse como tendencia alcista; al revés, bajista. Los bots de Aurex usan esta idea y te la explican con números.",
      ]),
      L("d3l3", "Comprueba lo aprendido", "Quiz", 2, ["Una pregunta rápida."], {
        quiz: {
          q: "Si la media de 20 velas está bajo la de 50, normalmente se interpreta como…",
          options: ["Tendencia alcista", "Tendencia bajista", "Que hay que comprar sí o sí", "Que el mercado está cerrado"],
          correct: 1,
          explain: "Media corta bajo la larga suele indicar presión bajista. Sigue siendo una lectura, no una promesa.",
        },
      }),
    ],
  },
  {
    n: 4,
    week: 1,
    title: "El riesgo primero",
    lessons: [
      L("d4l1", "Stop y objetivo", "Lectura", 5, [
        "Antes de entrar, define dos precios: el stop (dónde aceptas equivocarte y sales) y el objetivo (dónde tomas ganancia). Así sabes cuánto puedes perder y cuánto podrías ganar antes de arriesgar nada.",
        "En las propuestas de los bots verás siempre Entrada, Stop y Objetivo. El objetivo está al doble de distancia que el stop: ganas el doble de lo que arriesgas si acierta, pero es normal que varias salgan mal: así es el mercado.",
      ]),
      L("d4l2", "Cuánto arriesgar", "Lectura", 4, [
        "Una regla común de práctica es arriesgar 1% del saldo por operación. Con 10,000 virtuales, son 100 por intento. Aunque pierdas varias seguidas, sigues en el juego.",
        "El tamaño de la posición sale de dividir lo que quieres arriesgar entre la distancia al stop. Los bots lo calculan por ti al aprobar una idea.",
      ]),
      L("d4l3", "Comprueba lo aprendido", "Quiz", 2, ["Una pregunta rápida."], {
        quiz: {
          q: "¿Para qué sirve el stop?",
          options: ["Para ganar más", "Para limitar cuánto puedes perder", "Para que el precio suba", "Para ver el volumen"],
          correct: 1,
          explain: "El stop te saca de la operación si el precio llega a ese nivel, acotando la pérdida.",
        },
      }),
    ],
  },
  {
    n: 5,
    week: 1,
    title: "Tu primera práctica",
    lessons: [
      L("d5l1", "Opera en el simulador", "Práctica", 6, [
        "Entra al simulador, elige un activo y mira el gráfico en vivo. Compra una cantidad pequeña de saldo virtual y observa cómo cambia tu ganancia o pérdida mientras el precio se mueve.",
        "Cierra la posición cuando quieras. Fíjate en que no hace falta acertar para aprender: lo importante es entender qué pasó.",
      ], { cta: { label: "Ir al simulador", href: "/panel/simulador" } }),
      L("d5l2", "Aprueba la idea de un bot", "Práctica", 6, [
        "Activa un bot en la sección Bots. Cuando proponga una operación, lee la explicación y decide si aprobarla o rechazarla. Nada se ejecuta sin tu aprobación.",
        "Compara: ¿entenderías la entrada sin la explicación? Esa es la habilidad que estás entrenando.",
      ], { cta: { label: "Ver los bots", href: "/panel/bots" } }),
      L("d5l3", "Comprueba lo aprendido", "Quiz", 2, ["Una pregunta rápida."], {
        quiz: {
          q: "En Aurex, ¿quién decide si una operación de práctica se ejecuta?",
          options: ["El bot, sin preguntar", "Tú, aprobando o rechazando", "Nadie, es automático", "Un tercero"],
          correct: 1,
          explain: "Los bots solo proponen y explican. Tú apruebas o rechazas cada idea.",
        },
      }),
    ],
  },
  {
    n: 6,
    week: 1,
    title: "Las emociones",
    lessons: [
      L("d6l1", "Miedo y codicia", "Lectura", 4, [
        "Después de una racha ganadora aparece la tentación de arriesgar de más; tras una pérdida, la de «recuperarlo ya». Las dos llevan a decisiones peores.",
        "Un plan escrito de antemano (entrada, stop, objetivo y tamaño) te protege de decidir en caliente.",
      ]),
      L("d6l2", "Lleva un diario", "Lectura", 4, [
        "Anota por qué entraste, qué esperabas y qué pasó. Con el tiempo verás patrones propios: errores que repites y decisiones que sí funcionan.",
        "En Aurex, el historial de órdenes guarda cada operación simulada con su explicación; úsalo como base de tu diario.",
      ]),
      L("d6l3", "Comprueba lo aprendido", "Quiz", 2, ["Una pregunta rápida."], {
        quiz: {
          q: "Después de una pérdida, lo más sano es…",
          options: ["Duplicar el tamaño para recuperar", "Seguir tu plan y revisar qué pasó", "Dejar de usar stop", "Operar sin pensar"],
          correct: 1,
          explain: "Perseguir pérdidas aumenta el riesgo. Revisar con calma y seguir el plan es la salida.",
        },
      }),
    ],
  },
  {
    n: 7,
    week: 1,
    title: "Repaso de la semana",
    lessons: [
      L("d7l1", "Lo esencial", "Lectura", 4, [
        "Repasa: una vela resume cuatro precios, las medias ayudan a ver la tendencia, el stop limita la pérdida y arriesgar poco por operación te mantiene en el juego.",
        "Nada de esto garantiza resultados. Lo que sí hace es que tus decisiones tengan un porqué.",
      ]),
      L("d7l2", "Mini examen", "Quiz", 3, ["Última pregunta de la semana."], {
        quiz: {
          q: "¿Qué combina una buena operación de práctica?",
          options: ["Entrada, stop, objetivo y tamaño definidos", "Solo una corazonada", "Nada de stop", "Operar con todo el saldo"],
          correct: 0,
          explain: "Un plan completo antes de entrar es lo que separa practicar de apostar.",
        },
      }),
      L("d7l3", "Practica una idea completa", "Práctica", 6, ["Elige un bot, lee su propuesta, apruébala o recházala y observa cómo termina. Anota qué aprendiste."], {
        cta: { label: "Ir a los bots", href: "/panel/bots" },
      }),
    ],
  },
];

const upcoming: [number, string][] = [
  [8, "Soportes y resistencias"], [9, "Patrones de velas"], [10, "El RSI"], [11, "Volatilidad"], [12, "Rupturas"], [13, "Retrocesos"], [14, "Repaso de la semana 2"],
  [15, "Tamaño de la posición"], [16, "Relación beneficio/riesgo"], [17, "Diversificar"], [18, "Rachas y drawdown"], [19, "Plan de trading"], [20, "Disciplina"], [21, "Repaso de la semana 3"],
  [22, "Conoce a tus bots"], [23, "Bot Guardián"], [24, "Bot Equilibrio"], [25, "Bot Camaleón"], [26, "Bot Impulso"], [27, "Tu estrategia"], [28, "Evaluación final"],
];

export const days: Day[] = [
  ...full,
  ...upcoming.map(([n, title]) => ({ n, title, week: Math.ceil(n / 7), lessons: null })),
];

export const totalLessons = full.reduce((s, d) => s + (d.lessons?.length ?? 0), 0);

// ---------- Mentor ----------
export type Qa = { keys: string[]; q: string; a: string };

export const mentorName = "Roberto";

export const mentorQa: Qa[] = [
  {
    keys: ["ciclo", "ciclos", "fase"],
    q: "Explica cómo funcionan los ciclos del mercado",
    a: "Los mercados suelen moverse en fases que se repiten, aunque sin horario fijo:\n\n1. Expansión: las cosas mejoran y los precios tienden a subir.\n2. Pico: el optimismo es máximo y los precios pueden estar inflados.\n3. Contracción: baja la actividad y los precios suelen caer.\n4. Valle: el pesimismo domina y, con el tiempo, vuelve a empezar la expansión.\n\nNo se pueden predecir con exactitud: sirven para entender en qué contexto estás, no para adivinar el siguiente movimiento.",
  },
  {
    keys: ["stop", "stop loss", "perder"],
    q: "¿Qué es un stop y cómo lo uso?",
    a: "El stop es el precio en el que decides salirte si la operación sale mal. Lo defines antes de entrar. Por ejemplo, compras a 100 con stop en 98: si baja a 98, sales y tu pérdida queda acotada. Sin stop, una pérdida pequeña puede crecer sin que lo notes.",
  },
  {
    keys: ["vela", "velas", "japonesa"],
    q: "¿Cómo se lee una vela?",
    a: "Cada vela muestra apertura, máximo, mínimo y cierre de un periodo. Verde: cerró por encima de donde abrió. Roja: cerró por debajo. Las mechas muestran hasta dónde llegó el precio y volvió. Pasa el cursor sobre el gráfico del simulador y verás esos cuatro valores.",
  },
  {
    keys: ["riesgo", "cuánto", "cuanto", "arriesgar", "1%"],
    q: "¿Cuánto debería arriesgar por operación?",
    a: "Una regla muy usada en práctica es 1% del saldo por operación. Con 10,000 virtuales son 100. Así puedes equivocarte muchas veces seguidas sin quedarte sin saldo. Es una referencia educativa, no una recomendación personal.",
  },
  {
    keys: ["rsi", "sobrecompra", "sobrecomprado"],
    q: "¿Qué es el RSI?",
    a: "El RSI es un indicador de 0 a 100 que mide la fuerza de los últimos movimientos. Por encima de 70 se dice que hay sobrecompra (el precio subió mucho y podría pausar); por debajo de 30, sobreventa. No es una señal de compra o venta por sí solo.",
  },
  {
    keys: ["media", "medias", "promedio", "sma"],
    q: "¿Para qué sirven las medias móviles?",
    a: "Suavizan el ruido promediando los últimos cierres. Si una media corta (20 velas) está sobre una larga (50), la tendencia suele leerse como alcista; al revés, bajista. Los bots de Aurex usan esta lectura y te muestran los números en cada propuesta.",
  },
  {
    keys: ["diversific", "varios", "todo en uno"],
    q: "¿Por qué diversificar?",
    a: "Si pones todo en un solo activo, un mal movimiento te afecta por completo. Repartir en activos distintos reduce el impacto de uno solo. En el simulador puedes ver en la dona de tu inicio cómo está repartido tu saldo.",
  },
  {
    keys: ["bot", "bots", "guardián", "guardian", "camaleón", "camaleon", "impulso", "equilibrio"],
    q: "¿En qué se diferencian los bots?",
    a: "Guardián es prudente y busca poco ruido. Equilibrio opera a un ritmo constante. Camaleón cambia de táctica según la volatilidad. Impulso persigue movimientos fuertes con stops más amplios. Todos solo proponen y explican; tú decides si aprobar.",
  },
  {
    keys: ["simulador", "empezar", "cómo uso", "como uso", "demo"],
    q: "¿Cómo empiezo en el simulador?",
    a: "Entra a Simulador, elige un activo, mira el gráfico y compra una cantidad pequeña de saldo virtual. Observa tu ganancia o pérdida y ciérrala cuando quieras. Luego prueba activar un bot y aprobar o rechazar sus ideas.",
  },
  {
    keys: ["gan", "dinero", "rentab", "garant"],
    q: "¿Puedo ganar dinero con esto?",
    a: "Aquí practicas con saldo virtual: no se gana ni se pierde dinero real, y los resultados de la demo no predicen resultados futuros. Operar en un mercado real implica riesgo de perder capital. Aurex es educativo y no es asesoría financiera.",
  },
  {
    keys: ["perdió", "perdio", "pérdida", "perdida", "salió mal", "salio mal"],
    q: "¿Por qué una operación del bot puede salir mal?",
    a: "Porque ninguna señal es infalible. Un bot puede leer bien el contexto y aun así el precio puede ir en contra. Por eso cada propuesta trae un stop: acepta de antemano cuánto puede perder. Revisa la explicación y pregúntate qué cambió.",
  },
];

export const mentorFallback =
  "Todavía no tengo una respuesta preparada para eso. En esta demostración respondo temas como ciclos del mercado, stop, velas, riesgo, RSI, medias móviles, diversificación y cómo funcionan los bots. Prueba con uno de los atajos de abajo.";

// ---------- Novedades ----------
export type NewsItem = { id: string; tag: "Producto" | "Educación" | "Consejo"; title: string; text: string };
export const news: NewsItem[] = [
  { id: "n1", tag: "Producto", title: "Nuevo: escenarios en Herramientas", text: "Mira tres caminos hipotéticos para cualquier activo. Son ilustraciones para pensar en riesgos, no pronósticos." },
  { id: "n2", tag: "Producto", title: "Los bots ahora explican sus números", text: "Cada propuesta muestra las medias móviles, el RSI y la volatilidad que usó el bot para decidir." },
  { id: "n3", tag: "Educación", title: "Empieza el reto de 28 días", text: "La semana 1 ya está disponible en Aprender: velas, tendencias, riesgo y tu primera práctica." },
  { id: "n4", tag: "Consejo", title: "Un stop antes de entrar", text: "Define dónde saldrás antes de comprar. Es el hábito que más te protege cuando algo no sale como esperabas." },
  { id: "n5", tag: "Consejo", title: "Pocas operaciones, bien pensadas", text: "Operar mucho no es operar mejor. Prueba aprobar solo las ideas que puedas explicar con tus propias palabras." },
];
