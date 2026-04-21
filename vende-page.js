(function () {

  function formatClp(n) {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(Math.round(n));
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  function getCapacities(model) {
    if (!model || !model.capacities || !model.capacities.length) return null;
    return model.capacities;
  }

  function prettyStorage(g) {
    if (g === 1000) return "1 TB";
    if (g >= 1024 && g % 1024 === 0) return g / 1024 + " TB";
    return g + " GB";
  }

  function normalizeTradeDataForStorefront(data, fallbackData) {
    if (!data || !data.models) return data;
    const next = {
      categories: Array.isArray(data.categories) ? [...data.categories] : [],
      models: { ...data.models },
    };

    const allowedIphones = [
      "iphone 11 pro max",
      "iphone 12 pro max",
      "iphone 13 pro max",
      "iphone 14 pro max",
      "iphone 15 pro max",
      "iphone 16 pro max",
      "iphone 17 pro max",
    ];
    const fallbackIphones = (fallbackData?.models?.iphone || []).filter((m) =>
      allowedIphones.includes(String(m.name || "").toLowerCase())
    );
    const remoteIphones = Array.isArray(next.models.iphone) ? next.models.iphone : [];
    const cleanedRemoteIphones = remoteIphones.filter((m) =>
      allowedIphones.includes(String(m.name || "").toLowerCase())
    );

    const mergedIphones = [...cleanedRemoteIphones];
    fallbackIphones.forEach((m) => {
      if (!mergedIphones.some((x) => String(x.name || "").toLowerCase() === String(m.name || "").toLowerCase())) {
        mergedIphones.push(m);
      }
    });
    if (mergedIphones.length) next.models.iphone = mergedIphones;

    const fallbackWatch = fallbackData?.models?.watch?.[0];
    if (fallbackWatch && Array.isArray(next.models.watch)) {
      next.models.watch = next.models.watch.map((m) => ({ ...m, img: m.img || fallbackWatch.img }));
    }

    return next;
  }

  async function init() {
    const root = document.getElementById("tradeRoot");
    if (!root) return;

    const fallbackTradeData = window.TRADE_IN_DATA || null;
    let tradeData = fallbackTradeData;
    let tradeSettings = null;
    if (window.BP_SUPABASE) {
      try {
        const remote = await window.BP_SUPABASE.fetchTradeInData();
        if (remote && remote.categories && remote.categories.length) {
          tradeData = {
            categories: remote.categories,
            models: remote.models || {},
          };
          tradeSettings = remote.settings;
        }
      } catch (_) {}
    }
    if (!tradeData) return;
    tradeData = normalizeTradeDataForStorefront(tradeData, fallbackTradeData);

    let step = 1;
    let catId = null;
    let model = null;
    let gb = null;

    const tabs = [
      document.getElementById("tradeTab1"),
      document.getElementById("tradeTab2"),
      document.getElementById("tradeTab3"),
    ];
    const panel1 = document.getElementById("tradePanel1");
    const panel2 = document.getElementById("tradePanel2");
    const panel3 = document.getElementById("tradePanel3");
    const backBtn = document.getElementById("tradeBack");
    const catGrid = document.getElementById("tradeCatGrid");
    const modelGrid = document.getElementById("tradeModelGrid");
    const capBox = document.getElementById("tradeCapacity");
    const capBlock = document.getElementById("tradeCapacityBlock");
    const resultBox = document.getElementById("tradeResult");

    function setStep(s) {
      step = s;
      tabs.forEach((tab, i) => {
        if (!tab) return;
        const n = i + 1;
        const active = n === s;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
      });
      if (panel1) panel1.hidden = step !== 1;
      if (panel2) panel2.hidden = step !== 2;
      if (panel3) panel3.hidden = step !== 3;
      if (backBtn) backBtn.hidden = step === 1;
    }

    function renderCats() {
      const { categories } = tradeData;
      catGrid.innerHTML = categories
        .map(
          (c) => `
        <button type="button" class="trade-cat-card" data-cat="${escapeHtml(c.id)}">
          <span class="trade-cat-thumb"><img src="${escapeHtml(c.img)}" alt="" width="56" height="56" loading="lazy" /></span>
          <span class="trade-cat-name">${escapeHtml(c.name)}</span>
        </button>`
        )
        .join("");
      catGrid.querySelectorAll(".trade-cat-card").forEach((btn) => {
        btn.addEventListener("click", () => {
          catId = btn.getAttribute("data-cat");
          model = null;
          gb = null;
          renderModels();
          setStep(2);
        });
      });
    }

    function renderModels() {
      model = null;
      gb = null;
      if (capBox) capBox.innerHTML = "";
      if (capBlock) capBlock.hidden = true;

      const list = tradeData.models[catId] || [];
      modelGrid.innerHTML = list
        .map(
          (m) => `
        <button type="button" class="trade-model-card" data-model="${escapeHtml(m.id)}">
          <span class="trade-model-thumb"><img src="${escapeHtml(m.img)}" alt="" loading="lazy" width="120" height="120" /></span>
          <span class="trade-model-text">
            <span class="trade-model-name">${escapeHtml(m.name)}</span>
            ${m.year ? `<span class="trade-model-year">${escapeHtml(m.year)}</span>` : ""}
          </span>
        </button>`
        )
        .join("");

      modelGrid.querySelectorAll(".trade-model-card").forEach((btn) => {
        btn.addEventListener("click", () => {
          const mid = btn.getAttribute("data-model");
          model = list.find((x) => x.id === mid);
          modelGrid.querySelectorAll(".trade-model-card").forEach((b) =>
            b.classList.toggle("is-selected", b === btn)
          );
          gb = null;
          renderCaps();
        });
      });
    }

    function renderCaps() {
      if (!model || !capBlock) return;
      const caps = getCapacities(model);
      capBlock.hidden = false;

      if (!caps) {
        capBox.innerHTML = "";
        const prompt = capBlock.querySelector(".trade-capacity-prompt");
        if (prompt) {
          prompt.innerHTML =
            "Este ítem no requiere elegir capacidad. <strong>¿Continuar?</strong>";
        }
        return;
      }

      const prompt = capBlock.querySelector(".trade-capacity-prompt");
      if (prompt) {
        prompt.innerHTML =
          "Seleccioná la capacidad de tu equipo, <strong>¿cuál deseás?</strong>";
      }

      const first = caps[0];
      gb = first;

      capBox.innerHTML = caps
        .map(
          (g) => `
        <button type="button" class="trade-capacity-btn ${g === gb ? "is-active" : ""}" data-gb="${g}">
          ${prettyStorage(g)}
        </button>`
        )
        .join("");

      capBox.querySelectorAll(".trade-capacity-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          gb = parseInt(btn.getAttribute("data-gb"), 10);
          capBox.querySelectorAll(".trade-capacity-btn").forEach((b) =>
            b.classList.toggle("is-active", b === btn)
          );
        });
      });
    }

    function estimatePrice() {
      if (!model) return 0;
      const caps = getCapacities(model);
      const base = Number(model.base) || 0;
      const incrementPerTier =
        tradeSettings && Number.isFinite(tradeSettings.incrementPerTier)
          ? tradeSettings.incrementPerTier
          : 12000;
      const fixedDeduction =
        tradeSettings && Number.isFinite(tradeSettings.fixedDeduction)
          ? tradeSettings.fixedDeduction
          : 8000;
      const minPercentFloor =
        tradeSettings && Number.isFinite(tradeSettings.minPercentFloor)
          ? tradeSettings.minPercentFloor
          : 0.35;
      let extra = 0;
      if (caps && caps.length && gb != null) {
        const idx = caps.indexOf(gb);
        if (idx >= 0) extra = idx * incrementPerTier;
      }
      const raw = base + extra - fixedDeduction;
      return Math.max(raw, Math.round(base * minPercentFloor));
    }

    function productLabel() {
      if (!model) return "";
      const caps = getCapacities(model);
      if (!caps || gb == null) return model.name;
      return `${model.name} de ${prettyStorage(gb)}`;
    }

    function capSubtitle() {
      if (!model) return "";
      const caps = getCapacities(model);
      if (caps && caps.length && gb != null) return `de ${prettyStorage(gb)}`;
      return "";
    }

    function showResult() {
      if (!model) return;
      const caps = getCapacities(model);
      if (caps && caps.length && gb == null) return;

      const price = estimatePrice();
      const label = productLabel();
      const sub = capSubtitle();

      resultBox.innerHTML = `
        <div class="trade-result-layout">
          <div class="trade-result-product">
            <img src="${escapeHtml(model.img)}" alt="" width="120" height="120" loading="lazy" />
            <div class="trade-result-info">
              <strong class="trade-result-title">${escapeHtml(model.name)}</strong>
              ${sub ? `<span class="trade-result-sub">${escapeHtml(sub)}</span>` : ""}
            </div>
          </div>
          <span class="trade-result-chevron" aria-hidden="true">›</span>
          <div class="trade-result-price-block">
            <p class="trade-est-price">${formatClp(price)}</p>
            <p class="trade-est-note">Precio máximo que pagaríamos por tu equipo si cumple con todas las condiciones requeridas.</p>
          </div>
        </div>
        <div class="trade-result-cta">
          <p class="trade-result-cta-title">¿Te interesa venderlo?</p>
          <p class="trade-result-cta-line"><a href="tel:+56943524545">+569 43524545</a> / <a href="mailto:blackpink.phones@gmail.com">blackpink.phones@gmail.com</a></p>
          <p class="trade-result-cta-line">Providencia 2286, oficina 504, piso 5</p>
          <a class="trade-result-wa" href="https://wa.me/56943524545?text=${encodeURIComponent(
            "Hola, me interesa vender: " + label
          )}" target="_blank" rel="noopener noreferrer">Escribinos por WhatsApp</a>
        </div>
      `;
    }

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        if (step === 3) setStep(2);
        else if (step === 2) setStep(1);
      });
    }

    const nextBtn = document.getElementById("tradeCapacityNext");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (!model) return;
        const caps = getCapacities(model);
        if (caps && caps.length && gb == null) return;
        showResult();
        setStep(3);
      });
    }

    renderCats();
    setStep(1);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
