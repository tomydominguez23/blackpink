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

  function parseApiBody(rawBody) {
    if (!rawBody) return {};
    var trimmed = String(rawBody).trim();
    try {
      return trimmed ? JSON.parse(trimmed) : {};
    } catch (_) {}

    var match = trimmed.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (_) {}
    }

    var codeMatch = trimmed.match(
      /"(missing_supabase[^"]+|customer_email_required|items_required|products_not_found|product_unavailable|insufficient_stock|cannot_create_order|webpay_create_failed)"/
    );
    if (codeMatch) {
      return { ok: false, error: codeMatch[1] };
    }

    return {};
  }

  function formatFetchError(rawMsg, base, createUrl) {
    var msg = String(rawMsg || "");
    var known = {
      missing_supabase_url:
        "El servidor no tiene configurado Supabase. Agregá SUPABASE_SERVICE_ROLE_KEY en GitHub → Settings → Secrets y redeploy.",
      missing_supabase_service_role_key:
        "Falta la clave service_role de Supabase en el servidor. En GitHub → Settings → Secrets → Actions agregá SUPABASE_SERVICE_ROLE_KEY (Dashboard Supabase → Project Settings → API → service_role) y volvé a desplegar.",
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
        "No se pudo conectar con el servidor de pago. Revisá https://bpphones.cl/api/webpay/health.php"
      );
    }
    if (/<!DOCTYPE|<html|<br\s*\/?>/i.test(msg)) {
      return (
        "El servidor de pago respondió con un error HTML en lugar de JSON. " +
        "Probablemente falta api/webpay/config.php con SUPABASE_SERVICE_ROLE_KEY. " +
        "Verificá https://bpphones.cl/api/webpay/health.php"
      );
    }
    return msg;
  }

  function errorFromResponse(data, rawBody, status, base, createUrl) {
    if (data && data.message) {
      return String(data.message);
    }
    if (data && data.error) {
      return formatFetchError(String(data.error), base, createUrl);
    }
    if (rawBody && /missing_supabase_service_role_key/.test(rawBody)) {
      return formatFetchError("missing_supabase_service_role_key", base, createUrl);
    }
    if (rawBody && /<!DOCTYPE|<html|<br\s*\/?>/i.test(rawBody)) {
      return formatFetchError(rawBody, base, createUrl);
    }
    if (rawBody && rawBody.length < 500) {
      var cleaned = rawBody.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      if (cleaned) return cleaned;
    }
    return "Error del servidor de pago (HTTP " + status + "). Revisá /api/webpay/health.php";
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
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    }).then(function (res) {
      return res.text().then(function (rawBody) {
        var data = parseApiBody(rawBody);

        if (!res.ok) {
          throw new Error(errorFromResponse(data, rawBody, res.status, base, createUrl));
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
