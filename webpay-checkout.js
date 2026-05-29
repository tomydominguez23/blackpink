(function (global) {
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

  function defaultApiBase() {
    if (
      typeof location !== "undefined" &&
      (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ) {
      return "http://localhost:3333";
    }
    return "";
  }

  function formatFetchError(rawMsg, base) {
    if (
      rawMsg === "Failed to fetch" ||
      rawMsg === "Load failed" ||
      rawMsg === "NetworkError when attempting to fetch resource."
    ) {
      return (
        "No se pudo conectar con el servidor de pago. Revisá que exista POST /api/webpay/create.php y CORS para " +
        (typeof location !== "undefined" ? location.origin || "este sitio" : "el sitio") +
        ". Probá: " +
        apiHealthUrl(base)
      );
    }
    return rawMsg;
  }

  async function startWebpayCheckout(opts) {
    opts = opts || {};
    var email = String(opts.email || "").trim();
    var apiBase = opts.apiBase != null ? opts.apiBase : defaultApiBase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Ingresá un email válido para continuar con Webpay.");
    }
    if (!global.BlackpinkCart) {
      throw new Error("No se cargó el carrito.");
    }

    var st = global.BlackpinkCart.load();
    if (!st.items.length) {
      throw new Error("Tu carro está vacío.");
    }

    for (var i = 0; i < st.items.length; i++) {
      if (!UUID_RE.test(String(st.items[i].productId || ""))) {
        throw new Error(
          "Hay productos en el carrito sin UUID de base de datos; no se puede cobrar con Webpay hasta que el catálogo use IDs de Supabase."
        );
      }
    }

    var items = st.items.map(function (it) {
      return { product_id: String(it.productId), quantity: Number(it.quantity) || 1 };
    });

    var createUrl = apiCreateUrl(apiBase);
    var body = {
      customer_email: email,
      include_shipping: Boolean(st.includeShipping),
      items: items,
    };

    var res = await fetch(createUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    var rawBody = await res.text();
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
          errDetail =
            "La URL " +
            createUrl +
            " no devolvió JSON del servidor de pago. Revisá /api/webpay/create.php y probá " +
            apiHealthUrl(apiBase);
        } else if (rawBody && rawBody.length < 500) {
          errDetail = rawBody.replace(/<[^>]+>/g, " ").trim();
        } else {
          errDetail = "HTTP " + res.status + " (sin mensaje JSON).";
        }
      }
      throw new Error(errDetail);
    }

    if (!data.url || !data.token) {
      throw new Error("Respuesta sin url/token de Transbank.");
    }

    try {
      global.sessionStorage.setItem("bp_checkout_email", email);
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
  }

  global.BlackpinkWebpayCheckout = {
    start: startWebpayCheckout,
    apiCreateUrl: apiCreateUrl,
    apiHealthUrl: apiHealthUrl,
    normalizeApiBase: normalizeApiBase,
    defaultApiBase: defaultApiBase,
    formatFetchError: formatFetchError,
  };
})(typeof window !== "undefined" ? window : this);
