/**
 * Carrito local (localStorage) + modal post-agregado + badge en header.
 * Depende de: ninguno. Expone window.BlackpinkCart
 */
(function () {
  var STORAGE_KEY = "blackpink_cart_v1";
  var SHIPPING_CLP = 15000;

  function safeParse(raw) {
    try {
      var o = JSON.parse(raw);
      if (!o || typeof o !== "object") return { items: [], includeShipping: false };
      if (!Array.isArray(o.items)) o.items = [];
      o.includeShipping = Boolean(o.includeShipping);
      return o;
    } catch (_) {
      return { items: [], includeShipping: false };
    }
  }

  function load() {
    return safeParse(localStorage.getItem(STORAGE_KEY) || "{}");
  }

  function save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    try {
      window.dispatchEvent(new CustomEvent("bp:cart-changed", { detail: state }));
    } catch (_) {}
    refreshHeaderBadge();
  }

  function lineKey(productId, gb, colorName) {
    var g = Number.isFinite(Number(gb)) ? String(gb) : "0";
    var c = String(colorName || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
    return productId + "|" + g + "|" + c;
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

  function countItems() {
    var st = load();
    return st.items.reduce(function (a, it) {
      return a + (Number(it.quantity) || 0);
    }, 0);
  }

  function subtotalOnly(state) {
    return state.items.reduce(function (a, it) {
      return a + (Number(it.price) || 0) * (Number(it.quantity) || 0);
    }, 0);
  }

  function getTotals() {
    var st = load();
    var sub = subtotalOnly(st);
    var ship = st.includeShipping ? SHIPPING_CLP : 0;
    return { subtotal: sub, shipping: ship, total: sub + ship, includeShipping: st.includeShipping };
  }

  function refreshHeaderBadge() {
    var n = countItems();
    document.querySelectorAll(".header-cart").forEach(function (a) {
      var badge = a.querySelector(".header-cart-badge");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "header-cart-badge";
        badge.setAttribute("aria-hidden", "true");
        a.appendChild(badge);
      }
      badge.textContent = n > 99 ? "99+" : String(n);
      badge.hidden = n === 0;
      a.setAttribute("aria-label", n ? "Carrito (" + n + " productos)" : "Carrito de compras");
    });
  }

  /**
   * @param {object} line — { productId, title, image, price, quantity, maxQty, categoryLabel, options: { capacityLabel, colorName, gb } }
   */
  function addItem(line) {
    var st = load();
    var key = lineKey(line.productId, line.options && line.options.gb, line.options && line.options.colorName);
    var qty = Math.max(1, Math.min(Number(line.maxQty) || 99, Number(line.quantity) || 1));
    var idx = st.items.findIndex(function (it) {
      return it.key === key;
    });
    if (idx >= 0) {
      var next = (Number(st.items[idx].quantity) || 0) + qty;
      var cap = Math.max(1, Number(line.maxQty) || 99, Number(st.items[idx].maxQty) || 99);
      st.items[idx].maxQty = cap;
      st.items[idx].quantity = Math.min(cap, next);
    } else {
      st.items.push({
        key: key,
        productId: line.productId,
        title: line.title,
        image: line.image || "",
        price: Math.round(Number(line.price)) || 0,
        quantity: qty,
        maxQty: Math.max(1, Number(line.maxQty) || 99),
        categoryLabel: line.categoryLabel || "",
        options: {
          capacityLabel: (line.options && line.options.capacityLabel) || "",
          colorName: (line.options && line.options.colorName) || "",
          gb: line.options && Number.isFinite(Number(line.options.gb)) ? Number(line.options.gb) : null,
        },
      });
    }
    save(st);
    return st;
  }

  function removeLine(key) {
    var st = load();
    st.items = st.items.filter(function (it) {
      return it.key !== key;
    });
    save(st);
  }

  function setQty(key, qty) {
    var st = load();
    var q = Math.max(0, Math.min(99, parseInt(qty, 10) || 0));
    st.items = st.items
      .map(function (it) {
        if (it.key !== key) return it;
        if (q === 0) return null;
        var max = Math.max(1, Number(it.maxQty) || 99);
        return Object.assign({}, it, { quantity: Math.min(max, q) });
      })
      .filter(Boolean);
    save(st);
  }

  function setIncludeShipping(on) {
    var st = load();
    st.includeShipping = Boolean(on);
    save(st);
  }

  function closeModal() {
    var m = document.getElementById("bpCartAddedModal");
    if (m) {
      m.remove();
      document.body.classList.remove("bp-modal-open");
    }
  }

  /** Si styles.css no carga en el servidor, el modal queda visible (fixed + z-index + tarjeta). */
  function ensureModalFallbackCss() {
    if (document.getElementById("bp-cart-modal-fallback-style")) return;
    var el = document.createElement("style");
    el.id = "bp-cart-modal-fallback-style";
    el.textContent =
      "body.bp-modal-open{overflow:hidden}" +
      ".bp-cart-modal-root{position:fixed;inset:0;z-index:12000;display:flex;align-items:center;justify-content:center;padding:1rem;box-sizing:border-box;font-family:system-ui,sans-serif}" +
      ".bp-cart-modal-backdrop{position:absolute;inset:0;background:rgba(15,18,28,.62)}" +
      ".bp-cart-modal-card{position:relative;z-index:1;width:100%;max-width:560px;max-height:min(90vh,720px);overflow:auto;background:#fff;border-radius:20px;border:1px solid #e2e8f0;box-shadow:0 24px 48px -12px rgba(15,23,42,.22);padding:1.5rem}" +
      ".bp-cart-modal-x{position:absolute;top:.85rem;right:.85rem;width:2.5rem;height:2.5rem;border:0;border-radius:999px;background:#f1f5f9;color:#475569;font-size:1.4rem;line-height:1;cursor:pointer}" +
      ".bp-cart-modal-head{display:flex;align-items:flex-start;gap:.85rem;margin-bottom:1rem;padding-right:2.5rem}" +
      ".bp-cart-modal-check{flex-shrink:0;width:2.5rem;height:2.5rem;border-radius:999px;background:#16a34a;color:#fff;display:flex;align-items:center;justify-content:center}" +
      ".bp-cart-modal-head h2{margin:0 0 .25rem;font-size:1.15rem;font-weight:800;color:#0f172a}" +
      ".bp-cart-modal-sub{margin:0;font-size:.875rem;color:#64748b}" +
      ".bp-cart-modal-line{display:flex;gap:1rem;align-items:flex-start;margin-top:.5rem}" +
      ".bp-cart-modal-thumb{width:88px;height:88px;object-fit:cover;border-radius:12px;flex-shrink:0}" +
      ".bp-cart-modal-line-txt h3{margin:0;font-size:1rem;color:#0f172a}" +
      ".bp-cart-modal-brand{margin:0 0 .2rem;font-size:.7rem;text-transform:uppercase;color:#64748b;font-weight:700}" +
      ".bp-cart-modal-opts{margin:.2rem 0;font-size:.82rem;color:#64748b}" +
      ".bp-cart-modal-price{margin:.25rem 0 0;font-weight:800;color:#0f172a}" +
      ".bp-cart-modal-stock-note{margin:.35rem 0 0;font-size:.8rem;color:#64748b}" +
      ".bp-cart-modal-alert{display:flex;gap:.65rem;margin-top:1rem;padding:.75rem;border-radius:12px;background:#fff7ed;border:1px solid #fed7aa;font-size:.85rem}" +
      ".bp-cart-modal-alert-ico{flex-shrink:0;width:1.5rem;height:1.5rem;border-radius:8px;background:#f97316;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800}" +
      ".bp-cart-modal-upsell{margin-top:1rem}" +
      ".bp-cart-modal-upsell h4{margin:0 0 .65rem;font-size:1rem;font-weight:800;color:#0f172a}" +
      ".bp-modal-ups-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.65rem}" +
      "@media(max-width:520px){.bp-modal-ups-grid{grid-template-columns:1fr}}" +
      ".bp-modal-ups-card{display:flex;flex-direction:column;border:1px solid #e2e8f0;border-radius:12px;padding:.55rem;text-decoration:none;color:inherit;background:#fff}" +
      ".bp-modal-ups-img{display:block;border-radius:10px;overflow:hidden;aspect-ratio:1;background:#f8fafc}" +
      ".bp-modal-ups-img img{width:100%;height:100%;object-fit:cover}" +
      ".bp-modal-ups-brand{font-size:.62rem;color:#64748b;text-transform:uppercase;font-weight:700;margin-top:.35rem}" +
      ".bp-modal-ups-title{font-size:.74rem;font-weight:600;color:#1e293b;line-height:1.3;margin-top:.2rem}" +
      ".bp-modal-ups-price{font-size:.8rem;font-weight:800;color:#dc2626;margin-top:.35rem}" +
      ".bp-modal-ups-disc{font-size:.72rem;color:#dc2626;font-weight:700}" +
      ".bp-cart-modal-actions{display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1rem;padding-top:1rem;border-top:1px solid #e2e8f0}" +
      ".bp-cart-modal-btn-secondary,.bp-cart-modal-btn-primary{flex:1;min-width:9rem;text-align:center;padding:.75rem 1rem;border-radius:12px;font-weight:700;cursor:pointer;font-size:.95rem;border:1px solid #cbd5e1;background:#fff;color:#334155}" +
      ".bp-cart-modal-btn-primary{background:linear-gradient(135deg,#ec4899,#db2777);border-color:transparent;color:#fff;text-decoration:none;display:inline-block;box-sizing:border-box}";
    document.head.appendChild(el);
  }

  function openAddedModal(addedLine, catalogProducts) {
    closeModal();
    ensureModalFallbackCss();
    var ups = (catalogProducts || [])
      .filter(function (x) {
        return x && x.id !== addedLine.productId;
      })
      .sort(function () {
        return Math.random() - 0.5;
      })
      .slice(0, 3);

    var optBits = [];
    if (addedLine.options && addedLine.options.capacityLabel) optBits.push(addedLine.options.capacityLabel);
    if (addedLine.options && addedLine.options.colorName) optBits.push(addedLine.options.colorName);
    var optStr = optBits.length ? optBits.join(" · ") : "";

    var upsHtml = ups
      .map(function (u) {
        var disc =
          u.oldPrice && u.oldPrice > u.price ? '<span class="bp-modal-ups-disc">-' + Math.round((1 - u.price / u.oldPrice) * 100) + "%</span>" : "";
        return (
          '<a class="bp-modal-ups-card" href="producto.html?id=' +
          encodeURIComponent(u.id) +
          '">' +
          '<span class="bp-modal-ups-img"><img src="' +
          escapeHtml(u.image || "") +
          '" alt="" loading="lazy" width="120" height="120"/></span>' +
          '<span class="bp-modal-ups-brand">' +
          escapeHtml(u.categoryLabel || "") +
          "</span>" +
          '<span class="bp-modal-ups-title">' +
          escapeHtml(u.title || "") +
          "</span>" +
          '<span class="bp-modal-ups-price">' +
          formatClp(u.price) +
          "</span>" +
          disc +
          "</a>"
        );
      })
      .join("");

    var html =
      '<div id="bpCartAddedModal" class="bp-cart-modal-root" role="dialog" aria-modal="true" aria-labelledby="bpCartAddedTitle">' +
      '<div class="bp-cart-modal-backdrop" data-bp-cart-close></div>' +
      '<div class="bp-cart-modal-card">' +
      '<button type="button" class="bp-cart-modal-x" data-bp-cart-close aria-label="Cerrar">×</button>' +
      '<div class="bp-cart-modal-head">' +
      '<span class="bp-cart-modal-check" aria-hidden="true">\u2713</span>' +
      '<div class="bp-cart-modal-head-text">' +
      '<h2 id="bpCartAddedTitle">Producto agregado a tu carro</h2>' +
      '<p class="bp-cart-modal-sub">Podés seguir navegando o ir al carrito para pagar.</p>' +
      "</div></div>" +
      '<div class="bp-cart-modal-main">' +
      '<div class="bp-cart-modal-line">' +
      '<img src="' +
      escapeHtml(addedLine.image || "") +
      '" alt="" width="88" height="88" loading="lazy" class="bp-cart-modal-thumb"/>' +
      '<div class="bp-cart-modal-line-txt">' +
      (addedLine.categoryLabel ? '<p class="bp-cart-modal-brand">' + escapeHtml(addedLine.categoryLabel) + "</p>" : "") +
      "<h3>" +
      escapeHtml(addedLine.title || "") +
      "</h3>" +
      (optStr ? '<p class="bp-cart-modal-opts">' + escapeHtml(optStr) + "</p>" : "") +
      '<p class="bp-cart-modal-price">' +
      formatClp(addedLine.price) +
      "</p>" +
      '<p class="bp-cart-modal-stock-note">Máximo ' +
      (Number(addedLine.maxQty) || 0) +
      " unidades</p>" +
      "</div></div>" +
      '<div class="bp-cart-modal-alert" role="status">' +
      '<span class="bp-cart-modal-alert-ico" aria-hidden="true">!</span>' +
      '<div class="bp-cart-modal-alert-body"><strong>Atención</strong> Los productos podrían agotarse próximamente. Cómpralos pronto.</div>' +
      "</div>" +
      (ups.length
        ? '<div class="bp-cart-modal-upsell"><h4>¿Y si le sumas lo último?</h4><div class="bp-modal-ups-grid">' +
          upsHtml +
          "</div></div>"
        : "") +
      '<div class="bp-cart-modal-actions">' +
      '<button type="button" class="bp-cart-modal-btn-secondary" data-bp-cart-close>Seguir comprando</button>' +
      '<a class="bp-cart-modal-btn-primary" href="carrito.html">Ir al carro</a>' +
      "</div></div></div></div>";

    var modal = null;
    try {
      var parsed = new DOMParser().parseFromString(html, "text/html");
      if (parsed.querySelector("parsererror")) {
        modal = null;
      } else {
        modal = parsed.getElementById("bpCartAddedModal");
        if (modal) modal = document.importNode(modal, true);
      }
    } catch (e) {
      modal = null;
    }
    if (!modal) {
      var wrap = document.createElement("div");
      wrap.innerHTML = html;
      modal = wrap.firstElementChild;
    }
    if (!modal || !modal.querySelector(".bp-cart-modal-card")) {
      console.error("BlackpinkCart: no se pudo construir el modal de carrito.");
      document.body.classList.remove("bp-modal-open");
      return;
    }
    document.body.appendChild(modal);
    document.body.classList.add("bp-modal-open");

    modal.querySelectorAll("[data-bp-cart-close]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener(
      "keydown",
      function esc(e) {
        if (e.key === "Escape") {
          closeModal();
          document.removeEventListener("keydown", esc);
        }
      },
      { once: true }
    );
  }

  window.BlackpinkCart = {
    STORAGE_KEY: STORAGE_KEY,
    SHIPPING_CLP: SHIPPING_CLP,
    load: load,
    save: save,
    addItem: addItem,
    removeLine: removeLine,
    setQty: setQty,
    setIncludeShipping: setIncludeShipping,
    getTotals: getTotals,
    countItems: countItems,
    refreshHeaderBadge: refreshHeaderBadge,
    openAddedModal: openAddedModal,
    lineKey: lineKey,
  };

  document.addEventListener("DOMContentLoaded", refreshHeaderBadge);
  window.addEventListener("storage", function (e) {
    if (e.key === STORAGE_KEY) refreshHeaderBadge();
  });
})();
