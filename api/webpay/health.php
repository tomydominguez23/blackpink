<?php
declare(strict_types=1);

require __DIR__ . '/common.php';

bpw_handle_options_preflight();
bpw_allow_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    bpw_json_response(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

$webpay = bpw_webpay_status();
$supabaseOk = bpw_env('SUPABASE_SERVICE_ROLE_KEY', '') !== '';

$setupHint = $webpay['setup_hint'];
if ($supabaseOk === false) {
    $setupHint = 'Agrega SUPABASE_SERVICE_ROLE_KEY en GitHub Secrets y redeploy, o sube api/webpay/config.php al servidor.';
}

bpw_json_response(200, [
    'ok' => true,
    'service' => 'webpay-php',
    'mode' => $webpay['mode'],
    'payments_live' => $webpay['payments_live'],
    'using_test_credentials' => $webpay['using_test_credentials'],
    'webpay_api_base' => bpw_webpay_api_base(),
    'commerce_code' => $webpay['commerce_code'],
    'api_key_configured' => $webpay['api_key_configured'],
    'supabase_configured' => $supabaseOk,
    'supabase_url' => bpw_env('SUPABASE_URL', BPW_DEFAULT_SUPABASE_URL),
    'config_php_present' => is_file(__DIR__ . '/config.php'),
    'setup_hint' => $setupHint,
    'resend_configured' => bpw_env('RESEND_API_KEY', '') !== '' && bpw_env('EMAIL_FROM', '') !== '',
    'whatsapp_configured' => (
        bpw_env('WHATSAPP_WEBHOOK_URL', '') !== ''
        || (bpw_env('WHATSAPP_CALLMEBOT_PHONE', '') !== '' && bpw_env('WHATSAPP_CALLMEBOT_APIKEY', '') !== '')
    ),
    'time' => bpw_now_iso(),
]);
