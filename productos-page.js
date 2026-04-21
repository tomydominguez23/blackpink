(function () {
  async function getProducts() {
    if (!window.BP_SUPABASE) return [];
    try {
      return await window.BP_SUPABASE.fetchPublicProducts();
    } catch (_) {
      return [];
    }
  }

  function normalize(s) {
    return String(s)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function formatClp(n) {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(n);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  function sortProducts(list, sort) {
    const arr = [...list];
    if (sort === "price-asc") arr.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") arr.sort((a, b) => b.price - a.price);
    else if (sort === "name")
      arr.sort((a, b) => a.title.localeCompare(b.title, "es"));
    return arr;
  }

  function filterProducts(products, filters) {
    return products.filter((p) => {
      if (filters.q) {
        const t = normalize(p.title);
        if (!t.includes(filters.q)) return false;
      }
      if (filters.cats.length && !filters.cats.includes(p.category)) return false;
      if (filters.quickCond === "seminuevo") {
        if (p.condition !== "seminuevo") return false;
      } else if (filters.quickCond === "sellado") {
        if (p.condition !== "nuevo") return false;
      } else if (filters.quickCond === "openbox") {
        if (p.condition === "openbox") return true;
        const blob = normalize(
          `${p.title} ${p.description || ""} ${p.longDescription || ""}`
        );
        if (!blob.includes("open box") && !blob.includes("openbox") && !blob.includes("open-box"))
          return false;
      } else if (filters.conds.length) {
        const blob = normalize(`${p.title} ${p.description || ""} ${p.longDescription || ""}`);
        const openLegacy =
          blob.includes("open box") || blob.includes("openbox") || blob.includes("open-box");
        const matchesSidebar = filters.conds.some((c) => {
          if (c === "openbox") return p.condition === "openbox" || openLegacy;
          return p.condition === c;
        });
        if (!matchesSidebar) return false;
      }
      if (filters.priceMin != null && p.price < filters.priceMin) return false;
      if (filters.priceMax != null && p.price > filters.priceMax) return false;
      return true;
    });
  }

  function readFilters() {
    const cats = Array.from(
      document.querySelectorAll('input[name="cat"]:checked')
    ).map((i) => i.value);
    const conds = Array.from(
      document.querySelectorAll('input[name="cond"]:checked')
    ).map((i) => i.value);
    const minEl = document.getElementById("priceMin");
    const maxEl = document.getElementById("priceMax");
    const priceMin = minEl && minEl.value !== "" ? parseInt(minEl.value, 10) : null;
    const priceMax = maxEl && maxEl.value !== "" ? parseInt(maxEl.value, 10) : null;
    return {
      cats,
      conds,
      priceMin: Number.isFinite(priceMin) ? priceMin : null,
      priceMax: Number.isFinite(priceMax) ? priceMax : null,
    };
  }

  function renderCard(p) {
    const old = p.oldPrice
      ? `<span class="product-old">${formatClp(p.oldPrice)}</span>`
      : "";
    const monthly = formatClp(Math.round(p.price / 12));
    const conditionLabel =
      p.condition === "nuevo" ? "Nuevo" : p.condition === "openbox" ? "Open box" : "Seminuevo";
    const conditionClass =
      p.condition === "nuevo"
        ? "product-chip--new"
        : p.condition === "openbox"
          ? "product-chip--openbox"
          : "product-chip--used";
    const disc =
      p.oldPrice && p.oldPrice > p.price
        ? Math.round((1 - p.price / p.oldPrice) * 100)
        : null;
    const badge = disc
      ? `<span class="product-badge" aria-label="Descuento">-${disc}%</span>`
      : "";
    return `
      <article class="product-card product-card--listing">
        <div class="product-media-shell">
          <span class="product-chip ${conditionClass}">${conditionLabel}</span>
          <button type="button" class="product-fav" aria-label="Guardar ${escapeHtml(p.title)}" title="Guardar producto">♡</button>
          <a class="product-card-media" href="producto.html?id=${encodeURIComponent(p.id)}">
            <img src="${escapeHtml(p.image)}" alt="" loading="lazy" width="400" height="400" />
          </a>
        </div>
        <div class="product-card-body">
          <p class="product-cat-label">${escapeHtml(p.categoryLabel)}</p>
          <h3><a href="producto.html?id=${encodeURIComponent(p.id)}">${escapeHtml(p.title)}</a></h3>
          <p class="product-stars" aria-hidden="true">★★★★★</p>
          <div class="product-price-row">
            ${badge}
            <span class="product-price">${formatClp(p.price)}</span>
            ${old}
          </div>
          <p class="product-installments">Hasta 12 cuotas de ${monthly}</p>
          <p class="product-shipping-note">Envío a todo Chile: ${formatClp(15000)}</p>
          ${p.category === "iphone" && Array.isArray(p.colors) && p.colors.length
            ? `<div class="product-colors-inline" aria-label="Colores disponibles">
                ${p.colors
                  .slice(0, 8)
                  .map(
                    (c) =>
                      `<span class="pd-color-btn" style="background:${escapeHtml(c.hex || "#ccc")}" title="${escapeHtml(
                        c.name || "Color"
                      )}" aria-label="${escapeHtml(c.name || "Color")}"></span>`
                  )
                  .join("")}
              </div>`
            : ""}
          <div class="product-card-actions">
            <a class="btn btn-primary btn-sm product-card-btn" href="producto.html?id=${encodeURIComponent(p.id)}">Ver producto</a>
          </div>
        </div>
      </article>`;
  }

  function debounce(fn, ms) {
    let t;
    return function () {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, arguments), ms);
    };
  }

  function init() {
    const grid = document.getElementById("catalogGrid");
    const countEl = document.getElementById("catalogCount");
    const sortEl = document.getElementById("sortSelect");
    const searchInput = document.getElementById("catalogSearchInput");
    const searchForm = document.getElementById("catalogSearchForm");
    const estadoQuick = document.getElementById("catalogEstadoQuick");
    if (!grid) return;

    const urlParams = new URLSearchParams(window.location.search);
    const initialQ = (urlParams.get("q") || "").trim();
    if (searchInput && initialQ) searchInput.value = initialQ;

    const headerSearch = document.getElementById("headerSearch");
    if (headerSearch && initialQ) headerSearch.value = initialQ;

    const catParam = urlParams.get("cat");
    if (catParam && /^[a-z]+$/i.test(catParam)) {
      const cb = document.querySelector(
        `input[name="cat"][value="${catParam}"]`
      );
      if (cb) cb.checked = true;
    }

    const VALID_QUICK = ["seminuevo", "sellado", "openbox"];
    let quickCond = null;
    const estadoParam = (urlParams.get("estado") || "").toLowerCase();
    if (VALID_QUICK.includes(estadoParam)) quickCond = estadoParam;

    function updateEstadoQuickUi() {
      if (!estadoQuick) return;
      estadoQuick.querySelectorAll("[data-estado]").forEach((b) => {
        const on = b.getAttribute("data-estado") === quickCond;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }

    function setQuickCond(next) {
      quickCond = quickCond === next ? null : next;
      const u = new URL(window.location.href);
      if (quickCond) u.searchParams.set("estado", quickCond);
      else u.searchParams.delete("estado");
      history.replaceState({}, "", u);
      updateEstadoQuickUi();
      void apply();
    }

    if (estadoQuick) {
      estadoQuick.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-estado]");
        if (!btn) return;
        const v = btn.getAttribute("data-estado");
        if (!VALID_QUICK.includes(v)) return;
        setQuickCond(v);
      });
    }
    updateEstadoQuickUi();

    function currentQuery() {
      if (searchInput) return searchInput.value.trim();
      return (new URLSearchParams(window.location.search).get("q") || "").trim();
    }

    async function apply() {
      const f = readFilters();
      f.q = normalize(currentQuery());
      f.quickCond = quickCond;
      let list = filterProducts(await getProducts(), f);
      list = sortProducts(list, (sortEl && sortEl.value) || "relevance");
      if (countEl) {
        countEl.textContent = `${list.length} producto${list.length !== 1 ? "s" : ""}`;
      }
      grid.innerHTML =
        list.map(renderCard).join("") ||
        '<p class="catalog-empty">No hay resultados con estos filtros.</p>';
    }

    const runDebounced = debounce(apply, 200);

    document
      .querySelectorAll(".filters-sidebar input[type=checkbox]")
      .forEach((el) => el.addEventListener("change", () => void apply()));

    const priceMin = document.getElementById("priceMin");
    const priceMax = document.getElementById("priceMax");
    if (priceMin) priceMin.addEventListener("input", debounce(() => void apply(), 320));
    if (priceMax) priceMax.addEventListener("input", debounce(() => void apply(), 320));

    if (sortEl) sortEl.addEventListener("change", () => void apply());

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const u = new URL(window.location.href);
        if (searchInput.value.trim())
          u.searchParams.set("q", searchInput.value.trim());
        else u.searchParams.delete("q");
        history.replaceState({}, "", u);
        if (headerSearch) headerSearch.value = searchInput.value;
        runDebounced();
      });
    }

    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const u = new URL(window.location.href);
        if (searchInput && searchInput.value.trim())
          u.searchParams.set("q", searchInput.value.trim());
        else u.searchParams.delete("q");
        history.replaceState({}, "", u);
        if (headerSearch && searchInput) headerSearch.value = searchInput.value;
        void apply();
      });
    }

    const reset = document.getElementById("filterReset");
    if (reset) {
      reset.addEventListener("click", () => {
        document
          .querySelectorAll(".filters-sidebar input[type=checkbox]")
          .forEach((i) => {
            i.checked = false;
          });
        if (priceMin) priceMin.value = "";
        if (priceMax) priceMax.value = "";
        if (searchInput) searchInput.value = "";
        if (headerSearch) headerSearch.value = "";
        quickCond = null;
        updateEstadoQuickUi();
        history.replaceState({}, "", "productos.html");
        void apply();
      });
    }

    const filtersToggle = document.getElementById("filtersToggle");
    const filtersSidebar = document.getElementById("filtersSidebar");
    if (filtersToggle && filtersSidebar) {
      filtersToggle.addEventListener("click", () => {
        const open = filtersSidebar.classList.toggle("is-open");
        filtersToggle.setAttribute("aria-expanded", open);
      });
    }

    void apply();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
