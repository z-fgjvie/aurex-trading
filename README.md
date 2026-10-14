# Aurex Quiz (Next.js + TypeScript + Tailwind)

Quiz de embudo en pasos: portada, preguntas, pantallas informativas, resumen, elección de bot, demo, correo y oferta.

## Correr

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Dónde cambiar cosas

- `lib/config.ts`: nombre de marca, textos legales, planes y precios, cuenta regresiva, reseñas.
- `lib/steps.ts`: preguntas, opciones, pantallas informativas y los bots.
- `components/steps/`: una pantalla por archivo.
- `components/ui/`: piezas reutilizables (Header, OptionCard, botones, ilustraciones).
- `components/quiz/QuizFlow.tsx`: el flujo y el estado de las respuestas.

## Pendiente antes de publicar

- Reseñas: `testimonials` en `lib/config.ts` está vacío a propósito. Agrega solo reseñas reales de clientes.
- Pago: el modal de `OfferStep.tsx` es de demostración y no procesa pagos. Conecta tu pasarela.
- Correo: `EmailStep.tsx` tiene un TODO para enviar el lead a tu backend o CRM.
- Legales: reemplaza los enlaces `#` y el texto de renovación y cancelación por los tuyos.
