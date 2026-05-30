<?php
/**
 * Genera api/webpay/config.php desde variables de entorno (GitHub Actions secrets).
 * Uso: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... php scripts/generate-webpay-config.php
 */
declare(strict_types=1);

$outPath = __DIR__ . '/../api/webpay/config.php';

$supabaseUrl = trim((string) (getenv('SUPABASE_URL') ?: 'https://kodehyjdonripddobqgs.supabase.co'));
$serviceKey = trim((string) (getenv('SUPABASE_SERVICE_ROLE_KEY') ?: ''));

if ($supabaseUrl === '' || $serviceKey === '') {
    fwrite(STDERR, "Omitiendo config.php: faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno.\n");
    exit(0);
}

$siteUrl = rtrim(trim((string) (getenv('SITE_URL') ?: 'https://bpphones.cl')), '/');
$webpayMode = trim((string) (getenv('WEBPAY_MODE') ?: 'integration'));
$commerceCode = trim((string) (getenv('WEBPAY_COMMERCE_CODE') ?: ''));
$apiSecret = trim((string) (getenv('WEBPAY_API_KEY_SECRET') ?: ''));
$shipping = trim((string) (getenv('SHIPPING_CLP') ?: '15000'));
$resendKey = trim((string) (getenv('RESEND_API_KEY') ?: ''));
$emailFrom = trim((string) (getenv('EMAIL_FROM') ?: ''));
$adminEmail = trim((string) (getenv('ADMIN_ALERT_EMAIL') ?: ''));

$lines = [
    '<?php',
    '/** Generado en deploy — no editar en el repo. */',
    'return [',
    "    'WEBPAY_MODE' => " . var_export($webpayMode, true) . ',',
    "    'WEBPAY_COMMERCE_CODE' => " . var_export($commerceCode, true) . ',',
    "    'WEBPAY_API_KEY_SECRET' => " . var_export($apiSecret, true) . ',',
    "    'WEBPAY_RETURN_URL' => " . var_export($siteUrl . '/api/webpay/return.php', true) . ',',
    "    'CORS_ORIGIN' => " . var_export($siteUrl, true) . ',',
    "    'SUPABASE_URL' => " . var_export($supabaseUrl, true) . ',',
    "    'SUPABASE_SERVICE_ROLE_KEY' => " . var_export($serviceKey, true) . ',',
    "    'SHIPPING_CLP' => " . var_export($shipping, true) . ',',
    "    'RESEND_API_KEY' => " . var_export($resendKey, true) . ',',
    "    'EMAIL_FROM' => " . var_export($emailFrom, true) . ',',
    "    'ADMIN_ALERT_EMAIL' => " . var_export($adminEmail, true) . ',',
    "    'WHATSAPP_WEBHOOK_URL' => '',",
    "    'WHATSAPP_CALLMEBOT_PHONE' => '',",
    "    'WHATSAPP_CALLMEBOT_APIKEY' => '',",
    '];',
    '',
];

$content = implode("\n", $lines);
if (file_put_contents($outPath, $content) === false) {
    fwrite(STDERR, "No se pudo escribir {$outPath}\n");
    exit(1);
}

fwrite(STDOUT, "config.php generado en api/webpay/config.php\n");
