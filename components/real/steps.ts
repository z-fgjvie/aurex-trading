import { broker } from "@/lib/broker";

const B = broker.name;

export type Info = { kind: "info"; art: string; tag?: string; title: string; body: string[] };
export type QuizStep = { kind: "quiz"; art: string; title: string; question: string; options: string[]; correct: number; ok: string; no: string };
export type ListStep = { kind: "list"; art: string; title: string; body: string[]; items: { t: string; d: string }[] };
export type FinalStep = { kind: "final"; art: string; title: string; body: string[] };
export type Step = Info | QuizStep | ListStep | FinalStep;

export const steps: Step[] = [
  {
    kind: "info",
    art: "laptop",
    tag: "CONFIGURACIÓN DEL BRÓKER",
    title: "Cómo abrir una cuenta de bróker",
    body: [
      "Para operar con dinero real necesitas una cuenta en un bróker: una empresa regulada que guarda tu dinero y ejecuta tus órdenes.",
      "En unos minutos verás el proceso completo, paso a paso, para que llegues al sitio del bróker sabiendo qué te van a pedir.",
    ],
  },
  {
    kind: "info",
    art: "id",
    title: "Una cuenta de corretaje maneja dinero real",
    body: [
      "A diferencia de la mayoría de las apps que usas a diario, una cuenta de corretaje gestiona dinero e inversiones reales, y el bróker está regulado como cualquier institución financiera.",
      "Por eso es importante abrirla con calma y dar información exacta.",
    ],
  },
  {
    kind: "quiz",
    art: "spark",
    title: "Hagamos una comprobación rápida",
    question: "¿Qué estás a punto de abrir?",
    options: ["Una cuenta regulada para comprar y vender inversiones", "Una cuenta de juego para practicar en un mercado virtual", "Una billetera donde guardas directamente todos tus activos", "Una cuenta bancaria que garantiza tus ganancias"],
    correct: 0,
    ok: "¡Correcto! Es una cuenta regulada donde tu dinero está expuesto al riesgo del mercado.",
    no: "No exactamente. Una cuenta de corretaje es una cuenta regulada para comprar y vender inversiones, y no garantiza ganancias.",
  },
  {
    kind: "info",
    art: "list",
    title: "Tu vía legal de acceso al mercado",
    body: [
      "Una cuenta de corretaje es la forma legal de acceder a los mercados reales. Revisa en el sitio del bróker las condiciones, las comisiones y los requisitos de tu país antes de empezar.",
      `Aurex no es ${B} ni forma parte de ${B}: es una academia. Tu cuenta, tu dinero y tus datos viven con el bróker.`,
    ],
  },
  {
    kind: "info",
    art: "laptop",
    title: "Conoce al bróker",
    body: [
      `${B} es un bróker independiente y regulado, una empresa separada de Aurex. Ofrece acceso a mercados financieros como acciones y fondos cotizados (ETF).`,
      "Su sitio web está en inglés. Si algo no se entiende, puedes usar la función de traducción de tu navegador.",
    ],
  },
  {
    kind: "info",
    art: "warn",
    title: "Antes de registrarte, revisa tus datos",
    body: [
      "Asegúrate de que tu correo electrónico sea correcto: lo necesitarás para verificar y acceder a tu cuenta más adelante.",
      "Los datos erróneos o que no coincidan con tus documentos pueden retrasar tu solicitud o hacer que sea rechazada.",
    ],
  },
  {
    kind: "list",
    art: "mail",
    title: "El formulario de registro",
    body: ["Verás un formulario con estos campos. Esto es lo que debes escribir:"],
    items: [
      { t: "Nombre y apellido", d: "Tal como aparecen en tu identificación oficial." },
      { t: "País de residencia fiscal", d: "El país donde pagas tus impuestos." },
      { t: "Correo electrónico", d: "El que quieres usar para esta cuenta. Que sea uno al que tengas acceso." },
      { t: "Contraseña", d: "Crea una segura y única. No la compartas con nadie." },
    ],
  },
  {
    kind: "info",
    art: "mail",
    title: "Verifica tu correo",
    body: ["Al registrarte, el bróker enviará un correo de verificación a la dirección que diste. Ábrelo y sigue las instrucciones para confirmar tu correo y activar la cuenta.", "Si no lo ves, revisa la carpeta de spam."],
  },
  {
    kind: "info",
    art: "shield",
    title: "Protege tu cuenta con verificación en dos pasos",
    body: [
      "La mayoría de los brókeres exigen verificación en dos pasos (2FA): una segunda forma de confirmar que eres tú, por ejemplo con un código de una app autenticadora.",
      "Es obligatoria en muchos casos y te protege aunque alguien descubra tu contraseña.",
    ],
  },
  {
    kind: "info",
    art: "phone",
    title: "Instala una app autenticadora",
    body: [
      "Descarga una app autenticadora (por ejemplo Google Authenticator) en tu teléfono. Luego, en el sitio del bróker, pulsa «Activar».",
      "Si estás configurando desde el mismo teléfono, elige la opción de ingresar el código manualmente en lugar de escanear el QR.",
    ],
  },
  {
    kind: "info",
    art: "key",
    title: "Agrega la cuenta con la clave de configuración",
    body: [
      "El bróker te mostrará una clave de configuración. Cópiala, abre tu app autenticadora, pulsa «+» y elige «Ingresar clave de configuración».",
      "Ponle un nombre que reconozcas, deja el tipo en «Basada en tiempo», pega la clave y pulsa «Agregar».",
    ],
  },
  {
    kind: "info",
    art: "qr",
    title: "Confirma con el código de 6 dígitos",
    body: ["Tu app generará de inmediato un código de 6 dígitos que cambia cada pocos segundos. Escríbelo en el sitio del bróker para terminar la configuración."],
  },
  {
    kind: "info",
    art: "safe",
    title: "Guarda tus códigos de recuperación",
    body: [
      "El bróker te dará códigos de recuperación: respaldos que te permiten entrar si pierdes acceso a tu app autenticadora.",
      "Guárdalos en un lugar seguro y no los compartas con nadie. Ni Aurex ni el bróker te los pedirán por mensaje.",
    ],
  },
  {
    kind: "info",
    art: "wallet",
    title: "Tu cuenta de práctica",
    body: [
      "Muchos brókeres te llevan primero a un modo de práctica (paper trading) con dinero simulado. Es otra forma de familiarizarte con el proceso antes de usar fondos reales.",
      "Y recuerda que Aurex también tiene su propio simulador con saldo virtual, sin necesidad de abrir ninguna cuenta.",
    ],
  },
  {
    kind: "info",
    art: "arrow",
    title: "Cuando quieras operar con dinero real",
    body: [
      "Desde el inicio de tu cuenta en el bróker, busca la opción para abrir una cuenta de trading real. Ahí empieza una solicitud con varias secciones.",
      "Una vez aprobada, tendrás que depositar fondos antes de poder operar. Ninguna ganancia está garantizada y puedes perder parte o todo el dinero que deposites.",
    ],
  },
  {
    kind: "info",
    art: "id",
    title: "Elige cuenta individual",
    body: ["Para empezar, selecciona «Cuenta individual»: significa que la cuenta se abre a tu nombre como persona física.", "Te pedirán una identificación oficial vigente, tus datos personales y un comprobante de domicilio. Puede que pidan documentos adicionales después."],
  },
  {
    kind: "list",
    art: "list",
    title: "Las 7 secciones de la solicitud",
    body: ["La solicitud tiene varios pasos. Lee cada pregunta con atención y responde con sinceridad:"],
    items: [
      { t: "Tipo de cuenta", d: "Individual o empresa." },
      { t: "Información básica", d: "Tus datos personales." },
      { t: "Empleo", d: "Tu situación laboral." },
      { t: "Perfil financiero", d: "Ingresos, patrimonio y experiencia inversora." },
      { t: "Declaraciones", d: "Preguntas regulatorias obligatorias." },
      { t: "Revisión", d: "Comprueba que todo esté correcto antes de enviar." },
      { t: "Verificación de identidad (KYC)", d: "Confirman quién eres con tus documentos." },
    ],
  },
  {
    kind: "info",
    art: "search",
    title: "Verificación de identidad (KYC)",
    body: [
      "El último paso es KYC («conoce a tu cliente»): una verificación con documentos oficiales que los brókeres usan para confirmar quién abre la cuenta. También pueden pedirte activar la autenticación multifactor.",
      "Sigue las instrucciones del sitio del bróker hasta enviar tu solicitud.",
    ],
  },
  {
    kind: "info",
    art: "search",
    title: "Responde con sinceridad",
    body: [
      "La mayoría de las preguntas son sencillas. Léelas con atención y revisa todo antes de enviar. Estos pasos ayudan al bróker a cumplir las regulaciones financieras y mantener las cuentas seguras.",
      "Como cualquier bróker regulado, puede rechazar solicitudes con información inexacta, incompleta o inconsistente.",
    ],
  },
  {
    kind: "info",
    art: "calendar",
    title: "Espera la aprobación",
    body: [
      "Después de enviar tu solicitud, el bróker revisará tu información y verificará tu identidad. Suele tardar entre 1 y 3 días hábiles, aunque puede ser más rápido o más lento según cada caso.",
      "Cuando la aprueben, tendrás acceso a tu cuenta real.",
    ],
  },
  {
    kind: "info",
    art: "wallet",
    title: "Depositar fondos es decisión tuya",
    body: [
      "Aunque tu cuenta esté aprobada, para operar con dinero real tendrás que depositar fondos en tu cuenta del bróker. Hazlo solo con dinero que puedas permitirte perder.",
      `${B} es un servicio independiente. Para dudas sobre tu cuenta del bróker, contacta a su soporte. Para dudas sobre tu plan de Aurex, escríbenos a nosotros.`,
    ],
  },
  {
    kind: "final",
    art: "spark",
    title: "Ya sabes cómo funciona el proceso",
    body: ["Cuando estés listo:", "1. Ve al sitio del bróker.", "2. Sigue los pasos para abrir tu cuenta de corretaje.", "3. Vuelve a Aurex a seguir practicando en modo DEMO cuando quieras."],
  },
];
