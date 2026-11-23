<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Bilingual site

English is served at the root and Spanish under `/es`; every page lives in
`src/app/[lang]/`. Read `src/i18n/README.md` before adding or changing any
user-visible text: copy lives in `src/i18n/*.ts` dictionaries, links go
through `@/components/LocaleLink`, and database copy has `*_es` columns.

# Card payments (Powertranz / BAC Credomatic)

Behind `NEXT_PUBLIC_PAYMENT_PROVIDER=powertranz`; without it the checkout
keeps the "confirm now, we email the payment link" flow. With it,
`/api/bookings` (`payWithCard: true`) re-prices the cart from the shared
`routes` table, saves the booking in `rp_bookings` and holds the emails;
`/api/powertranz/start` opens the SPI + 3-D Secure hosted-page session,
`/api/powertranz/callback` (the MerchantResponseUrl, posted from inside the
checkout iframe) finalises the charge, marks the booking paid and sends the
paid emails from `src/lib/bookingEmails.ts`. Schema in
`supabase/payments_schema.sql` (the Supabase project is shared with
cant-wait-travel; `powertranz_transactions.site = 'ruta'`). Env vars are
documented in `.env.local.example`; the service-role key is required. The
hosted page set carries the `PTZ/` prefix (`PTZ/RUTA`), or the gateway
answers 757 "Hosted page not found".

# Cómo escribimos a los clientes

Todo texto dirigido a un cliente (correos automáticos, cotizaciones,
enlaces de pago, respuestas a reseñas, mensajes que el asistente proponga)
sigue los principios de persuasión de Cialdini, con honestidad primero. La
guía completa vive en el repositorio de Cant Wait Travel:
`cwt-web/reservas-app/docs/ESTILO_MENSAJES_CIALDINI.md`; aplica igual aquí,
con la voz de Ruta Pacífico.
