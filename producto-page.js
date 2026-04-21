(function () {
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  function formatClp(n) {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(n);
  }

  function starsHtml(rating) {
    let s = "";
    for (let i = 1; i <= 5; i++) {
      s += i <= rating
        ? '<span class="pd-star pd-star--filled">★</span>'
        : '<span class="pd-star">☆</span>';
    }
    return s;
  }

  function avgRating(reviews) {
    if (!reviews || !reviews.length) return 0;
    return reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  }

  function fallbackIphoneColors(title) {
    const t = String(title || "").toLowerCase();
    if (t.includes("iphone 15") && !t.includes("pro")) {
      return [
        { name: "Negro", hex: "#1f1f1f" },
        { name: "Celeste", hex: "#9ecae1" },
        { name: "Verde", hex: "#7aa37a" },
        { name: "Amarillo", hex: "#f4d35e" },
        { name: "Rosado", hex: "#f4b6c2" },
      ];
    }
    if (t.includes("pro")) {
      return [
        { name: "Titanio Negro", hex: "#3a3a3c" },
        { name: "Titanio Blanco", hex: "#d9d9d6" },
        { name: "Titanio Natural", hex: "#b9b3a9" },
        { name: "Titanio Azul", hex: "#6b7a8f" },
      ];
    }
    return [
      { name: "Negro", hex: "#1f1f1f" },
      { name: "Blanco", hex: "#f0f0f0" },
      { name: "Azul", hex: "#4f6d8a" },
      { name: "Rosa", hex: "#f4b6c2" },
      { name: "Verde", hex: "#7a8f72" },
    ];
  }

  function normalizeColorKey(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  /** Misma lista de colores que en la ficha (datos del producto o fallback iPhone). */
  function getDisplayColors(p) {
    if (Array.isArray(p.colors) && p.colors.length) return p.colors;
    if (p && p.category === "iphone") return fallbackIphoneColors(p.title);
    return [];
  }

  async function getProducts() {
    if (!window.BP_SUPABASE) return [];
    try {
      return await window.BP_SUPABASE.fetchPublicProducts();
    } catch (_) {
      return [];
    }
  }

  async function init() {
    const id = new URLSearchParams(window.location.search).get("id");
    const media = document.getElementById("detailMedia");
    const info = document.getElementById("detailInfo");
    const crumb = document.getElementById("detailCrumb");
    if (!media || !info) return;

    const data = await getProducts();
    window.__bpCatalogForCart = Array.isArray(data) ? data : [];
    const p = id ? data.find((x) => x.id === id) : null;

    if (!p) {
      if (crumb) crumb.textContent = "No encontrado";
      info.innerHTML =
        '<p class="product-detail-miss">No encontramos ese producto.</p><p><a class="btn btn-primary" href="productos.html">Ir al catálogo</a></p>';
      return;
    }

    document.title = `${p.title} · Blackpink Store`;
    if (crumb) crumb.textContent = p.title;

    const crumbCat = document.getElementById("detailCrumbCat");
    const crumbSubcat = document.getElementById("detailCrumbSubcat");
    const crumbSep3 = document.getElementById("detailCrumbSep3");
    if (crumbCat && crumbSubcat && crumbSep3) {
      crumbCat.textContent = p.categoryLabel;
      crumbCat.href = `productos.html?cat=${encodeURIComponent(p.category)}`;
      crumbSubcat.textContent = "Todos";
      crumbSubcat.href = `productos.html?cat=${encodeURIComponent(p.category)}`;
      crumbSep3.style.display = "";
    }

    const panelState = renderInfoPanel(p);
    renderGallery(p, panelState?.initialColor || "");
    renderTabs(p);
    renderReviews(p);
    renderRelated(p, data);
    initTabs();
    initCarousel();
  }

  function renderGallery(p, initialColor) {
    const thumbsContainer = document.getElementById("galleryThumbs");
    const mainContainer = document.getElementById("galleryMain");
    if (!thumbsContainer || !mainContainer) return;

    const baseImages = p.images && p.images.length ? p.images : [p.image];
    const displayColors = getDisplayColors(p);
    const rawColorImages =
      p.specs && p.specs._colorImages && typeof p.specs._colorImages === "object" ? p.specs._colorImages : {};
    const colorImageMap = {};
    Object.entries(rawColorImages).forEach(([color, list]) => {
      if (!Array.isArray(list) || !list.length) return;
      colorImageMap[normalizeColorKey(color)] = list.filter(Boolean);
    });

    const rawImageColors =
      p.specs && Array.isArray(p.specs._imageColors) ? p.specs._imageColors : [];

    function imageIndexForTagMatch(key) {
      const k = normalizeColorKey(key || "");
      if (!k) return -1;
      for (let i = 0; i < baseImages.length && i < rawImageColors.length; i++) {
        const tag = rawImageColors[i];
        if (!tag) continue;
        if (normalizeColorKey(String(tag)) === k) return i;
      }
      return -1;
    }

    /** Misma cantidad de fotos generales que de colores → foto[i] = equipo en color displayColors[i]. */
    const orderedColorMatch =
      displayColors.length > 0 &&
      baseImages.length === displayColors.length &&
      baseImages.every(Boolean);

    let currentImages = baseImages;

    function specImagesForKey(key) {
      const k = normalizeColorKey(key || "");
      if (k && Array.isArray(colorImageMap[k]) && colorImageMap[k].length) return colorImageMap[k];
      return null;
    }

    function colorIndexForKey(key) {
      if (!orderedColorMatch) return 0;
      const k = normalizeColorKey(key || "");
      if (!k) return 0;
      const i = displayColors.findIndex((c) => normalizeColorKey(c.name) === k);
      return i >= 0 ? i : 0;
    }

    function paintGallery(nextImages) {
      const safeImages = Array.isArray(nextImages) && nextImages.length ? nextImages : baseImages;
      currentImages = safeImages;
      thumbsContainer.innerHTML = safeImages
        .map(
          (img, i) =>
            `<button type="button" class="pd-thumb${i === 0 ? " active" : ""}" data-idx="${i}">
              <img src="${escapeHtml(img)}" alt="" width="70" height="70" loading="lazy" />
            </button>`
        )
        .join("");
      mainContainer.innerHTML = `<img id="galleryMainImg" src="${escapeHtml(safeImages[0])}" alt="${escapeHtml(
        p.title
      )}" width="560" height="560" loading="eager" />`;
    }

    function setMainAndActiveThumb(idx) {
      const mainImg = document.getElementById("galleryMainImg");
      const n = Math.max(0, Math.min(idx, currentImages.length - 1));
      if (mainImg && currentImages[n]) mainImg.src = currentImages[n];
      thumbsContainer.querySelectorAll(".pd-thumb").forEach((t, i) => {
        t.classList.toggle("active", i === n);
      });
    }

    function applyColorToGallery(colorKey) {
      const specList = specImagesForKey(colorKey);
      if (specList) {
        paintGallery(specList);
        return;
      }
      const tagIdx = imageIndexForTagMatch(colorKey);
      if (tagIdx >= 0) {
        if (currentImages !== baseImages) paintGallery(baseImages);
        setMainAndActiveThumb(tagIdx);
        return;
      }
      if (orderedColorMatch) {
        if (currentImages !== baseImages) paintGallery(baseImages);
        setMainAndActiveThumb(colorIndexForKey(colorKey));
        return;
      }
      paintGallery(baseImages);
    }

    const initialKey = normalizeColorKey(initialColor);
    if (specImagesForKey(initialKey)) {
      paintGallery(specImagesForKey(initialKey));
    } else {
      paintGallery(baseImages);
      const initTag = imageIndexForTagMatch(initialKey);
      if (initTag >= 0) setMainAndActiveThumb(initTag);
      else if (orderedColorMatch) setMainAndActiveThumb(colorIndexForKey(initialKey));
    }

    thumbsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".pd-thumb");
      if (!btn) return;
      const idx = parseInt(btn.dataset.idx, 10);
      const mainImg = document.getElementById("galleryMainImg");
      if (mainImg && currentImages[idx]) {
        mainImg.src = currentImages[idx];
        thumbsContainer.querySelectorAll(".pd-thumb").forEach((t) => t.classList.remove("active"));
        btn.classList.add("active");
      }
    });

    document.addEventListener("bp:product-color-change", (ev) => {
      const d = ev && ev.detail ? ev.detail : {};
      const key = d.colorKey || normalizeColorKey(d.color || "");
      applyColorToGallery(key);
    });
  }

  function renderInfoPanel(p) {
    const info = document.getElementById("detailInfo");
    if (!info) return;
    const displayColors = getDisplayColors(p);

    const cond =
      p.condition === "nuevo"
        ? "Nuevo / Sellado"
        : p.condition === "openbox"
          ? "Open box"
          : "Semi Nuevo";
    const reviews = p.reviews || [];
    const avg = avgRating(reviews);
    const ratingDisplay = avg > 0
      ? `<span class="pd-info-rating">${starsHtml(Math.round(avg))} <strong>${avg.toFixed(1)}</strong> <span class="pd-info-review-count">(${reviews.length} review${reviews.length !== 1 ? "s" : ""})</span></span>`
      : "";

    function normalizeGbValue(value) {
      const raw = String(value || "").trim().toLowerCase();
      const tb = raw.match(/(\d+(?:\.\d+)?)\s*tb\b/);
      if (tb) return Math.round(Number(tb[1]) * 1024);
      const match = raw.match(/\d+/);
      return match ? Number(match[0]) : NaN;
    }

    const variants =
      p.specs && Array.isArray(p.specs._variants)
        ? p.specs._variants
            .map((v) => ({
              gb: normalizeGbValue(v.gb),
              price: Number(v.price) || 0,
              oldPrice: Number(v.oldPrice) || 0,
              stock: Math.max(0, Number(v.stock) || 0),
            }))
            .filter((v) => Number.isFinite(v.gb))
        : [];

    const colorsHtml =
      displayColors.length
        ? `<div class="pd-selector-group">
            <p class="pd-selector-label">SELECCIONA TU COLOR</p>
            <div class="pd-color-options">
              ${displayColors
                .map(
                  (c, i) =>
                    `<button type="button" class="pd-color-btn${i === 0 ? " active" : ""}" style="background:${escapeHtml(
                      c.hex || "#ccc"
                    )}" data-bp-color-key="${escapeHtml(normalizeColorKey(c.name))}" title="${escapeHtml(
                      c.name
                    )}" aria-label="${escapeHtml(c.name)}"></button>`
                )
                .join("")}
            </div>
          </div>`
        : "";

    const capsHtml =
      p.capacities && p.capacities.length
        ? `<div class="pd-selector-group">
            <p class="pd-selector-label">SELECCIONA LA CAPACIDAD</p>
            <div class="pd-capacity-options">
              ${p.capacities
                .map((c, i) => {
                  const gb = normalizeGbValue(c);
                  return `<button type="button" class="pd-cap-btn${i === 0 ? " active" : ""}" data-gb="${Number.isFinite(gb) ? gb : ""}" data-cap-label="${escapeHtml(c)}">
                    <span class="pd-cap-label">${escapeHtml(c)}</span>
                  </button>`;
                })
                .join("")}
            </div>
          </div>`
        : "";

    const chargerHtml =
      p.chargerPrice
        ? `<div class="pd-charger-addon">
            <p class="pd-selector-label">AGREGAR CARGADOR ORIGINAL POR ${formatClp(p.chargerPrice)}</p>
            <div class="pd-charger-options">
              <button type="button" class="pd-charger-btn active">Sí</button>
              <button type="button" class="pd-charger-btn">No</button>
            </div>
          </div>`
        : "";

    const capacityValues = Array.isArray(p.capacities) ? p.capacities : [];
    const initialCapacity = capacityValues.length ? capacityValues[0] : "";
    const initialGb = normalizeGbValue(initialCapacity);
    const initialVariant =
      Number.isFinite(initialGb) && variants.length
        ? variants.find((v) => v.gb === initialGb) || null
        : null;
    const initialColor = displayColors.length ? displayColors[0].name : "";

    function priceBlock(price, oldPrice) {
      const hasDiscount = oldPrice && oldPrice > price;
      const disc = hasDiscount ? Math.round((1 - price / oldPrice) * 100) : null;
      return `
      <div class="pd-price-block">
        ${disc ? `<span class="pd-discount-badge">-${disc}%</span>` : ""}
        <span class="pd-main-price">${formatClp(price)}</span>
        ${hasDiscount ? `<span class="pd-old-price">${formatClp(oldPrice)}</span>` : ""}
      </div>`;
    }

    info.innerHTML = `
      <h1 class="pd-title">${escapeHtml(p.title)} <span class="pd-title-variant">${initialCapacity ? escapeHtml(initialCapacity) : ""} · ${displayColors.length ? escapeHtml(displayColors[0].name) : ""}</span></h1>
      <p class="pd-condition">${cond} ${ratingDisplay}</p>
      ${colorsHtml}
      ${capsHtml}
      ${chargerHtml}
      ${priceBlock(initialVariant ? initialVariant.price : Number(p.price) || 0, initialVariant ? initialVariant.oldPrice : Number(p.oldPrice) || 0)}
      <button type="button" class="pd-add-to-cart">Agregar al carro</button>
      <div class="pd-shipping-info">
        <div class="pd-shipping-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16,8 20,8 23,11 23,16 16,16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          <div>
            <strong>Envío a domicilio o retiro en tienda</strong>
            <p>Envío a domicilio: ${formatClp(15000)} a todo Chile. Entrega en 1 a 2 días hábiles.</p>
          </div>
        </div>
        <div class="pd-shipping-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <div>
            <strong>Compra presencial</strong>
            <p>Lunes a Viernes 10:00 hrs. a 19:00 hrs.<br>Sábado 11:00 a 15:00 hrs.</p>
          </div>
        </div>
      </div>
    `;

    info.querySelectorAll(".pd-color-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        info.querySelectorAll(".pd-color-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const titleVariant = info.querySelector(".pd-title-variant");
        if (titleVariant) {
          const activeCapBtn = info.querySelector(".pd-cap-btn.active");
          const capText = activeCapBtn
            ? activeCapBtn.getAttribute("data-cap-label") ||
              activeCapBtn.querySelector(".pd-cap-label")?.textContent?.trim() ||
              ""
            : "";
          const colorName = btn.getAttribute("title") || "";
          titleVariant.textContent = `${capText}${colorName ? ` · ${colorName}` : ""}`;
        }
        const selectedColorName = btn.getAttribute("title") || "";
        const colorKey = btn.getAttribute("data-bp-color-key") || normalizeColorKey(selectedColorName);
        document.dispatchEvent(
          new CustomEvent("bp:product-color-change", { detail: { color: selectedColorName, colorKey } })
        );
      });
    });

    info.querySelectorAll(".pd-cap-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        info.querySelectorAll(".pd-cap-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const selectedGb = Number(btn.dataset.gb);
        const capLabel = btn.getAttribute("data-cap-label") || "";
        const selectedVariant =
          Number.isFinite(selectedGb) && variants.length ? variants.find((v) => v.gb === selectedGb) || null : null;

        const titleVariant = info.querySelector(".pd-title-variant");
        if (titleVariant) {
          const activeColorBtn = info.querySelector(".pd-color-btn.active");
          const colorName = activeColorBtn ? activeColorBtn.getAttribute("title") || "" : "";
          titleVariant.textContent = `${capLabel}${colorName ? ` · ${colorName}` : ""}`;
        }

        const priceBlockEl = info.querySelector(".pd-price-block");
        if (priceBlockEl) {
          priceBlockEl.outerHTML = priceBlock(
            selectedVariant ? selectedVariant.price : Number(p.price) || 0,
            selectedVariant ? selectedVariant.oldPrice : Number(p.oldPrice) || 0
          );
        }

      });
    });

    info.querySelectorAll(".pd-charger-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        info.querySelectorAll(".pd-charger-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    const addBtn = info.querySelector(".pd-add-to-cart");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const Cart = window.BlackpinkCart;
        if (!Cart) {
          window.alert(
            "No se cargó el módulo del carrito (cart.js). Comprobá en el servidor que el archivo exista, la ruta sea correcta y que no esté bloqueado por la caché o el firewall."
          );
          return;
        }
        const capBtn = info.querySelector(".pd-cap-btn.active");
        const colorBtn = info.querySelector(".pd-color-btn.active");
        const selectedGb = capBtn ? Number(capBtn.dataset.gb) : NaN;
        const capLabel = (capBtn && capBtn.getAttribute("data-cap-label")) || "";
        const colorName = (colorBtn && colorBtn.getAttribute("title")) || "";
        const selectedVariant =
          Number.isFinite(selectedGb) && variants.length
            ? variants.find((v) => v.gb === selectedGb) || null
            : null;
        const price = selectedVariant ? selectedVariant.price : Number(p.price) || 0;
        const productStock = Math.max(0, Number(p.stock) || 0);
        const variantStock = selectedVariant ? Math.max(0, Number(selectedVariant.stock) || 0) : 0;
        // Límite máximo en carrito: el mayor entre stock de variante y del producto (evita quedar capado en 1 si _variants trae stock bajo y el producto tiene más).
        const maxQty = selectedVariant ? Math.max(productStock, variantStock) : productStock;
        if (maxQty < 1) {
          window.alert("Sin stock para esta variante.");
          return;
        }
        const productUuid =
          p.dbId && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(p.dbId))
            ? String(p.dbId)
            : /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(p.id))
              ? String(p.id)
              : null;
        if (!productUuid) {
          window.alert(
            "Este producto no está vinculado al inventario con UUID (Supabase). Usá el catálogo publicado desde el panel o contactanos por WhatsApp."
          );
          return;
        }
        const img = (Array.isArray(p.images) && p.images[0]) || p.image || "";
        const line = {
          productId: productUuid,
          title: p.title,
          image: img,
          price,
          quantity: 1,
          maxQty,
          categoryLabel: p.categoryLabel || "",
          options: {
            capacityLabel: capLabel,
            colorName,
            gb: Number.isFinite(selectedGb) ? selectedGb : null,
          },
        };
        try {
          Cart.addItem(line);
          Cart.openAddedModal(line, window.__bpCatalogForCart || []);
        } catch (err) {
          console.error(err);
          window.alert(
            "No se pudo guardar en el carrito. Si usás modo privado o bloqueaste almacenamiento local, probá en una ventana normal o permití cookies/datos del sitio."
          );
        }
      });
    }

    return { displayColors, initialColor };
  }

  function renderTabs(p) {
    const descPane = document.getElementById("paneDesc");
    const specsPane = document.getElementById("paneSpecs");

    if (descPane) {
      const longDesc = p.longDescription || p.description || "";
      descPane.innerHTML = longDesc
        .split("\n\n")
        .map((para) => `<p>${escapeHtml(para)}</p>`)
        .join("");
    }

    if (specsPane && p.specs) {
      const rows = Object.entries(p.specs)
        .filter(([k]) => !k.startsWith("_"))
        .map(
          ([k, v]) =>
            `<tr><td class="pd-spec-key">${escapeHtml(k)}</td><td class="pd-spec-val">${escapeHtml(
              typeof v === "object" ? JSON.stringify(v) : v
            )}</td></tr>`
        )
        .join("");
      specsPane.innerHTML = `<table class="pd-specs-table"><tbody>${rows}</tbody></table>`;
    }
  }

  function renderReviews(p) {
    const list = document.getElementById("reviewsList");
    const allBtn = document.getElementById("reviewsAllBtn");
    const reviews = p.reviews || [];

    if (!list) return;

    if (!reviews.length) {
      list.innerHTML = '<p class="pd-no-reviews">Aún no hay opiniones para este producto.</p>';
      if (allBtn) allBtn.style.display = "none";
      return;
    }

    list.innerHTML = reviews
      .slice(0, 3)
      .map(
        (r) => `
        <div class="pd-review-card">
          <div class="pd-review-avatar">${escapeHtml(r.author.charAt(0).toUpperCase())}</div>
          <div class="pd-review-body">
            <div class="pd-review-stars">${starsHtml(r.rating)}</div>
            <p class="pd-review-text">${escapeHtml(r.text)}</p>
            <p class="pd-review-meta">${escapeHtml(r.author)} · ${escapeHtml(r.date)}</p>
          </div>
        </div>`
      )
      .join("");

    if (allBtn) {
      allBtn.style.display = reviews.length > 3 ? "" : "none";
    }
  }

  function renderRelated(p, data) {
    const carousel = document.getElementById("relatedCarousel");
    if (!carousel) return;

    const related = data
      .filter((x) => x.id !== p.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);

    carousel.innerHTML = related
      .map((r) => {
        const disc =
          r.oldPrice && r.oldPrice > r.price
            ? Math.round((1 - r.price / r.oldPrice) * 100)
            : null;
        const old = r.oldPrice
          ? `<span class="pd-rel-old">${formatClp(r.oldPrice)}</span>`
          : "";
        const condLabel =
          r.condition === "nuevo" ? "Nuevo" : r.condition === "openbox" ? "Open box" : "Disponible";
        return `
          <a class="pd-related-card" href="producto.html?id=${encodeURIComponent(r.id)}">
            <div class="pd-rel-img-wrap">
              <img src="${escapeHtml(r.image)}" alt="${escapeHtml(r.title)}" width="200" height="200" loading="lazy" />
            </div>
            <p class="pd-rel-name">${escapeHtml(r.title)} <span class="pd-rel-cond">${condLabel}</span></p>
            <div class="pd-rel-price-row">
              ${disc ? `<span class="pd-rel-disc">-${disc}%</span>` : ""}
              <span class="pd-rel-price">${formatClp(r.price)}</span>
            </div>
            ${old}
          </a>`;
      })
      .join("");
  }

  function initTabs() {
    const tabBtns = document.querySelectorAll(".pd-tab");
    const panes = document.querySelectorAll(".pd-tab-pane");

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        tabBtns.forEach((b) => b.classList.remove("active"));
        panes.forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        const pane = document.querySelector(`.pd-tab-pane[data-pane="${target}"]`);
        if (pane) pane.classList.add("active");
      });
    });
  }

  function initCarousel() {
    const carousel = document.getElementById("relatedCarousel");
    const prevBtn = document.getElementById("relatedPrev");
    const nextBtn = document.getElementById("relatedNext");
    if (!carousel || !prevBtn || !nextBtn) return;

    const scrollAmount = 240;

    prevBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
    nextBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
