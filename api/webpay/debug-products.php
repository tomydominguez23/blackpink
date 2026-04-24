<?php
declare(strict_types=1);

require __DIR__ . '/common.php';

bpw_handle_options_preflight();
bpw_allow_cors();

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? ''));
if ($method !== 'POST' && $method !== 'GET') {
    bpw_json_response(405, [
        'ok' => false,
        'error' => 'method_not_allowed',
        'allowed_methods' => ['GET', 'POST'],
    ]);
}

if ($method === 'POST') {
    $body = bpw_read_json_body();
    $rawItems = isset($body['items']) && is_array($body['items']) ? $body['items'] : [];

    if ($rawItems === []) {
        $singlePid = isset($body['product_id']) ? trim((string) $body['product_id']) : '';
        $singleQty = isset($body['quantity']) ? (int) $body['quantity'] : 1;
        if ($singlePid !== '') {
            $rawItems = [[
                'product_id' => $singlePid,
                'quantity' => $singleQty > 0 ? $singleQty : 1,
            ]];
        }
    }
} else {
    $rawItems = [];
    $singlePid = isset($_GET['product_id']) ? trim((string) $_GET['product_id']) : '';
    $multi = isset($_GET['product_ids']) ? trim((string) $_GET['product_ids']) : '';
    if ($singlePid !== '') {
        $rawItems[] = ['product_id' => $singlePid, 'quantity' => 1];
    }
    if ($multi !== '') {
        $ids = array_filter(array_map('trim', explode(',', $multi)));
        foreach ($ids as $id) {
            $rawItems[] = ['product_id' => $id, 'quantity' => 1];
        }
    }
}

$items = bpw_normalize_items($rawItems);
if ($items === []) {
    bpw_json_response(422, [
        'ok' => false,
        'error' => 'items_required',
        'hint' => 'Usa POST con {"items":[{"product_id":"<uuid>","quantity":1}]} o GET con ?product_id=<uuid>',
    ]);
}

$requestedIds = array_values(array_unique(array_map(static fn(array $i): string => $i['product_id'], $items)));
$products = bpw_fetch_products_by_ids($requestedIds);
$map = [];
foreach ($products as $p) {
    if (!isset($p['id'])) {
        continue;
    }
    $map[(string) $p['id']] = $p;
}

$foundIds = array_values(array_keys($map));
$missingIds = [];
foreach ($requestedIds as $id) {
    if (!isset($map[$id])) {
        $missingIds[] = $id;
    }
}

$details = [];
foreach ($requestedIds as $id) {
    if (!isset($map[$id])) {
        $details[] = [
            'product_id' => $id,
            'exists' => false,
            'published' => null,
            'stock' => null,
            'price' => null,
            'title' => null,
        ];
        continue;
    }
    $p = $map[$id];
    $details[] = [
        'product_id' => $id,
        'exists' => true,
        'published' => (bool) ($p['published'] ?? false),
        'stock' => (int) ($p['stock'] ?? 0),
        'price' => (int) ($p['price'] ?? 0),
        'title' => isset($p['title']) ? (string) $p['title'] : '',
    ];
}

bpw_json_response(200, [
    'ok' => true,
    'requested_product_ids' => $requestedIds,
    'found_product_ids' => $foundIds,
    'missing_product_ids' => $missingIds,
    'products' => $details,
    'hint' => $missingIds === []
        ? 'IDs encontrados. Si create falla, revisar published/stock y RLS.'
        : 'Hay IDs del carrito que no existen en el proyecto Supabase configurado.',
]);

