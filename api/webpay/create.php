<?php
declare(strict_types=1);

require __DIR__ . '/common.php';

bpw_handle_options_preflight();
bpw_allow_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    bpw_json_response(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

$payload = bpw_read_json_body();
$email = isset($payload['customer_email']) ? trim((string) $payload['customer_email']) : '';
$includeShipping = !empty($payload['include_shipping']);
$rawItems = isset($payload['items']) && is_array($payload['items']) ? $payload['items'] : [];

if ($rawItems === []) {
    $singlePid = isset($payload['product_id']) ? trim((string) $payload['product_id']) : '';
    $singleQty = isset($payload['quantity']) ? (int) $payload['quantity'] : 1;
    if ($singlePid !== '') {
        $rawItems = [[
            'product_id' => $singlePid,
            'quantity' => $singleQty > 0 ? $singleQty : 1,
        ]];
    }
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    bpw_json_response(422, ['ok' => false, 'error' => 'customer_email_required']);
}

$items = bpw_normalize_items($rawItems);
if ($items === []) {
    bpw_json_response(422, ['ok' => false, 'error' => 'items_required']);
}

$productIds = array_values(array_unique(array_map(static fn(array $i): string => $i['product_id'], $items)));
$products = bpw_fetch_products_by_ids($productIds);
if ($products === []) {
    $probe = bpw_supabase_request('GET', '/rest/v1/products', [
        'select' => 'id',
        'limit' => '1',
    ]);
    if (!$probe['ok']) {
        bpw_json_response(502, [
            'ok' => false,
            'error' => 'supabase_products_query_failed',
            'detail' => [
                'http_status' => $probe['status'],
                'body' => $probe['text'],
            ],
        ]);
    }
    $probeRows = is_array($probe['json']) ? $probe['json'] : [];
    if ($probeRows === []) {
        bpw_json_response(422, [
            'ok' => false,
            'error' => 'catalog_empty_or_not_visible',
            'requested_product_ids' => $productIds,
        ]);
    }
    bpw_json_response(422, [
        'ok' => false,
        'error' => 'products_not_found',
        'requested_product_ids' => $productIds,
    ]);
}
$productMap = [];
foreach ($products as $p) {
    if (!isset($p['id'])) {
        continue;
    }
    $productMap[(string) $p['id']] = $p;
}

$missingIds = [];
foreach ($productIds as $pid) {
    if (!array_key_exists($pid, $productMap)) {
        $missingIds[] = $pid;
    }
}
if ($missingIds !== []) {
    bpw_json_response(422, [
        'ok' => false,
        'error' => 'products_not_found',
        'requested_product_ids' => $productIds,
        'found_product_ids' => array_values(array_keys($productMap)),
        'missing_product_ids' => $missingIds,
    ]);
}

$subtotal = 0;
$orderItems = [];
foreach ($items as $line) {
    $pid = $line['product_id'];
    $qty = (int) $line['quantity'];
    if (!isset($productMap[$pid])) {
        bpw_json_response(422, ['ok' => false, 'error' => 'product_not_found', 'product_id' => $pid]);
    }
    $product = $productMap[$pid];
    $stock = (int) ($product['stock'] ?? 0);
    $published = (bool) ($product['published'] ?? false);
    $unit = (int) ($product['price'] ?? 0);
    if (!$published || $stock < 1) {
        bpw_json_response(422, ['ok' => false, 'error' => 'product_unavailable', 'product_id' => $pid]);
    }
    if ($qty > $stock) {
        bpw_json_response(422, ['ok' => false, 'error' => 'insufficient_stock', 'product_id' => $pid]);
    }
    if ($unit < 0) {
        bpw_json_response(422, ['ok' => false, 'error' => 'invalid_price', 'product_id' => $pid]);
    }
    $subtotal += ($unit * $qty);
    $orderItems[] = [
        'product_id' => $pid,
        'quantity' => $qty,
        'unit_price' => $unit,
        'product_external_id' => isset($product['external_id']) ? (string) $product['external_id'] : null,
    ];
}

$shippingClp = (int) bpw_env('SHIPPING_CLP', '15000');
if ($shippingClp < 0) {
    $shippingClp = 0;
}
$shipping = $includeShipping ? $shippingClp : 0;
$total = $subtotal + $shipping;
if ($total <= 0) {
    bpw_json_response(422, ['ok' => false, 'error' => 'invalid_total']);
}

$orderPayload = [
    'status' => 'pending',
    'provider' => BPW_PROVIDER,
    'customer_email' => $email,
    'total_amount' => $total,
    'metadata' => [
        'source' => 'checkout-carrito',
        'include_shipping' => $includeShipping,
        'shipping_amount' => $shipping,
        'subtotal_amount' => $subtotal,
    ],
];
$orderInsert = bpw_supabase_request('POST', '/rest/v1/orders', [], $orderPayload, [
    'Prefer' => 'return=representation',
]);
if (!$orderInsert['ok'] || !is_array($orderInsert['json']) || !isset($orderInsert['json'][0]) || !is_array($orderInsert['json'][0])) {
    bpw_json_response(502, [
        'ok' => false,
        'error' => 'cannot_create_order',
        'detail' => [
            'http_status' => $orderInsert['status'],
            'body' => $orderInsert['text'],
            'hint' => 'Revisa SUPABASE_SERVICE_ROLE_KEY (debe ser service_role), existencia de tabla public.orders y SQL de migración ejecutado.',
        ],
    ]);
}
$order = $orderInsert['json'][0];

$orderId = (string) $order['id'];
$itemRows = [];
foreach ($orderItems as $oi) {
    $itemRows[] = [
        'order_id' => $orderId,
        'product_id' => $oi['product_id'],
        'quantity' => $oi['quantity'],
        'unit_price' => $oi['unit_price'],
        'product_external_id' => $oi['product_external_id'],
    ];
}
$itemsInsert = bpw_supabase_request('POST', '/rest/v1/order_items', [], $itemRows);
if (!$itemsInsert['ok']) {
    bpw_patch_order($orderId, [
        'status' => 'failed',
        'metadata' => [
            'source' => 'checkout-carrito',
            'include_shipping' => $includeShipping,
            'shipping_amount' => $shipping,
            'subtotal_amount' => $subtotal,
            'order_items_error' => 'cannot_create_order_items',
            'order_items_http_status' => $itemsInsert['status'],
            'order_items_error_body' => $itemsInsert['text'],
        ],
    ]);
    bpw_json_response(502, [
        'ok' => false,
        'error' => 'cannot_create_order_items',
        'detail' => [
            'http_status' => $itemsInsert['status'],
            'body' => $itemsInsert['text'],
            'hint' => 'Revisa tabla public.order_items y foreign keys (order_id/product_id).',
        ],
    ]);
}

$buyOrder = bpw_generate_buy_order($orderId);
$sessionId = substr('sess_' . str_replace('-', '', $orderId), 0, 61);
$returnUrl = bpw_env('WEBPAY_RETURN_URL', bpw_current_origin() . '/api/webpay/return.php');

$tx = bpw_webpay_create_transaction([
    'buy_order' => $buyOrder,
    'session_id' => $sessionId,
    'amount' => $total,
    'return_url' => $returnUrl,
]);
if (!$tx['ok'] || !is_array($tx['data']) || !isset($tx['data']['token'], $tx['data']['url'])) {
    bpw_patch_order($orderId, [
        'status' => 'failed',
        'metadata' => [
            'source' => 'checkout-carrito',
            'include_shipping' => $includeShipping,
            'shipping_amount' => $shipping,
            'subtotal_amount' => $subtotal,
            'webpay_create_error' => $tx['error'],
            'webpay_http_status' => $tx['status'],
        ],
    ]);
    bpw_json_response(502, ['ok' => false, 'error' => 'webpay_create_failed', 'detail' => $tx['error']]);
}

$token = (string) $tx['data']['token'];
$url = (string) $tx['data']['url'];

bpw_patch_order($orderId, [
    'provider_payment_id' => $token,
    'metadata' => [
        'source' => 'checkout-carrito',
        'include_shipping' => $includeShipping,
        'shipping_amount' => $shipping,
        'subtotal_amount' => $subtotal,
        'webpay_buy_order' => $buyOrder,
        'webpay_session_id' => $sessionId,
    ],
]);

bpw_json_response(200, [
    'ok' => true,
    'url' => $url,
    'token' => $token,
    'order_id' => $orderId,
]);
