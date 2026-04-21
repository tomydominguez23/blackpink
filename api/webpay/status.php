<?php
declare(strict_types=1);

require __DIR__ . '/common.php';

bpw_handle_options_preflight();
bpw_allow_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    bpw_json_response(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

$token = trim((string) ($_GET['token_ws'] ?? $_GET['token'] ?? ''));
if ($token === '') {
    bpw_json_response(400, ['ok' => false, 'error' => 'token_required']);
}

$statusRes = bpw_webpay_status_transaction($token);
if (!$statusRes['ok']) {
    bpw_json_response(502, [
        'ok' => false,
        'error' => 'webpay_status_failed',
        'detail' => $statusRes['error'],
        'http_status' => $statusRes['status'],
    ]);
}

bpw_json_response(200, [
    'ok' => true,
    'status' => $statusRes['data'],
]);
