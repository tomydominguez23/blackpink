<?php
declare(strict_types=1);

/**
 * Helpers compartidos para endpoints Webpay en PHP.
 */

const BPW_INTEGRATION_COMMERCE_CODE = '597055555532';
const BPW_INTEGRATION_API_KEY_SECRET = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';
const BPW_PROVIDER = 'webpay_plus';

$localConfigPath = __DIR__ . '/config.php';
if (is_file($localConfigPath)) {
    $localConfig = require $localConfigPath;
    if (is_array($localConfig)) {
        foreach ($localConfig as $key => $value) {
            if (!is_string($key) || $key === '' || $value === null) {
                continue;
            }
            if (getenv($key) !== false || array_key_exists($key, $_ENV)) {
                continue;
            }
            $str = (string) $value;
            // En algunos hostings compartidos putenv() está deshabilitada.
            if (function_exists('putenv')) {
                @putenv($key . '=' . $str);
            }
            $_ENV[$key] = $str;
            $_SERVER[$key] = $str;
        }
    }
}

function bpw_env(string $key, ?string $default = null): ?string
{
    $v = getenv($key);
    if ($v !== false && $v !== '') {
        return (string) $v;
    }
    if (array_key_exists($key, $_ENV) && (string) $_ENV[$key] !== '') {
        return (string) $_ENV[$key];
    }
    if (array_key_exists($key, $_SERVER) && (string) $_SERVER[$key] !== '') {
        return (string) $_SERVER[$key];
    }
    return $default;
}

function bpw_now_iso(): string
{
    return gmdate('c');
}

function bpw_current_origin(): string
{
    $proto = $_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '';
    if ($proto !== '') {
        $scheme = strtolower(explode(',', $proto)[0]) === 'https' ? 'https' : 'http';
    } else {
        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    }
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    return $scheme . '://' . $host;
}

function bpw_json_response(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function bpw_html_response(int $status, string $title, string $bodyHtml): void
{
    http_response_code($status);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">';
    echo '<title>' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '</title>';
    echo '<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:780px;margin:2rem auto;padding:0 1rem;color:#111}';
    echo '.card{border:1px solid #e5e7eb;border-radius:14px;padding:1rem 1.15rem;background:#fff}.ok{color:#166534}.err{color:#991b1b}.meta{color:#555;font-size:.95rem;line-height:1.5}';
    echo 'a{color:#1d4ed8;text-decoration:none}a:hover{text-decoration:underline}code{background:#f5f5f5;padding:.1rem .35rem;border-radius:6px}</style></head><body>';
    echo $bodyHtml;
    echo '</body></html>';
    exit;
}

function bpw_allow_cors(): void
{
    $allowed = bpw_env('CORS_ORIGIN', bpw_current_origin());
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($allowed === '*') {
        header('Access-Control-Allow-Origin: *');
    } elseif ($origin !== '' && $origin === $allowed) {
        header('Access-Control-Allow-Origin: ' . $allowed);
        header('Vary: Origin');
    } else {
        header('Access-Control-Allow-Origin: ' . $allowed);
    }
    header('Access-Control-Allow-Headers: Content-Type, Authorization, apikey');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
}

function bpw_handle_options_preflight(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        bpw_allow_cors();
        http_response_code(204);
        exit;
    }
}

/**
 * @return array<string,mixed>
 */
function bpw_read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        bpw_json_response(400, ['ok' => false, 'error' => 'invalid_json']);
    }
    return $decoded;
}

function bpw_is_uuid(string $value): bool
{
    return (bool) preg_match(
        '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i',
        $value
    );
}

/**
 * @param array<mixed> $items
 * @return array<int,array{product_id:string,quantity:int}>
 */
function bpw_normalize_items(array $items): array
{
    $out = [];
    foreach ($items as $row) {
        if (!is_array($row)) {
            continue;
        }
        $pid = isset($row['product_id']) ? trim((string) $row['product_id']) : '';
        $qty = isset($row['quantity']) ? (int) $row['quantity'] : 0;
        if (!bpw_is_uuid($pid)) {
            continue;
        }
        if ($qty < 1 || $qty > 20) {
            continue;
        }
        $out[] = ['product_id' => $pid, 'quantity' => $qty];
    }
    return $out;
}

function bpw_generate_buy_order(string $orderId): string
{
    $slug = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $orderId), 0, 10));
    $rand = strtoupper(bin2hex(random_bytes(3)));
    return substr('BP' . gmdate('ymdHis') . $slug . $rand, 0, 26);
}

function bpw_webpay_api_base(): string
{
    $explicit = bpw_env('WEBPAY_API_BASE', '');
    if ($explicit !== '') {
        return rtrim($explicit, '/');
    }
    $mode = strtolower((string) bpw_env('WEBPAY_MODE', 'integration'));
    if ($mode === 'production') {
        return 'https://webpay3g.transbank.cl/rswebpaytransaction/api/webpay/v1.2';
    }
    return 'https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2';
}

/**
 * @return array{commerce_code:string,api_key_secret:string}
 */
function bpw_webpay_credentials(): array
{
    $mode = strtolower((string) bpw_env('WEBPAY_MODE', 'integration'));
    $cc = bpw_env('WEBPAY_COMMERCE_CODE', '');
    $secret = bpw_env('WEBPAY_API_KEY_SECRET', '');
    if ($mode !== 'production') {
        if ($cc === '') {
            $cc = BPW_INTEGRATION_COMMERCE_CODE;
        }
        if ($secret === '') {
            $secret = BPW_INTEGRATION_API_KEY_SECRET;
        }
    }
    if ($cc === '' || $secret === '') {
        bpw_json_response(500, ['ok' => false, 'error' => 'missing_webpay_credentials']);
    }
    return ['commerce_code' => $cc, 'api_key_secret' => $secret];
}

/**
 * @param array<string,string> $headers
 * @param array<string,mixed>|null $body
 * @return array{ok:bool,status:int,json:array<string,mixed>|array<int,mixed>|null,text:string}
 */
function bpw_http_json(string $method, string $url, array $headers = [], ?array $body = null): array
{
    $ch = curl_init($url);
    if ($ch === false) {
        return ['ok' => false, 'status' => 0, 'json' => null, 'text' => 'curl_init_failed'];
    }
    $headerLines = [];
    foreach ($headers as $name => $value) {
        $headerLines[] = $name . ': ' . $value;
    }
    $payload = null;
    if ($body !== null) {
        $payload = json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        if ($payload === false) {
            $payload = '{}';
        }
        $headerLines[] = 'Content-Type: application/json';
    }
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => strtoupper($method),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 12,
        CURLOPT_TIMEOUT => 45,
        CURLOPT_HTTPHEADER => $headerLines,
    ]);
    if ($payload !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    }

    $response = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
        return ['ok' => false, 'status' => 0, 'json' => null, 'text' => ($err !== '' ? $err : 'curl_exec_failed')];
    }
    $decoded = json_decode($response, true);
    return [
        'ok' => $status >= 200 && $status < 300,
        'status' => $status,
        'json' => is_array($decoded) ? $decoded : null,
        'text' => (string) $response,
    ];
}

/**
 * @param array<string,mixed> $payload
 * @return array{ok:bool,status:int,data:array<string,mixed>|null,error:string}
 */
function bpw_webpay_create_transaction(array $payload): array
{
    $creds = bpw_webpay_credentials();
    $res = bpw_http_json('POST', bpw_webpay_api_base() . '/transactions', [
        'Tbk-Api-Key-Id' => $creds['commerce_code'],
        'Tbk-Api-Key-Secret' => $creds['api_key_secret'],
    ], $payload);
    $json = $res['json'];
    if (!is_array($json)) {
        return ['ok' => false, 'status' => $res['status'], 'data' => null, 'error' => trim($res['text'])];
    }
    if (!$res['ok']) {
        $msg = isset($json['error_message']) ? (string) $json['error_message'] : trim($res['text']);
        return ['ok' => false, 'status' => $res['status'], 'data' => $json, 'error' => $msg];
    }
    return ['ok' => true, 'status' => $res['status'], 'data' => $json, 'error' => ''];
}

/**
 * @return array{ok:bool,status:int,data:array<string,mixed>|null,error:string}
 */
function bpw_webpay_commit_transaction(string $token): array
{
    $creds = bpw_webpay_credentials();
    $res = bpw_http_json('PUT', bpw_webpay_api_base() . '/transactions/' . rawurlencode($token), [
        'Tbk-Api-Key-Id' => $creds['commerce_code'],
        'Tbk-Api-Key-Secret' => $creds['api_key_secret'],
    ], []);
    $json = $res['json'];
    if (!is_array($json)) {
        return ['ok' => false, 'status' => $res['status'], 'data' => null, 'error' => trim($res['text'])];
    }
    if (!$res['ok']) {
        $msg = isset($json['error_message']) ? (string) $json['error_message'] : trim($res['text']);
        return ['ok' => false, 'status' => $res['status'], 'data' => $json, 'error' => $msg];
    }
    return ['ok' => true, 'status' => $res['status'], 'data' => $json, 'error' => ''];
}

/**
 * @return array{ok:bool,status:int,data:array<string,mixed>|null,error:string}
 */
function bpw_webpay_status_transaction(string $token): array
{
    $creds = bpw_webpay_credentials();
    $res = bpw_http_json('GET', bpw_webpay_api_base() . '/transactions/' . rawurlencode($token), [
        'Tbk-Api-Key-Id' => $creds['commerce_code'],
        'Tbk-Api-Key-Secret' => $creds['api_key_secret'],
    ]);
    $json = $res['json'];
    if (!is_array($json)) {
        return ['ok' => false, 'status' => $res['status'], 'data' => null, 'error' => trim($res['text'])];
    }
    if (!$res['ok']) {
        $msg = isset($json['error_message']) ? (string) $json['error_message'] : trim($res['text']);
        return ['ok' => false, 'status' => $res['status'], 'data' => $json, 'error' => $msg];
    }
    return ['ok' => true, 'status' => $res['status'], 'data' => $json, 'error' => ''];
}

function bpw_supabase_url(): string
{
    $url = bpw_env('SUPABASE_URL', '');
    if ($url === '') {
        bpw_json_response(500, ['ok' => false, 'error' => 'missing_supabase_url']);
    }
    return rtrim($url, '/');
}

function bpw_supabase_service_key(): string
{
    $key = bpw_env('SUPABASE_SERVICE_ROLE_KEY', '');
    if ($key === '') {
        bpw_json_response(500, ['ok' => false, 'error' => 'missing_supabase_service_role_key']);
    }
    return $key;
}

/**
 * @param array<string,string> $query
 * @param array<string,mixed>|array<int,mixed>|null $payload
 * @param array<string,string> $extraHeaders
 * @return array{ok:bool,status:int,json:array<string,mixed>|array<int,mixed>|null,text:string}
 */
function bpw_supabase_request(
    string $method,
    string $path,
    array $query = [],
    $payload = null,
    array $extraHeaders = []
): array {
    $url = bpw_supabase_url() . $path;
    if ($query !== []) {
        $url .= '?' . http_build_query($query);
    }
    $key = bpw_supabase_service_key();
    $headers = [
        'Authorization' => 'Bearer ' . $key,
        'apikey' => $key,
    ];
    foreach ($extraHeaders as $k => $v) {
        $headers[$k] = $v;
    }
    if ($payload !== null && !is_array($payload)) {
        $payload = [];
    }
    return bpw_http_json($method, $url, $headers, $payload);
}

/**
 * @param array<int,string> $productIds
 * @return array<int,array<string,mixed>>
 */
function bpw_fetch_products_by_ids(array $productIds): array
{
    if ($productIds === []) {
        return [];
    }
    // En PostgREST los UUID con guiones deben enviarse entre comillas en filtros "in".
    $quotedIds = array_map(
        static fn(string $id): string => '"' . str_replace('"', '', $id) . '"',
        $productIds
    );
    $res = bpw_supabase_request('GET', '/rest/v1/products', [
        'select' => 'id,title,price,stock,published,external_id',
        'id' => 'in.(' . implode(',', $quotedIds) . ')',
    ]);
    if (!$res['ok'] || !is_array($res['json'])) {
        return [];
    }
    return array_values(array_filter($res['json'], 'is_array'));
}

/**
 * @param array<string,mixed> $payload
 * @return array<string,mixed>|null
 */
function bpw_insert_order(array $payload): ?array
{
    $res = bpw_supabase_request('POST', '/rest/v1/orders', [], $payload, [
        'Prefer' => 'return=representation',
    ]);
    if (!$res['ok'] || !is_array($res['json']) || !isset($res['json'][0]) || !is_array($res['json'][0])) {
        return null;
    }
    return $res['json'][0];
}

/**
 * @param array<int,array<string,mixed>> $rows
 */
function bpw_insert_order_items(array $rows): bool
{
    if ($rows === []) {
        return false;
    }
    $res = bpw_supabase_request('POST', '/rest/v1/order_items', [], $rows);
    return $res['ok'];
}

/**
 * @param array<string,mixed> $payload
 * @return array<string,mixed>|null
 */
function bpw_patch_order(string $orderId, array $payload): ?array
{
    $res = bpw_supabase_request('PATCH', '/rest/v1/orders', [
        'id' => 'eq.' . $orderId,
        'select' => '*',
    ], $payload, [
        'Prefer' => 'return=representation',
    ]);
    if (!$res['ok'] || !is_array($res['json']) || !isset($res['json'][0]) || !is_array($res['json'][0])) {
        return null;
    }
    return $res['json'][0];
}

/**
 * @return array<string,mixed>|null
 */
function bpw_find_order_by_token(string $token): ?array
{
    $res = bpw_supabase_request('GET', '/rest/v1/orders', [
        'select' => '*',
        'provider' => 'eq.' . BPW_PROVIDER,
        'provider_payment_id' => 'eq.' . $token,
        'limit' => '1',
    ]);
    if (!$res['ok'] || !is_array($res['json']) || !isset($res['json'][0]) || !is_array($res['json'][0])) {
        return null;
    }
    return $res['json'][0];
}

/**
 * @return array{ok:bool,error:string,data:array<string,mixed>|array<int,mixed>|null}
 */
function bpw_mark_order_paid_and_decrement_stock(string $orderId): array
{
    $res = bpw_supabase_request('POST', '/rest/v1/rpc/mark_order_paid_and_decrement_stock', [], [
        'p_order_id' => $orderId,
    ]);
    if (!$res['ok']) {
        return ['ok' => false, 'error' => 'rpc_http_' . $res['status'], 'data' => $res['json']];
    }
    if (!is_array($res['json'])) {
        return ['ok' => false, 'error' => 'rpc_invalid_response', 'data' => null];
    }
    $ok = isset($res['json']['ok']) ? (bool) $res['json']['ok'] : true;
    if (!$ok) {
        $msg = isset($res['json']['error']) ? (string) $res['json']['error'] : 'rpc_failed';
        return ['ok' => false, 'error' => $msg, 'data' => $res['json']];
    }
    return ['ok' => true, 'error' => '', 'data' => $res['json']];
}

/**
 * @return array{sent:bool,error:string}
 */
function bpw_send_resend_email(string $to, string $subject, string $html): array
{
    $apiKey = bpw_env('RESEND_API_KEY', '');
    $from = bpw_env('EMAIL_FROM', '');
    if ($apiKey === '' || $from === '' || $to === '') {
        return ['sent' => false, 'error' => 'resend_not_configured'];
    }
    $res = bpw_http_json('POST', 'https://api.resend.com/emails', [
        'Authorization' => 'Bearer ' . $apiKey,
    ], [
        'from' => $from,
        'to' => [$to],
        'subject' => $subject,
        'html' => $html,
    ]);
    if (!$res['ok']) {
        return ['sent' => false, 'error' => 'resend_http_' . $res['status']];
    }
    return ['sent' => true, 'error' => ''];
}

/**
 * @return array{sent:bool,error:string}
 */
function bpw_send_whatsapp_message(string $message): array
{
    $webhookUrl = bpw_env('WHATSAPP_WEBHOOK_URL', '');
    if ($webhookUrl !== '') {
        $res = bpw_http_json('POST', $webhookUrl, [], [
            'text' => $message,
            'source' => 'webpay_php',
            'sent_at' => bpw_now_iso(),
        ]);
        if (!$res['ok']) {
            return ['sent' => false, 'error' => 'whatsapp_webhook_http_' . $res['status']];
        }
        return ['sent' => true, 'error' => ''];
    }

    $phone = bpw_env('WHATSAPP_CALLMEBOT_PHONE', '');
    $apiKey = bpw_env('WHATSAPP_CALLMEBOT_APIKEY', '');
    if ($phone !== '' && $apiKey !== '') {
        $url = 'https://api.callmebot.com/whatsapp.php?phone=' . rawurlencode($phone)
            . '&text=' . rawurlencode($message)
            . '&apikey=' . rawurlencode($apiKey);
        $res = bpw_http_json('GET', $url);
        if (!$res['ok']) {
            return ['sent' => false, 'error' => 'callmebot_http_' . $res['status']];
        }
        return ['sent' => true, 'error' => ''];
    }

    return ['sent' => false, 'error' => 'whatsapp_not_configured'];
}

/**
 * @param array<string,mixed> $order
 * @param array<string,mixed> $commitData
 */
function bpw_send_payment_notifications(array $order, array $commitData): array
{
    $customerEmail = isset($order['customer_email']) ? trim((string) $order['customer_email']) : '';
    $adminEmail = trim((string) bpw_env('ADMIN_ALERT_EMAIL', ''));
    $orderId = (string) ($order['id'] ?? '');
    $buyOrder = (string) ($commitData['buy_order'] ?? '');
    $amount = (int) ($commitData['amount'] ?? 0);
    $authCode = (string) ($commitData['authorization_code'] ?? '');
    $maskedCard = '';
    if (isset($commitData['card_detail']) && is_array($commitData['card_detail']) && isset($commitData['card_detail']['card_number'])) {
        $maskedCard = (string) $commitData['card_detail']['card_number'];
    }
    $subject = 'Pago aprobado #' . $buyOrder;
    $html = '<h2>Pago aprobado</h2>'
        . '<p>Tu pago en Blackpink Phones fue confirmado correctamente.</p>'
        . '<ul>'
        . '<li><strong>Pedido:</strong> ' . htmlspecialchars($orderId, ENT_QUOTES, 'UTF-8') . '</li>'
        . '<li><strong>Orden comercio:</strong> ' . htmlspecialchars($buyOrder, ENT_QUOTES, 'UTF-8') . '</li>'
        . '<li><strong>Monto:</strong> $' . number_format($amount, 0, ',', '.') . ' CLP</li>'
        . ($authCode !== '' ? '<li><strong>Cód. autorización:</strong> ' . htmlspecialchars($authCode, ENT_QUOTES, 'UTF-8') . '</li>' : '')
        . ($maskedCard !== '' ? '<li><strong>Tarjeta (últimos dígitos):</strong> ' . htmlspecialchars($maskedCard, ENT_QUOTES, 'UTF-8') . '</li>' : '')
        . '</ul>';

    $emailResults = [];
    if ($customerEmail !== '') {
        $emailResults['customer'] = bpw_send_resend_email($customerEmail, $subject, $html);
    }
    if ($adminEmail !== '') {
        $emailResults['admin'] = bpw_send_resend_email($adminEmail, '[Admin] ' . $subject, $html);
    }

    $whatsAppText = 'Pago aprobado en Blackpink Phones'
        . "\nPedido: " . $orderId
        . "\nOrden: " . $buyOrder
        . "\nMonto: $" . number_format($amount, 0, ',', '.') . ' CLP'
        . ($customerEmail !== '' ? "\nCliente: " . $customerEmail : '');
    $waResult = bpw_send_whatsapp_message($whatsAppText);

    return ['email' => $emailResults, 'whatsapp' => $waResult];
}

