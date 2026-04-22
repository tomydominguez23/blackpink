<?php
declare(strict_types=1);

require __DIR__ . '/common.php';

$tbkToken = trim((string) ($_POST['TBK_TOKEN'] ?? $_GET['TBK_TOKEN'] ?? ''));
if ($tbkToken !== '') {
    bpw_html_response(
        400,
        'Pago cancelado',
        '<div class="card"><h1 class="err">Pago cancelado o abortado</h1><p>Webpay devolvió un flujo de anulación (<code>TBK_TOKEN</code>).</p><p><a href="/checkout-carrito.html">Intentar nuevamente</a></p></div>'
    );
}

$token = trim((string) ($_POST['token_ws'] ?? $_GET['token_ws'] ?? ''));
if ($token === '') {
    bpw_html_response(400, 'Pago cancelado', '<div class="card"><h1 class="err">Pago no completado</h1><p>No se recibió <code>token_ws</code> desde Webpay.</p><p><a href="/carrito.html">Volver al carrito</a></p></div>');
}

$order = bpw_find_order_by_token($token);
if ($order === null) {
    bpw_html_response(404, 'Pedido no encontrado', '<div class="card"><h1 class="err">Pedido no encontrado</h1><p>No existe una orden local para este token. Revisa si ya fue procesado o crea una nueva compra.</p><p><a href="/carrito.html">Volver al carrito</a></p></div>');
}

$currentStatus = strtolower((string) ($order['status'] ?? ''));
if ($currentStatus === 'paid' || $currentStatus === 'shipped') {
    $orderIdSafe = htmlspecialchars((string) ($order['id'] ?? ''), ENT_QUOTES, 'UTF-8');
    bpw_html_response(
        200,
        'Pago ya confirmado',
        '<div class="card"><h1 class="ok">Pago ya confirmado</h1><p>Este pedido ya fue procesado anteriormente.</p><ul class="meta"><li><strong>Pedido:</strong> ' . $orderIdSafe . '</li><li><strong>Estado:</strong> ' . htmlspecialchars($currentStatus, ENT_QUOTES, 'UTF-8') . '</li></ul><p><a href="/index.html">Volver al inicio</a></p></div>'
    );
}

$commit = bpw_webpay_commit_transaction($token);
if (!$commit['ok'] || !is_array($commit['data'])) {
    $msg = htmlspecialchars((string) $commit['error'], ENT_QUOTES, 'UTF-8');
    bpw_patch_order((string) $order['id'], [
        'status' => 'failed',
        'metadata' => array_merge((array) ($order['metadata'] ?? []), [
            'webpay_commit_error' => $commit['error'],
            'webpay_commit_status' => $commit['status'],
            'webpay_commit_failed_at' => bpw_now_iso(),
        ]),
    ]);
    bpw_html_response(502, 'Error al confirmar', '<div class="card"><h1 class="err">No se pudo confirmar el pago</h1><p>Detalle: <code>' . $msg . '</code></p><p><a href="/checkout-carrito.html">Reintentar</a></p></div>');
}

$data = $commit['data'];
$responseCode = (int) ($data['response_code'] ?? -1);
$status = strtoupper((string) ($data['status'] ?? ''));
$approved = $responseCode === 0 && $status === 'AUTHORIZED';

$patchedMetadata = array_merge((array) ($order['metadata'] ?? []), [
    'webpay_commit' => $data,
    'webpay_committed_at' => bpw_now_iso(),
]);

if (!$approved) {
    bpw_patch_order((string) $order['id'], [
        'status' => 'failed',
        'metadata' => $patchedMetadata,
    ]);
    $statusSafe = htmlspecialchars($status, ENT_QUOTES, 'UTF-8');
    bpw_html_response(
        402,
        'Pago rechazado',
        '<div class="card"><h1 class="err">Pago no aprobado</h1><p>Estado: <code>' . $statusSafe . '</code> · response_code: <code>' . $responseCode . '</code>.</p><p><a href="/checkout-carrito.html">Volver a intentar</a></p></div>'
    );
}

$rpc = bpw_mark_order_paid_and_decrement_stock((string) $order['id']);
if (!$rpc['ok']) {
    // Idempotencia: si el pedido ya no está pending, pero quedó pagado por una confirmación previa,
    // consideramos este retorno como exitoso para evitar falsos errores al refrescar la página.
    if ($rpc['error'] === 'order_not_pending_or_missing') {
        $maybeFinal = bpw_find_order_by_token($token);
        $maybeStatus = strtolower((string) ($maybeFinal['status'] ?? ''));
        if ($maybeStatus === 'paid' || $maybeStatus === 'shipped') {
            $finalOrder = $maybeFinal ?: $order;
            $notifications = ['email' => [], 'whatsapp' => ['sent' => false, 'error' => 'already_processed']];

            $orderIdSafe = htmlspecialchars((string) ($finalOrder['id'] ?? $order['id']), ENT_QUOTES, 'UTF-8');
            $buyOrderSafe = htmlspecialchars((string) ($data['buy_order'] ?? ''), ENT_QUOTES, 'UTF-8');
            $authCodeSafe = htmlspecialchars((string) ($data['authorization_code'] ?? ''), ENT_QUOTES, 'UTF-8');
            $amountFmt = number_format((int) ($data['amount'] ?? 0), 0, ',', '.');

            $metaItems = '';
            if ($authCodeSafe !== '') {
                $metaItems .= '<li><strong>Código autorización:</strong> ' . $authCodeSafe . '</li>';
            }
            $metaItems .= '<li><strong>Nota:</strong> retorno ya procesado previamente.</li>';

            bpw_html_response(
                200,
                'Pago aprobado',
                '<div class="card"><h1 class="ok">Pago aprobado</h1><p>Tu pago ya había sido confirmado previamente.</p><ul class="meta"><li><strong>Pedido:</strong> ' . $orderIdSafe . '</li><li><strong>Orden comercio:</strong> ' . $buyOrderSafe . '</li><li><strong>Monto:</strong> $' . $amountFmt . ' CLP</li>' . $metaItems . '</ul><p><a href="/index.html">Volver al inicio</a></p></div>'
            );
        }
    }

    bpw_patch_order((string) $order['id'], [
        'metadata' => array_merge($patchedMetadata, [
            'stock_confirm_error' => $rpc['error'],
            'stock_confirm_data' => $rpc['data'],
        ]),
    ]);
    bpw_html_response(
        500,
        'Pago aprobado con incidencia',
        '<div class="card"><h1 class="err">Pago aprobado, pero hubo un problema interno</h1><p>El pago se autorizó, pero no se pudo sincronizar inventario. Contacta soporte con el pedido <code>' . htmlspecialchars((string) $order['id'], ENT_QUOTES, 'UTF-8') . '</code>.</p></div>'
    );
}

$finalOrder = bpw_patch_order((string) $order['id'], [
    'status' => 'paid',
    'metadata' => $patchedMetadata,
]);
if ($finalOrder === null) {
    $finalOrder = $order;
}

$notifications = bpw_send_payment_notifications($finalOrder, $data);

$orderIdSafe = htmlspecialchars((string) ($finalOrder['id'] ?? $order['id']), ENT_QUOTES, 'UTF-8');
$buyOrderSafe = htmlspecialchars((string) ($data['buy_order'] ?? ''), ENT_QUOTES, 'UTF-8');
$authCodeSafe = htmlspecialchars((string) ($data['authorization_code'] ?? ''), ENT_QUOTES, 'UTF-8');
$amountFmt = number_format((int) ($data['amount'] ?? 0), 0, ',', '.');

$metaItems = '';
if ($authCodeSafe !== '') {
    $metaItems .= '<li><strong>Código autorización:</strong> ' . $authCodeSafe . '</li>';
}
$waInfo = isset($notifications['whatsapp']['sent']) && $notifications['whatsapp']['sent'] ? 'sí' : 'no';
$metaItems .= '<li><strong>WhatsApp automático:</strong> ' . htmlspecialchars($waInfo, ENT_QUOTES, 'UTF-8') . '</li>';

bpw_html_response(
    200,
    'Pago aprobado',
    '<div class="card"><h1 class="ok">Pago aprobado</h1><p>Tu pago fue confirmado correctamente.</p><ul class="meta"><li><strong>Pedido:</strong> ' . $orderIdSafe . '</li><li><strong>Orden comercio:</strong> ' . $buyOrderSafe . '</li><li><strong>Monto:</strong> $' . $amountFmt . ' CLP</li>' . $metaItems . '</ul><p><a href="/index.html">Volver al inicio</a></p></div>'
);
