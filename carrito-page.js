(function () {
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
    var savedCustomer = Co ? Co.load() : null;

    if (Co && savedCustomer && window.BlackpinkCart) {
      window.BlackpinkCart.setIncludeShipping(savedCustomer.delivery === "shipping");
    }

    var st = window.BlackpinkCart.load();
    var totals = window.BlackpinkCart.getTotals();
    var ship = window.BlackpinkCart.SHIPPING_CLP;

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
      ? Co.renderFormHtml(savedCustomer)
      : "<p class=\"bp-cart-lead\">Completá tus datos antes de pagar.</p>";

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

    root.innerHTML =
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

    var pay = document.getElementById("bpCartPay");
    var payErr = document.getElementById("bpCartPayErr");
    if (!pay) return;

    pay.addEventListener("click", function () {
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
        var msg =
          "No se cargaron los scripts de pago (" +
          missing.join(", ") +
          "). Recargá con Ctrl+Shift+R o probá en otra pestaña.";
        if (payErr) {
          payErr.textContent = msg;
          payErr.hidden = false;
        } else window.alert(msg);
        return;
      }

      var customerData = CoLive.readForm(root);
      var errs = CoLive.validate(customerData);
      if (errs.length) {
        if (payErr) {
          payErr.textContent = errs.join(" ");
          payErr.hidden = false;
        } else window.alert(errs.join("\n"));
        return;
      }

      if (customerData.saveInfo) CoLive.save(customerData);
      else CoLive.save({ saveInfo: false });

      var stPay = window.BlackpinkCart.load();
      var UUID_RE = WpLive.UUID_RE;
      for (var i = 0; i < stPay.items.length; i++) {
        if (!UUID_RE.test(String(stPay.items[i].productId || ""))) {
          var bad =
            "Hay productos sin ID válido de catálogo. Volvé a agregarlos desde la tienda.";
          if (payErr) {
            payErr.textContent = bad;
            payErr.hidden = false;
          } else window.alert(bad);
          return;
        }
      }

      var items = stPay.items.map(function (it) {
        return { product_id: String(it.productId), quantity: Number(it.quantity) || 1 };
      });

      pay.disabled = true;
      pay.textContent = "Conectando con Webpay…";

      WpLive
        .start({
          email: customerData.email,
          includeShipping: Boolean(stPay.includeShipping),
          items: items,
          customer: customerPayload(customerData),
        })
        .catch(function (err) {
          pay.disabled = false;
          pay.textContent = "Pagar con Webpay";
          var raw = String(err && err.message ? err.message : err);
          if (payErr) {
            payErr.textContent = raw;
            payErr.hidden = false;
          } else window.alert(raw);
        });
    });
  }

  window.addEventListener("bp:cart-changed", render);
  document.addEventListener("DOMContentLoaded", render);
})();
