(function () {
  const MEGA_MS = 240;
  let megaTimer = null;
  let megaTopRaf = null;

  function updateMegamenuTop() {
    const head = document.getElementById("siteHead");
    if (!head) return;
    const y = Math.round(head.getBoundingClientRect().bottom);
    document.documentElement.style.setProperty("--megamenu-top", `${y}px`);
  }

  function scheduleMegamenuTop() {
    if (!document.querySelector(".megamenu-panel:not([hidden])")) return;
    if (megaTopRaf) return;
    megaTopRaf = requestAnimationFrame(() => {
      megaTopRaf = null;
      updateMegamenuTop();
    });
  }

  function clearMegaTimer() {
    if (megaTimer) {
      clearTimeout(megaTimer);
      megaTimer = null;
    }
  }

  function closeAllMegas() {
    document.querySelectorAll(".megamenu-panel").forEach((p) => {
      p.hidden = true;
    });
    document.querySelectorAll(".has-megamenu .nav-cat").forEach((b) => {
      b.setAttribute("aria-expanded", "false");
    });
    document.querySelectorAll(".has-megamenu.is-open").forEach((li) => {
      li.classList.remove("is-open");
    });
  }

  function openMega(panel, btn) {
    closeAllMegas();
    panel.hidden = false;
    updateMegamenuTop();
    if (btn) {
      btn.setAttribute("aria-expanded", "true");
      const li = btn.closest(".has-megamenu");
      if (li) li.classList.add("is-open");
    }
  }

  function scheduleClose() {
    clearMegaTimer();
    megaTimer = setTimeout(closeAllMegas, MEGA_MS);
  }

  function initMegaMenus() {
    document.querySelectorAll(".has-megamenu").forEach((li) => {
      const btn = li.querySelector(".nav-cat");
      const panel = li.querySelector(".megamenu-panel");
      if (!btn || !panel) return;

      li.addEventListener("mouseenter", () => {
        clearMegaTimer();
        openMega(panel, btn);
      });
      li.addEventListener("mouseleave", scheduleClose);
      panel.addEventListener("mouseenter", clearMegaTimer);
      panel.addEventListener("mouseleave", scheduleClose);

      btn.addEventListener("focus", () => {
        clearMegaTimer();
        openMega(panel, btn);
      });

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const open = btn.getAttribute("aria-expanded") === "true";
        if (open) closeAllMegas();
        else openMega(panel, btn);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllMegas();
    });
  }

  function initNavToggle() {
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("siteNav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open);
    });
  }

  function initYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
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

  /** Banners activos en Supabase: se muestran tal cual (sin sustituir por Unsplash). */
  function pickSupabaseBanners(banners) {
    return (banners || []).filter((b) => b && String(b.image_url || "").trim().length > 0);
  }

  const SITE_ASSETS_CACHE_KEY = "blackpink_site_assets_v1";

  /** Mismo HTML por defecto que index.html (por si la API ya no trae banners). */
  const DEFAULT_HERO_CAROUSEL_HTML = `<div class="hero-banner-carousel">
            <a class="hero-banner-slide is-active" href="productos.html">
              <img src="https://images.unsplash.com/photo-1603898037225-1f25d24db31b?w=2400&h=950&fit=crop&q=85" alt="Banner iPhone premium" loading="eager" fetchpriority="high" />
            </a>
            <a class="hero-banner-slide" href="productos.html">
              <img src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=2400&h=950&fit=crop&q=85" alt="Banner smartphone moderno" loading="lazy" />
            </a>
            <a class="hero-banner-slide" href="productos.html">
              <img src="https://images.unsplash.com/photo-1541560052-5e137f229371?w=2400&h=950&fit=crop&q=85" alt="Banner celulares alta gama" loading="lazy" />
            </a>
            <button type="button" class="hero-banner-nav hero-banner-nav--prev" aria-label="Banner anterior">‹</button>
            <button type="button" class="hero-banner-nav hero-banner-nav--next" aria-label="Banner siguiente">›</button>
            <div class="hero-banner-dots">
              <button type="button" class="hero-banner-dot is-active" data-idx="0" aria-label="Banner 1"></button>
              <button type="button" class="hero-banner-dot" data-idx="1" aria-label="Banner 2"></button>
              <button type="button" class="hero-banner-dot" data-idx="2" aria-label="Banner 3"></button>
            </div>
          </div>`;

  function normalizeAssetUrl(u) {
    try {
      return new URL(String(u).trim(), window.location.href).href;
    } catch {
      return String(u || "").trim();
    }
  }

  function getCurrentBannerSignature() {
    const imgs = document.querySelectorAll(".showcase-grid--full .hero-banner-slide img");
    if (!imgs.length) return "";
    return Array.from(imgs)
      .map((el) => normalizeAssetUrl(el.currentSrc || el.src || el.getAttribute("src") || ""))
      .join("\0");
  }

  function bannerListSignature(banners) {
    return pickSupabaseBanners(banners)
      .map((b) => normalizeAssetUrl(b.image_url))
      .join("\0");
  }

  function preloadBannerImageUrls(urls) {
    const list = (urls || []).filter(Boolean);
    return Promise.all(
      list.map(
        (u) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = u;
            setTimeout(resolve, 15000);
          })
      )
    );
  }

  function readSiteAssetsCache() {
    try {
      const raw = localStorage.getItem(SITE_ASSETS_CACHE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || data.v !== 1) return null;
      return data;
    } catch {
      return null;
    }
  }

  function writeSiteAssetsCache(payload) {
    try {
      localStorage.setItem(SITE_ASSETS_CACHE_KEY, JSON.stringify({ v: 1, ...payload }));
    } catch (_) {}
  }

  /** Logo + iconos + carrusel desde caché (instantáneo al volver de otra pestaña o recargar). */
  function applySiteAssetsFromCache() {
    const data = readSiteAssetsCache();
    if (!data) return { hero: false };
    let hero = false;
    if (data.logoUrl) applyLogo(data.logoUrl);
    if (data.icons && typeof data.icons === "object") applyIcons(data.icons);
    const b = pickSupabaseBanners(data.banners || []);
    if (b.length && document.querySelector(".showcase-grid--full")) {
      initBannerCarousel(b);
      hero = true;
    }
    return { hero };
  }

  function restoreDefaultHeroCarousel() {
    const grid = document.querySelector(".showcase-grid--full");
    if (!grid) return;
    grid.removeAttribute("data-hero-source");
    grid.innerHTML = DEFAULT_HERO_CAROUSEL_HTML;
    wireHeroCarousel(grid.querySelector(".hero-banner-carousel"));
  }

  async function getProducts() {
    if (!window.BP_SUPABASE) return [];
    try {
      return await window.BP_SUPABASE.fetchPublicProducts();
    } catch (_) {
      return [];
    }
  }

  async function renderHomeProducts(grid) {
    const items = (await getProducts()).slice(0, 8);
    grid.innerHTML = items.map(homeCard).join("");
  }

  function applyLogo(logoUrl) {
    if (!logoUrl) return;
    const target = String(logoUrl).trim();
    const existing = document.querySelector(".site-logo-image");
    if (existing) {
      const cur = normalizeAssetUrl(existing.currentSrc || existing.src);
      if (cur === normalizeAssetUrl(target)) return;
    }
    document.querySelectorAll(".logo").forEach((logo) => {
      const text = logo.querySelector(".logo-text");
      logo.classList.add("has-custom-logo");
      if (text) {
        text.innerHTML = `<img src="${escapeHtml(
          target
        )}" alt="Logo" class="site-logo-image" width="200" height="66" decoding="async" fetchpriority="high" />`;
      }
    });
  }

  function applyIcons(iconMap) {
    const map = {
      header_cart: ".header-cart",
      header_whatsapp: ".header-wa",
      footer_whatsapp: ".footer-social-link[aria-label*='WhatsApp']",
      footer_instagram: ".footer-social-link[aria-label*='Instagram']",
    };
    Object.keys(map).forEach((key) => {
      const url = iconMap[key];
      if (!url) return;
      const el = document.querySelector(map[key]);
      if (!el) return;
      el.innerHTML = `<img src="${escapeHtml(url)}" alt="" style="width:22px;height:22px;object-fit:contain" />`;
    });

    const catKeyByName = {
      iphone: "cat_iphone",
      mac: "cat_mac",
      ipad: "cat_ipad",
      "apple watch": "cat_watch",
      videojuegos: "cat_videojuegos",
      airpods: "cat_airpods",
      accesorios: "cat_accesorios",
    };

    document.querySelectorAll(".cat-nav-item").forEach((item) => {
      const textNode = item.querySelector("span");
      const icon = item.querySelector(".cat-ico");
      if (!textNode || !icon) return;
      const label = String(textNode.textContent || "").trim().toLowerCase();
      const key = catKeyByName[label];
      const url = key ? iconMap[key] : null;
      if (!url) return;
      icon.outerHTML = `<img class="cat-ico" src="${escapeHtml(
        url
      )}" alt="" width="18" height="18" style="width:18px;height:18px;object-fit:contain" />`;
    });
  }

  let heroCarouselAutoplayId = null;

  function wireHeroCarousel(root) {
    if (!root) return;
    const slideEls = Array.from(root.querySelectorAll(".hero-banner-slide"));
    const dotEls = Array.from(root.querySelectorAll(".hero-banner-dot"));
    const prevBtn = root.querySelector(".hero-banner-nav--prev");
    const nextBtn = root.querySelector(".hero-banner-nav--next");
    if (!slideEls.length) return;
    if (heroCarouselAutoplayId != null) {
      clearInterval(heroCarouselAutoplayId);
      heroCarouselAutoplayId = null;
    }
    let index = Math.max(
      0,
      slideEls.findIndex((s) => s.classList.contains("is-active"))
    );
    function show(i) {
      index = (i + slideEls.length) % slideEls.length;
      slideEls.forEach((s, idx) => s.classList.toggle("is-active", idx === index));
      dotEls.forEach((d, idx) => d.classList.toggle("is-active", idx === index));
    }
    dotEls.forEach((d) =>
      d.addEventListener("click", () => {
        const i = Number(d.getAttribute("data-idx")) || 0;
        show(i);
      })
    );
    if (prevBtn) prevBtn.addEventListener("click", () => show(index - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => show(index + 1));
    if (slideEls.length > 1) {
      heroCarouselAutoplayId = setInterval(() => show(index + 1), 4500);
    }
  }

  function initBannerCarousel(banners) {
    const grid = document.querySelector(".showcase-grid--full");
    if (!grid || !banners.length) return;
    const slides = banners
      .map(
        (b, i) =>
          `<a class="hero-banner-slide${i === 0 ? " is-active" : ""}" href="productos.html"><img src="${escapeHtml(
            b.image_url
          )}" alt="${escapeHtml(b.title || "Banner")}" width="2400" height="950" loading="eager" decoding="async"${
            i === 0 ? ' fetchpriority="high"' : ""
          } /></a>`
      )
      .join("");
    const dots = banners
      .map(
        (_, i) =>
          `<button type="button" class="hero-banner-dot${i === 0 ? " is-active" : ""}" data-idx="${i}" aria-label="Banner ${
            i + 1
          }"></button>`
      )
      .join("");
    grid.setAttribute("data-hero-source", "supabase");
    grid.innerHTML = `<div class="hero-banner-carousel">${slides}<button type="button" class="hero-banner-nav hero-banner-nav--prev" aria-label="Banner anterior">‹</button><button type="button" class="hero-banner-nav hero-banner-nav--next" aria-label="Banner siguiente">›</button><div class="hero-banner-dots">${dots}</div></div>`;
    wireHeroCarousel(grid.querySelector(".hero-banner-carousel"));
  }

  function initFallbackBannerCarousel() {
    const carousel = document.querySelector(".hero-banner-carousel");
    if (!carousel) return;
    wireHeroCarousel(carousel);
  }

  /** @returns {Promise<boolean>} true si hay carrusel desde Supabase (o se restauró default al quitar banners). */
  async function initDynamicSiteAssets() {
    if (!window.BP_SUPABASE) return false;
    try {
      const assets = await window.BP_SUPABASE.fetchPublicSiteAssets();
      if (!assets.length) return false;
      const logos = assets.filter((a) => a.asset_type === "logo");
      const banners = assets.filter((a) => a.asset_type === "banner");
      const iconMap = {};
      assets
        .filter((a) => a.asset_type === "icon" && a.asset_key)
        .forEach((a) => {
          iconMap[a.asset_key] = a.image_url;
        });
      if (logos[0]) applyLogo(logos[0].image_url);
      applyIcons(iconMap);

      const supabaseBanners = pickSupabaseBanners(banners);
      const grid = document.querySelector(".showcase-grid--full");
      let hero = false;

      if (supabaseBanners.length) {
        const nextSig = bannerListSignature(supabaseBanners);
        const curSig = getCurrentBannerSignature();
        if (nextSig !== curSig) {
          await preloadBannerImageUrls(supabaseBanners.map((b) => b.image_url));
          initBannerCarousel(supabaseBanners);
        }
        hero = true;
      } else if (grid && grid.getAttribute("data-hero-source") === "supabase") {
        restoreDefaultHeroCarousel();
        hero = false;
      }

      writeSiteAssetsCache({
        logoUrl: logos[0]?.image_url || "",
        banners: supabaseBanners,
        icons: { ...iconMap },
      });

      return hero;
    } catch (_) {
      return false;
    }
  }

  function homeCard(p) {
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
      ? `<span class="product-badge">-${disc}%</span>`
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

  function initReviewsCarousel() {
    const track = document.getElementById("reviewsTrack");
    const prevBtn = document.getElementById("reviewsPrev");
    const nextBtn = document.getElementById("reviewsNext");
    if (!track || !prevBtn || !nextBtn) return;

    const cards = Array.from(track.querySelectorAll(".review-google-card"));
    if (!cards.length) return;

    let page = 0;

    function visibleCount() {
      return window.matchMedia("(max-width: 520px)").matches ? 1 : 2;
    }

    function pageCount() {
      return Math.ceil(cards.length / visibleCount());
    }

    function renderPage() {
      const perPage = visibleCount();
      const pages = pageCount();
      if (page >= pages) page = 0;
      const start = page * perPage;
      const end = start + perPage;
      cards.forEach((card, index) => {
        card.hidden = index < start || index >= end;
      });
    }

    prevBtn.addEventListener("click", () => {
      const pages = pageCount();
      page = (page - 1 + pages) % pages;
      renderPage();
    });

    nextBtn.addEventListener("click", () => {
      const pages = pageCount();
      page = (page + 1) % pages;
      renderPage();
    });

    window.addEventListener("resize", renderPage);
    renderPage();
  }

  document.addEventListener("DOMContentLoaded", async () => {
    updateMegamenuTop();
    window.addEventListener("resize", updateMegamenuTop);
    window.addEventListener("scroll", scheduleMegamenuTop, { passive: true });
    initMegaMenus();
    initNavToggle();
    initYear();
    const cachedHero = applySiteAssetsFromCache();
    const heroFromSupabase = await initDynamicSiteAssets();
    if (!heroFromSupabase && !cachedHero.hero) initFallbackBannerCarousel();
    initReviewsCarousel();
    const grid = document.getElementById("productGrid");
    if (grid) renderHomeProducts(grid);
  });
})();
