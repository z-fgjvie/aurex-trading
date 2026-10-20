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
- Pago: ya está integrado con Stripe Checkout (ver abajo). Falta crear la cuenta, poner las claves y probar en modo prueba.
- Correo: `EmailStep.tsx` tiene un TODO para enviar el lead a tu backend o CRM.
- Legales: reemplaza los enlaces `#` y el texto de renovación y cancelación por los tuyos.

## Pagos con Stripe (México)

1. `npm install stripe` (si no lo tienes) y copia `.env.example` a `.env.local`.
2. Crea la cuenta en https://dashboard.stripe.com (país: México) y pega `STRIPE_SECRET_KEY` (modo prueba: `sk_test_...`).
3. Prueba con la tarjeta `4242 4242 4242 4242`, cualquier fecha futura y CVC.
4. Webhook: en Stripe → Desarrolladores → Webhooks, apunta a `https://TU-DOMINIO/api/webhook` con los eventos
   `checkout.session.completed`, `checkout.session.async_payment_succeeded` y `checkout.session.async_payment_failed`.
   Pega el secreto en `STRIPE_WEBHOOK_SECRET`. En local: `stripe listen --forward-to localhost:3000/api/webhook`.
5. En Vercel agrega las mismas variables (Settings → Environment Variables) y vuelve a desplegar.
6. Entrega del producto: completa el TODO de `app/api/webhook/route.ts` (guardar compra y enviar correo con el acceso).

Los precios viven en `lib/config.ts` y los cobra el servidor; el navegador nunca manda el monto.
