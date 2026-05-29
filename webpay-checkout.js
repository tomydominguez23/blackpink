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
    if (/<!DOCTYPE|<html/i.test(rawMsg)) {
      return "La URL " + createUrl + " no devolvió JSON del API de pago.";
    }
    return rawMsg;
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
