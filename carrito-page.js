(function () {
  var CANONICAL_HOST = "bpphones.cl";
  var host = (window.location.hostname || "").toLowerCase().replace(/^www\./, "");
  if (host && host !== CANONICAL_HOST && /blackpink|bpphones|bp-?phones/i.test(host)) {
    window.location.replace(
      "https://" + CANONICAL_HOST + window.location.pathname + window.location.search + window.location.hash
    );
    return;
  }

  function initDeployBadge() {
    fetch("/deploy-version.json", { cache: "no-store" })
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (data) {
        if (!data || !data.commit_short) return;
        var badge = document.createElement("p");
        badge.className = "bp-deploy-badge";
        badge.setAttribute("aria-label", "Versión del sitio desplegada");
        badge.textContent = "Sitio actualizado · " + data.commit_short;
        if (data.deployed_at) badge.title = data.deployed_at;
        var footer = document.querySelector(".site-footer .footer-inner, .site-footer");
        if (footer) footer.appendChild(badge);
        else document.body.appendChild(badge);
      })
      .catch(function () {});
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] || c;
    });
  }

  function formatClp(n) {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(Number(n) || 0);
  }

  function customerPayload(data) {
    return {
      delivery: data.delivery,
      first_name: data.firstName,
      last_name: data.lastName,
      company: data.company || null,
      address: data.address || null,
      address2: data.address2 || null,
      rut: data.rut,
      commune: data.commune || null,
      region: data.region || null,
      phone: data.phone,
      email: data.email,
    };
  }

  function refreshSummary(root) {
    var st = window.BlackpinkCart.load();
    var totals = window.BlackpinkCart.getTotals();
    var ship = window.BlackpinkCart.SHIPPING_CLP;
    var lines = root.querySelectorAll(".bp-cart-sum-line");
    if (lines.length >= 2) {
      lines[1].innerHTML =
        "<span>" +
        (st.includeShipping ? "Envío a domicilio" : "Retiro en tienda") +
        "</span><span>" +
        (st.includeShipping ? formatClp(ship) : "Gratis (retiro)") +
        "</span>";
    }
    var totalEl = root.querySelector(".bp-cart-sum-line--total span:last-child");
    if (totalEl) totalEl.textContent = formatClp(totals.total);
  }

  var payServerOk = null;

  function showPayError(payErr, msg) {
    if (payErr) {
      payErr.textContent = msg;
      payErr.removeAttribute("hidden");
      payErr.setAttribute("role", "alert");
      payErr.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    window.alert(msg);
  }

  function focusFirstInvalidField(customerData) {
    var map = [
      ["bpCoFirstName", !customerData.firstName],
      ["bpCoLastName", !customerData.lastName],
      ["bpCoRut", !customerData.rut],
      ["bpCoPhone", !customerData.phone || customerData.phone.replace(/\D/g, "").length < 8],
      ["bpCoEmail", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email || "")],
      ["bpCoAddress", customerData.delivery === "shipping" && !customerData.address],
      ["bpCoCommune", customerData.delivery === "shipping" && !customerData.commune],
    ];
    for (var i = 0; i < map.length; i++) {
      if (map[i][1]) {
        var el = document.getElementById(map[i][0]);
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        break;
      }
    }
  }

  function checkPayServerFresh() {
    var Wp = window.BlackpinkWebpayCheckout;
    if (!Wp || typeof Wp.apiHealthUrl !== "function") {
      return Promise.resolve(true);
    }
    return fetch(Wp.apiHealthUrl(), { cache: "no-store" })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        payServerOk = Boolean(data && data.supabase_configured);
        return payServerOk;
      })
      .catch(function () {
        return payServerOk !== false;
      });
  }

  function handlePayClick() {
    var root = document.getElementById("bpCartRoot");
    var pay = document.getElementById("bpCartPay");
    var payErr = document.getElementById("bpCartPayErr");
    if (!root || !pay) return;

    if (payErr) {
      payErr.hidden = true;
      payErr.textContent = "";
    }

    var CoLive = window.BlackpinkCheckoutCustomer;
    var WpLive = window.BlackpinkWebpayCheckout;
    if (!WpLive || !CoLive) {
      var missing = [];
      if (!CoLive) missing.push("checkout-customer.js");
      if (!WpLive) missing.push("webpay-checkout.js");
      showPayError(
        payErr,
        "No se cargaron los scripts de pago (" + missing.join(", ") + "). Recargá con Cmd+Shift+R."
      );
      return;
    }

    var customerData = CoLive.readForm(root);
    var errs = CoLive.validate(customerData);
    if (errs.length) {
      focusFirstInvalidField(customerData);
      showPayError(payErr, errs.join(" "));
      return;
    }

    if (customerData.saveInfo) CoLive.save(customerData);
    else CoLive.save({ saveInfo: false });

    var stPay = window.BlackpinkCart.load();
    if (!stPay.items.length) {
      showPayError(payErr, "Tu carrito está vacío.");
      return;
    }

    if (window.BlackpinkCart.hasInvalidProductIds && window.BlackpinkCart.hasInvalidProductIds()) {
      showPayError(
        payErr,
        "Hay productos guardados con un formato viejo. Usá «Vaciar carrito y reintentar» abajo, volvé al catálogo y agregá los productos de nuevo."
      );
      return;
    }

    var items = stPay.items.map(function (it) {
      return { product_id: String(it.productId), quantity: Number(it.quantity) || 1 };
    });

    pay.disabled = true;
    pay.textContent = "Conectando con Webpay…";

    checkPayServerFresh().then(function (ready) {
      if (!ready) {
        pay.disabled = false;
        pay.textContent = "Pagar con Webpay";
        showPayError(
          payErr,
          "El servidor aún no tiene configurado Supabase para pagos. Revisá https://bpphones.cl/api/webpay/health.php"
        );
        return;
      }

      return WpLive.start({
        email: customerData.email,
        includeShipping: Boolean(stPay.includeShipping),
        items: items,
        customer: customerPayload(customerData),
      }).catch(function (err) {
        pay.disabled = false;
        pay.textContent = "Pagar con Webpay";
        showPayError(payErr, String(err && err.message ? err.message : err));
      });
    });
  }

  function render() {
    var root = document.getElementById("bpCartRoot");
    if (!root) return;
    if (!window.BlackpinkCart) {
      root.innerHTML =
        '<div class="bp-cart-empty">' +
        "<h2>No se pudo cargar el carrito</h2>" +
        '<p class="bp-cart-lead">El archivo <code>cart.js</code> no está disponible o fue bloqueado.</p>' +
        '<a class="btn btn-primary" href="productos.html">Ir al catálogo</a>' +
        "</div>";
      return;
    }

    var Co = window.BlackpinkCheckoutCustomer;
    var st = window.BlackpinkCart.load();
    var totals = window.BlackpinkCart.getTotals();
    var ship = window.BlackpinkCart.SHIPPING_CLP;
    var savedCustomer = Co ? Co.load() : null;
    var formCustomer = Co
      ? Object.assign({}, savedCustomer || Co.load(), {
          delivery: st.includeShipping ? "shipping" : "pickup",
        })
      : null;

    if (!st.items.length) {
      root.innerHTML =
        '<div class="bp-cart-empty">' +
        "<h2>Tu carro está vacío</h2>" +
        '<p class="bp-cart-lead">Agregá productos desde el catálogo o la ficha de un equipo.</p>' +
        '<a class="btn btn-primary" href="productos.html">Ir al catálogo</a>' +
        "</div>";
      return;
    }

    var formHtml = Co
      ? Co.renderFormHtml(formCustomer)
      : '<div class="bp-cart-empty" style="margin-top:1rem">' +
        "<h2>Faltan scripts de checkout</h2>" +
        '<p class="bp-cart-lead">No se cargó <code>checkout-customer.js</code>. Recargá con Ctrl+Shift+R (Mac: Cmd+Shift+R).</p>' +
        '<button type="button" class="btn btn-primary" onclick="location.reload()">Recargar</button>' +
        "</div>";

    var rows = st.items
      .map(function (it) {
        var opts = [];
        if (it.options && it.options.capacityLabel) opts.push(it.options.capacityLabel);
        if (it.options && it.options.colorName) opts.push(it.options.colorName);
        var optStr = opts.length ? '<p class="bp-cart-line-opts">' + escapeHtml(opts.join(" · ")) + "</p>" : "";
        var sub = (Number(it.price) || 0) * (Number(it.quantity) || 0);
        var qty = Math.max(0, Number(it.quantity) || 0);
        var maxQ = Math.max(1, Number(it.maxQty) || 99);
        var minusDis = qty <= 1 ? ' disabled="disabled"' : "";
        var plusDis = qty >= maxQ ? ' disabled="disabled"' : "";
        var icoDown =
          '<svg class="bp-cart-qty-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
        var icoUp =
          '<svg class="bp-cart-qty-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" aria-hidden="true"><path d="M18 15l-6-6-6 6"/></svg>';
        var lineTotalHtml =
          qty > 1
            ? '<span class="bp-cart-line-line-total">' + formatClp(sub) + ' <span class="bp-cart-line-unit-label">(' + qty + " u.)</span></span>"
            : "";
        return (
          '<li class="bp-cart-line-card">' +
          '<div class="bp-cart-line-card__media"><img class="bp-cart-line-img" src="' +
          escapeHtml(it.image || "") +
          '" alt=""/></div>' +
          '<div class="bp-cart-line-card__body">' +
          '<h2 class="bp-cart-line-title">' +
          escapeHtml(it.title || "") +
          "</h2>" +
          optStr +
          '<div class="bp-cart-line-card__meta">' +
          '<div class="bp-cart-line-meta-start"><span class="bp-cart-line-unit">' +
          formatClp(it.price) +
          ' <span class="bp-cart-line-unit-label">c/u</span></span>' +
          lineTotalHtml +
          "</div>" +
          '<div class="bp-cart-meta-actions">' +
          '<div class="bp-cart-qty" role="group" aria-label="Cantidad">' +
          '<button type="button" class="bp-cart-qty-btn" data-bp-qty="' +
          escapeHtml(it.key) +
          '" data-d="-1"' +
          minusDis +
          ">" +
          icoDown +
          '</button><span class="bp-cart-qty-val">' +
          qty +
          '</span><button type="button" class="bp-cart-qty-btn" data-bp-qty="' +
          escapeHtml(it.key) +
          '" data-d="1"' +
          plusDis +
          ">" +
          icoUp +
          "</button></div>" +
          '<button type="button" class="bp-cart-remove" data-bp-remove="' +
          escapeHtml(it.key) +
          '">Quitar</button>' +
          "</div></div></div></li>"
        );
      })
      .join("");

    var shipLabel = st.includeShipping ? formatClp(ship) : "Gratis (retiro)";
    var invalidCart =
      window.BlackpinkCart.hasInvalidProductIds && window.BlackpinkCart.hasInvalidProductIds();
    var invalidWarn = invalidCart
      ? '<div class="bp-cart-empty bp-cart-server-warn" style="margin-bottom:1rem">' +
        "<h2>Carrito desactualizado</h2>" +
        '<p class="bp-cart-lead">Los productos guardados son de una versión anterior del sitio. Vacialo y volvé a agregarlos desde el catálogo.</p>' +
        '<button type="button" class="btn btn-primary" id="bpCartClearStale">Vaciar carrito y reintentar</button></div>'
      : "";

    root.innerHTML =
      invalidWarn +
      '<div class="bp-cart-layout">' +
      '<div class="bp-cart-main-col">' +
      '<header class="bp-cart-page-head"><h1>Tu carro</h1>' +
      '<p class="bp-cart-lead">Revisá los productos, completá tus datos y pagá con Webpay.</p></header>' +
      '<ul class="bp-cart-line-list" aria-label="Productos">' +
      rows +
      "</ul>" +
      formHtml +
      "</div>" +
      '<aside class="bp-cart-aside" aria-label="Resumen">' +
      '<div class="bp-cart-summary"><h2 class="bp-cart-aside-title">Resumen</h2>' +
      '<div class="bp-cart-sum-line"><span>Subtotal productos</span><span>' +
      formatClp(totals.subtotal) +
      "</span></div>" +
      '<div class="bp-cart-sum-line"><span>' +
      (st.includeShipping ? "Envío a domicilio" : "Retiro en tienda") +
      "</span><span>" +
      shipLabel +
      "</span></div>" +
      '<div class="bp-cart-sum-line bp-cart-sum-line--total"><span>Total</span><span>' +
      formatClp(totals.total) +
      "</span></div>" +
      '<button type="button" class="bp-cart-pay" id="bpCartPay">Pagar con Webpay</button>' +
      '<p class="bp-cart-pay-note">Serás redirigido a Transbank para completar el pago.</p>' +
      '<p class="bp-cart-pay-err" id="bpCartPayErr" hidden></p>' +
      '<a class="bp-cart-wa" href="https://api.whatsapp.com/send/?phone=56943524545&text=' +
      encodeURIComponent("Hola, armé un carrito en la web.") +
      '" target="_blank" rel="noopener">Coordinar por WhatsApp</a>' +
      "</div></aside></div>";

    if (Co) {
      Co.wireDeliveryTabs(root, function () {
        refreshSummary(root);
      });
    }

    root.querySelectorAll("[data-bp-qty]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-bp-qty");
        var d = parseInt(btn.getAttribute("data-d"), 10) || 0;
        var st2 = window.BlackpinkCart.load();
        var line = st2.items.find(function (x) {
          return x.key === key;
        });
        if (!line) return;
        window.BlackpinkCart.setQty(key, (Number(line.quantity) || 0) + d);
        render();
      });
    });

    root.querySelectorAll("[data-bp-remove]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.BlackpinkCart.removeLine(btn.getAttribute("data-bp-remove"));
        render();
      });
    });

    var clearBtn = document.getElementById("bpCartClearStale");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        window.BlackpinkCart.clearAll();
        render();
      });
    }
  }

  document.addEventListener("click", function (e) {
    if (e.target && e.target.closest && e.target.closest("#bpCartPay")) {
      e.preventDefault();
      handlePayClick();
    }
  });

  window.addEventListener("bp:cart-changed", render);
  document.addEventListener("DOMContentLoaded", function () {
    initDeployBadge();
    render();
    checkPayServer();
  });

  function checkPayServer() {
    checkPayServerFresh().then(function (ok) {
      var root = document.getElementById("bpCartRoot");
      if (!root) return;

      fetch(window.BlackpinkWebpayCheckout.apiHealthUrl(), { cache: "no-store" })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          if (ok === false) {
            if (root.querySelector(".bp-cart-server-warn")) return;
            var warn = document.createElement("div");
            warn.className = "bp-cart-empty bp-cart-server-warn";
            warn.style.marginBottom = "1rem";
            warn.innerHTML =
              "<h2>Pago temporalmente no disponible en el servidor</h2>" +
              '<p class="bp-cart-lead">Falta configurar Supabase en el hosting (<code>api/webpay/config.php</code>). ' +
              "El administrador debe agregar el secreto <strong>SUPABASE_SERVICE_ROLE_KEY</strong> en GitHub y volver a desplegar.</p>";
            root.insertBefore(warn, root.firstChild);
            return;
          }
          if (data && data.supabase_configured && data.payments_live === false && !root.querySelector(".bp-cart-test-warn")) {
            var testWarn = document.createElement("div");
            testWarn.className = "bp-cart-empty bp-cart-test-warn";
            testWarn.style.marginBottom = "1rem";
            testWarn.innerHTML =
              "<h2>Webpay en modo prueba</h2>" +
              '<p class="bp-cart-lead">Los pagos <strong>no cobran dinero real</strong> hasta configurar producción Transbank en GitHub Secrets ' +
              "(<code>WEBPAY_MODE=production</code>, <code>WEBPAY_COMMERCE_CODE</code>, <code>WEBPAY_API_KEY_SECRET</code>).</p>";
            root.insertBefore(testWarn, root.firstChild);
          }
        })
        .catch(function () {});
    });
  }
})();
