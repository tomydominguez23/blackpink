/**
 * Inicia pago Webpay Plus desde el carrito (POST create.php → redirect Transbank).
 * Expone window.BlackpinkWebpayCheckout
 */
(function () {
  var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  function normalizeApiBase(raw) {
    return String(raw || "")
      .trim()
      .replace(/\/$/, "");
  }

  function apiCreateUrl(base) {
    var b = normalizeApiBase(base);
    if (!b) return "/api/webpay/create.php";
    return b + "/api/webpay/create.php";
  }

  function apiHealthUrl(base) {
    var b = normalizeApiBase(base);
    if (!b) return "/api/webpay/health.php";
    return b + "/api/webpay/health.php";
  }

  function formatFetchError(rawMsg, base, createUrl) {
    var msg = String(rawMsg || "");
    var known = {
      missing_supabase_url:
        "El servidor no tiene configurado Supabase (falta config.php). Agregá SUPABASE_SERVICE_ROLE_KEY en GitHub → Settings → Secrets.",
      missing_supabase_service_role_key:
        "Falta la clave service_role de Supabase en el servidor. Configurala en GitHub Secrets o en api/webpay/config.php.",
      customer_email_required: "Ingresá un email válido.",
      items_required: "El carrito está vacío o sin productos válidos.",
      products_not_found:
        "Uno o más productos del carrito no existen en el inventario. Volvé a agregarlos desde la tienda.",
      product_unavailable: "Hay un producto sin stock o no publicado.",
      insufficient_stock: "No hay stock suficiente para la cantidad elegida.",
      cannot_create_order:
        "No se pudo crear el pedido en la base de datos. Revisá la configuración de Supabase.",
      webpay_create_failed: "Transbank no pudo crear la transacción. Revisá credenciales Webpay.",
    };
    if (known[msg]) return known[msg];
    if (
      rawMsg === "Failed to fetch" ||
      rawMsg === "Load failed" ||
      rawMsg === "NetworkError when attempting to fetch resource."
    ) {
      return (
        "No se pudo conectar con el servidor de pago. Revisá que exista /api/webpay/create.php y probá: " +
        apiHealthUrl(base)
      );
    }
    if (/<!DOCTYPE|<html/i.test(msg)) {
      return "La URL " + createUrl + " no devolvió JSON del API de pago.";
    }
    return msg;
  }

  /**
   * @param {object} opts
   * @param {string} opts.email
   * @param {boolean} opts.includeShipping
   * @param {Array<{product_id:string,quantity:number}>} opts.items
   * @param {object} [opts.customer]
   * @param {string} [opts.apiBase]
   */
  function start(opts) {
    opts = opts || {};
    var email = String(opts.email || "").trim();
    var base = normalizeApiBase(opts.apiBase);
    var createUrl = apiCreateUrl(base);
    var body = {
      customer_email: email,
      include_shipping: Boolean(opts.includeShipping),
      items: opts.items || [],
    };
    if (opts.customer && typeof opts.customer === "object") {
      body.customer = opts.customer;
    }

    return fetch(createUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(function (res) {
        return res.text().then(function (rawBody) {
          var data = {};
          try {
            data = rawBody ? JSON.parse(rawBody) : {};
          } catch (_) {
            data = {};
          }
          if (!res.ok) {
            var errDetail = data && data.error ? String(data.error) : "";
            if (!errDetail) {
              if (/<!DOCTYPE|<html/i.test(rawBody)) {
                errDetail = formatFetchError(rawBody, base, createUrl);
              } else if (rawBody && rawBody.length < 500) {
                errDetail = rawBody.replace(/<[^>]+>/g, " ").trim();
              } else {
                errDetail = "HTTP " + res.status;
              }
            }
            throw new Error(formatFetchError(errDetail, base, createUrl));
          }
          if (!data.url || !data.token) {
            throw new Error("Respuesta del servidor sin url/token de Webpay.");
          }
          try {
            sessionStorage.setItem("bp_checkout_email", email);
          } catch (_) {}
          var form = document.createElement("form");
          form.method = "POST";
          form.action = data.url;
          var input = document.createElement("input");
          input.type = "hidden";
          input.name = "token_ws";
          input.value = data.token;
          form.appendChild(input);
          document.body.appendChild(form);
          form.submit();
        });
      });
  }

  window.BlackpinkWebpayCheckout = {
    UUID_RE: UUID_RE,
    start: start,
    apiCreateUrl: apiCreateUrl,
    apiHealthUrl: apiHealthUrl,
  };
})();
