<?php
/**
 * Copia este archivo como config.php (mismo directorio) y rellena valores reales.
 * NO subir config.php al repositorio.
 */
return [
    // integration | production
    'WEBPAY_MODE' => 'integration',

    // En integración puedes dejar vacío: usa credenciales oficiales de prueba.
    'WEBPAY_COMMERCE_CODE' => '',
    'WEBPAY_API_KEY_SECRET' => '',

    // Si no defines WEBPAY_RETURN_URL se usa: https://tu-dominio/api/webpay/return.php
    'WEBPAY_RETURN_URL' => '',

    // CORS para checkout-carrito.html
    'CORS_ORIGIN' => 'https://blackpinkphones.cl',

    // Supabase service role (obligatorio para crear/actualizar orders + rpc stock)
    'SUPABASE_URL' => 'https://TU_REFERENCIA.supabase.co',
    'SUPABASE_SERVICE_ROLE_KEY' => 'TU_SERVICE_ROLE_KEY',

    // Envío (si include_shipping=true desde checkout)
    'SHIPPING_CLP' => '15000',

    // Notificaciones email (Resend)
    'RESEND_API_KEY' => '',
    'EMAIL_FROM' => '',
    'ADMIN_ALERT_EMAIL' => '',

    // WhatsApp automático: usa una de estas dos opciones:
    // 1) Webhook propio:
    'WHATSAPP_WEBHOOK_URL' => '',
    // 2) CallMeBot:
    'WHATSAPP_CALLMEBOT_PHONE' => '',
    'WHATSAPP_CALLMEBOT_APIKEY' => '',
];
