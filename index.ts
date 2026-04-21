/**
 * Edge Function: confirmar pago y descontar stock
 *
 * Despliegue:
 *   supabase secrets set PAYMENT_WEBHOOK_SECRET=tu_secreto_largo
 *   supabase functions deploy payment-confirm --no-verify-jwt
 *
 * Llamada desde tu pasarela o backend (POST):
 *   URL: https://<ref>.supabase.co/functions/v1/payment-confirm
 *   Headers:
 *     Authorization: Bearer <SUPABASE_ANON_KEY o SERVICE_ROLE — ver docs actuales>
 *     x-webhook-secret: <PAYMENT_WEBHOOK_SECRET>
 *   Body JSON: { "order_id": "<uuid del pedido pending>" }
 *
 * Adaptá esta función al payload real de Webpay Plus, Mercado Pago, Flow, etc.;
 * lo importante es validar el evento con la pasarela y luego llamar a la RPC.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-webhook-secret",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const secret = Deno.env.get("PAYMENT_WEBHOOK_SECRET");
  const got = req.headers.get("x-webhook-secret");
  if (!secret || got !== secret) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  let body: { order_id?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const orderId = body.order_id?.trim();
  if (!orderId) {
    return new Response(JSON.stringify({ error: "order_id_required" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    return new Response(JSON.stringify({ error: "server_misconfigured" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const admin = createClient(url, key);
  const { data, error } = await admin.rpc("mark_order_paid_and_decrement_stock", {
    p_order_id: orderId,
  });

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const result = data as { ok?: boolean; error?: string };
  if (result?.ok === false) {
    return new Response(JSON.stringify(result), {
      status: 422,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(data ?? { ok: true }), {
    status: 200,
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
