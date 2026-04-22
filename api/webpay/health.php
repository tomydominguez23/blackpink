<?php
declare(strict_types=1);

require __DIR__ . '/common.php';

bpw_handle_options_preflight();
bpw_allow_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    bpw_json_response(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

$mode = strtolower((string) bpw_env('WEBPAY_MODE', 'integration'));
$creds = bpw_webpay_credentials();

bpw_json_response(200, [
    'ok' => true,
    'service' => 'webpay-php',
    'mode' => $mode,
    'webpay_api_base' => bpw_webpay_api_base(),
    'commerce_code' => $creds['commerce_code'],
    'supabase_configured' => bpw_env('SUPABASE_URL', '') !== '' && bpw_env('SUPABASE_SERVICE_ROLE_KEY', '') !== '',
    'resend_configured' => bpw_env('RESEND_API_KEY', '') !== '' && bpw_env('EMAIL_FROM', '') !== '',
    'whatsapp_configured' => (
        bpw_env('WHATSAPP_WEBHOOK_URL', '') !== ''
        || (bpw_env('WHATSAPP_CALLMEBOT_PHONE', '') !== '' && bpw_env('WHATSAPP_CALLMEBOT_APIKEY', '') !== '')
    ),
    'time' => bpw_now_iso(),
]);

