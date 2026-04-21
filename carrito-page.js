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

  function render() {
    var root = document.getElementById("bpCartRoot");
    if (!root) return;
    if (!window.BlackpinkCart) {
      root.innerHTML =
        '<div class="bp-cart-empty">' +
        "<h2>No se pudo cargar el carrito</h2>" +
        '<p class="bp-cart-lead">El archivo <code>cart.js</code> no está disponible o fue bloqueado. Revisá que esté subido junto a esta página, con el mismo nombre (minúsculas) y que el servidor lo sirva como JavaScript (no como HTML).</p>' +
        '<a class="btn btn-primary" href="productos.html">Ir al catálogo</a>' +
        "</div>";
      return;
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
          '<svg class="bp-cart-qty-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
        var icoUp =
          '<svg class="bp-cart-qty-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 15l-6-6-6 6"/></svg>';
        var lineTotalHtml =
          qty > 1
            ? '<span class="bp-cart-line-line-total">' +
              formatClp(sub) +
              ' <span class="bp-cart-line-unit-label">(' +
              qty +
              " u.)</span></span>"
            : "";
        return (
          '<li class="bp-cart-line-card">' +
          '<div class="bp-cart-line-card__media">' +
          '<img class="bp-cart-line-img" src="' +
          escapeHtml(it.image || "") +
          '" alt=""/>' +
          "</div>" +
          '<div class="bp-cart-line-card__body">' +
          '<h2 class="bp-cart-line-title">' +
          escapeHtml(it.title || "") +
          "</h2>" +
          optStr +
          '<div class="bp-cart-line-card__meta">' +
          '<div class="bp-cart-line-meta-start">' +
          '<span class="bp-cart-line-unit">' +
          formatClp(it.price) +
          " <span class=\"bp-cart-line-unit-label\">c/u</span></span>" +
          lineTotalHtml +
          "</div>" +
          '<div class="bp-cart-meta-actions">' +
          '<div class="bp-cart-qty" role="group" aria-label="Cantidad">' +
          '<button type="button" class="bp-cart-qty-btn bp-cart-qty-btn--down" data-bp-qty="' +
          escapeHtml(it.key) +
          '" data-d="-1"' +
          minusDis +
          ' aria-label="Disminuir cantidad">' +
          icoDown +
          "</button>" +
          '<span class="bp-cart-qty-val">' +
          qty +
          "</span>" +
          '<button type="button" class="bp-cart-qty-btn bp-cart-qty-btn--up" data-bp-qty="' +
          escapeHtml(it.key) +
          '" data-d="1"' +
          plusDis +
          ' aria-label="Aumentar cantidad">' +
          icoUp +
          "</button>" +
          "</div>" +
          '<button type="button" class="bp-cart-remove" data-bp-remove="' +
          escapeHtml(it.key) +
          '">Quitar</button>' +
          "</div></div></div></li>"
        );
      })
      .join("");

    root.innerHTML =
      '<div class="bp-cart-layout">' +
      '<div class="bp-cart-main-col">' +
      '<header class="bp-cart-page-head">' +
      "<h1>Tu carro</h1>" +
      '<p class="bp-cart-lead">Revisá los productos. Marcá envío si corresponde y continuá al pago seguro con Webpay.</p>' +
      "</header>" +
      '<ul class="bp-cart-line-list" aria-label="Productos en el carrito">' +
      rows +
      "</ul></div>" +
      '<aside class="bp-cart-aside" aria-label="Resumen del pedido">' +
      '<div class="bp-cart-summary">' +
      '<h2 class="bp-cart-aside-title">Resumen</h2>' +
      '<div class="bp-cart-ship-row">' +
      '<input type="checkbox" id="bpCartShip" ' +
      (st.includeShipping ? "checked" : "") +
      "/>" +
      '<label for="bpCartShip">Envío a domicilio<br/><span class="bp-cart-ship-note">Todo Chile · se suma ' +
      formatClp(ship) +
      " · 1 a 2 días hábiles</span></label>" +
      "</div>" +
      '<div class="bp-cart-sum-line"><span>Subtotal productos</span><span>' +
      formatClp(totals.subtotal) +
      "</span></div>" +
      '<div class="bp-cart-sum-line"><span>Envío</span><span>' +
      (st.includeShipping ? formatClp(ship) : "$0") +
      "</span></div>" +
      '<div class="bp-cart-sum-line bp-cart-sum-line--total"><span>Total</span><span>' +
      formatClp(totals.total) +
      "</span></div>" +
      '<label class="bp-cart-label" for="bpCartEmail">Email para el comprobante</label>' +
      '<input type="email" class="bp-cart-input" id="bpCartEmail" placeholder="tu@email.com" autocomplete="email" />' +
      '<button type="button" class="bp-cart-pay" id="bpCartPay">Pagar con Webpay</button>' +
      '<a class="bp-cart-wa" href="https://api.whatsapp.com/send/?phone=56943524545&text=' +
      encodeURIComponent("Hola, armé un carrito en la web y quiero coordinar pago/envío.") +
      '" target="_blank" rel="noopener noreferrer">Coordinar por WhatsApp</a>' +
      "</div></aside></div>";

    var shipEl = document.getElementById("bpCartShip");
    if (shipEl) {
      shipEl.addEventListener("change", function () {
        window.BlackpinkCart.setIncludeShipping(shipEl.checked);
        render();
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
    if (pay) {
      pay.addEventListener("click", function () {
        var email = (document.getElementById("bpCartEmail") && document.getElementById("bpCartEmail").value.trim()) || "";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          window.alert("Ingresá un email válido para continuar con Webpay.");
          return;
        }
        try {
          sessionStorage.setItem("bp_checkout_email", email);
        } catch (_) {}
        window.location.href = "checkout-carrito.html";
      });
    }
  }

  window.addEventListener("bp:cart-changed", function () {
    render();
  });

  document.addEventListener("DOMContentLoaded", render);
})();
