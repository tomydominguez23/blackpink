# Webpay Plus (PHP) — guía rápida para cPanel

Esta integración reemplaza el backend Node por endpoints PHP en:

- `api/webpay/health.php`
- `api/webpay/create.php`
- `api/webpay/return.php`
- `api/webpay/status.php`
- `api/webpay/debug-products.php` (diagnóstico de IDs/carrito)

## 1) Requisitos mínimos

- Hosting con PHP 8.0+ (ideal 8.1+)
- Extensión `curl` habilitada
- Proyecto Supabase ya creado
- SQL de pedidos ejecutado:
  - `supabase-schema.sql` completo, o al menos
  - `supabase-migration-orders-and-stock-on-payment.sql`
  - `supabase-migration-admin-orders-rls-shipped.sql` (si usarás panel admin)

## 2) Configuración

1. Copia:

   - `api/webpay/config.example.php` → `api/webpay/config.php`

2. Edita `api/webpay/config.php` con tus credenciales:

   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `WEBPAY_MODE` (`integration` al inicio)
   - `WEBPAY_RETURN_URL` (ej. `https://blackpinkphones.cl/api/webpay/return.php`)
   - `CORS_ORIGIN` (ej. `https://blackpinkphones.cl`)

3. Opcional para notificaciones:

   - Email (Resend):
     - `RESEND_API_KEY`
     - `EMAIL_FROM`
     - `ADMIN_ALERT_EMAIL`
   - WhatsApp automático:
     - Opción A (webhook propio): `WHATSAPP_WEBHOOK_URL`
     - Opción B (CallMeBot): `WHATSAPP_CALLMEBOT_PHONE`, `WHATSAPP_CALLMEBOT_APIKEY`

> `config.php` está ignorado en git para no exponer secretos.

## 2.1) Configurar return_url en Transbank (Integración)

En tu portal Transbank para ambiente de integración, registra como URL de retorno:

- `https://blackpinkphones.cl/api/webpay/return.php`

Debe coincidir con `WEBPAY_RETURN_URL` si lo configuras manualmente.

## 3) Pruebas de salud

Abrir en navegador:

- `https://blackpinkphones.cl/api/webpay/health.php`

Debe devolver JSON con:

- `"ok": true`
- `"mode": "integration"`
- `"supabase_configured": true`

## 4) Flujo de compra

1. `checkout-carrito.html` llama `POST /api/webpay/create.php`
2. Se crea pedido `pending` en Supabase (`orders` + `order_items`)
3. Se redirige a Transbank con `token_ws`
4. Transbank retorna a `/api/webpay/return.php`
5. `return.php` hace commit y, si está aprobado:
   - Ejecuta RPC `mark_order_paid_and_decrement_stock`
   - Deja pedido en `paid`
   - Envía notificaciones (email/whatsapp) si están configuradas

## 4b) Diagnóstico rápido de productos (cuando aparece `products_not_found`)

Usa:

- `GET /api/webpay/debug-products.php`
- `POST /api/webpay/debug-products.php`

Body ejemplo:

```json
{
  "product_ids": [
    "11111111-1111-4111-8111-111111111111",
    "22222222-2222-4222-8222-222222222222"
  ]
}
```

Respuesta:

- `requested_product_ids`
- `found_product_ids`
- `missing_product_ids`
- detalle por producto (`published`, `stock`, `title`, `price`)

## 5) Credenciales integración (test)

Por defecto, esta integración usa las credenciales estándar de integración de Webpay Plus:

- Commerce code: `597055555532`
- API key secret integración: `579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C`

En producción, debes configurar:

- `WEBPAY_MODE=production`
- `WEBPAY_COMMERCE_CODE=<tu código real>`
- `WEBPAY_API_KEY_SECRET=<tu llave real>`

## 6) Nota de seguridad

- Nunca subas secretos al repositorio.
- Mantén `config.php` solo en servidor.
