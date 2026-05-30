/**
 * Formulario de datos del cliente en el carrito (envío / retiro, RUT, etc.).
 * Expone window.BlackpinkCheckoutCustomer
 */
(function () {
  var STORAGE_KEY = "blackpink_checkout_customer_v1";

  var PICKUP = {
    name: "Blackpink Store — Providencia",
    address: "Providencia 2286, oficina 504, piso 5",
    city: "Santiago, Región Metropolitana",
    note: "Retiro gratis · listo en el día hábil",
  };

  var CHILE_REGIONS = [
    "Región Metropolitana",
    "Región de Arica y Parinacota",
    "Región de Tarapacá",
    "Región de Antofagasta",
    "Región de Atacama",
    "Región de Coquimbo",
    "Región de Valparaíso",
    "Región del Libertador Bernardo O'Higgins",
    "Región del Maule",
    "Región de Ñuble",
    "Región del Biobío",
    "Región de La Araucanía",
    "Región de Los Ríos",
    "Región de Los Lagos",
    "Región de Aysén",
    "Región de Magallanes",
  ];

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] || c;
    });
  }

  function normalizeRut(raw) {
    return String(raw || "")
      .replace(/\./g, "")
      .replace(/-/g, "")
      .replace(/\s/g, "")
      .toUpperCase();
  }

  function formatRut(raw) {
    var n = normalizeRut(raw);
    if (n.length < 2) return raw;
    var body = n.slice(0, -1);
    var dv = n.slice(-1);
    var rev = body.split("").reverse();
    var parts = [];
    for (var i = 0; i < rev.length; i++) {
      parts.push(rev[i]);
      if ((i + 1) % 3 === 0 && i + 1 < rev.length) parts.push(".");
    }
    return parts.reverse().join("") + "-" + dv;
  }

  function rutValid(raw) {
    var n = normalizeRut(raw);
    if (!/^\d{7,8}[0-9K]$/.test(n)) return false;
    var body = n.slice(0, -1);
    var dv = n.slice(-1);
    var sum = 0;
    var mul = 2;
    for (var i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body.charAt(i), 10) * mul;
      mul = mul === 7 ? 2 : mul + 1;
    }
    var mod = 11 - (sum % 11);
    var expected = mod === 11 ? "0" : mod === 10 ? "K" : String(mod);
    return dv === expected;
  }

  function defaultData() {
    return {
      delivery: "pickup",
      firstName: "",
      lastName: "",
      company: "",
      address: "",
      address2: "",
      rut: "",
      commune: "",
      region: "Región Metropolitana",
      phone: "",
      email: "",
      saveInfo: true,
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultData();
      var o = JSON.parse(raw);
      return Object.assign(defaultData(), o || {});
    } catch (_) {
      return defaultData();
    }
  }

  function save(data) {
    if (!data || !data.saveInfo) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (_) {}
      return;
    }
    try {
      var copy = Object.assign({}, data);
      delete copy.saveInfo;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
    } catch (_) {}
  }

  function readForm(root) {
    root = root || document;
    function val(id) {
      var el = document.getElementById(id);
      return el ? String(el.value || "").trim() : "";
    }
    function checked(id) {
      var el = document.getElementById(id);
      return el ? Boolean(el.checked) : false;
    }
    var scope = root.querySelector ? root : document;
    var activeTab = scope.querySelector(".bp-co-tab.bp-co-tab--active[data-delivery]");
    var delivery = activeTab ? activeTab.getAttribute("data-delivery") : "shipping";
    if (delivery !== "pickup") delivery = "shipping";
    return {
      delivery: delivery,
      firstName: val("bpCoFirstName"),
      lastName: val("bpCoLastName"),
      company: val("bpCoCompany"),
      address: val("bpCoAddress"),
      address2: val("bpCoAddress2"),
      rut: val("bpCoRut"),
      commune: val("bpCoCommune"),
      region: val("bpCoRegion"),
      phone: val("bpCoPhone"),
      email: val("bpCoEmail"),
      saveInfo: checked("bpCoSave"),
    };
  }

  function validate(data) {
    var errs = [];
    if (!data.firstName) errs.push("Ingresá tu nombre.");
    if (!data.lastName) errs.push("Ingresá tus apellidos.");
    if (!data.rut) errs.push("Ingresá tu RUT.");
    else if (!rutValid(data.rut)) errs.push("El RUT no es válido.");
    if (!data.phone || data.phone.replace(/\D/g, "").length < 8) errs.push("Ingresá un teléfono válido.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "")) errs.push("Ingresá un email válido.");
    if (data.delivery === "shipping") {
      if (!data.address) errs.push("Ingresá tu dirección de envío.");
      if (!data.commune) errs.push("Ingresá tu comuna.");
      if (!data.region) errs.push("Seleccioná tu región.");
    }
    return errs;
  }

  function regionOptions(selected) {
    return CHILE_REGIONS.map(function (r) {
      var sel = r === selected ? ' selected="selected"' : "";
      return '<option value="' + escapeHtml(r) + '"' + sel + ">" + escapeHtml(r) + "</option>";
    }).join("");
  }

  function renderFormHtml(data) {
    data = data || load();
    var isShip = data.delivery !== "pickup";
    var shipActive = isShip ? " bp-co-tab--active" : "";
    var pickActive = !isShip ? " bp-co-tab--active" : "";
    var shipPanel = isShip ? "" : ' hidden';
    var pickPanel = !isShip ? "" : ' hidden';

    return (
      '<section class="bp-co" aria-label="Datos de entrega y contacto">' +
      '<h2 class="bp-co-title">Entrega</h2>' +
      '<div class="bp-co-tabs" role="tablist">' +
      '<button type="button" class="bp-co-tab' +
      shipActive +
      '" role="tab" data-delivery="shipping" aria-selected="' +
      (isShip ? "true" : "false") +
      '"><span class="bp-co-tab-label">Envío</span><span class="bp-co-tab-price">+$15.000</span></button>' +
      '<button type="button" class="bp-co-tab' +
      pickActive +
      '" role="tab" data-delivery="pickup" aria-selected="' +
      (!isShip ? "true" : "false") +
      '"><span class="bp-co-tab-label">Retiro</span><span class="bp-co-tab-price bp-co-tab-price--free">Gratis</span></button>' +
      "</div>" +
      '<div class="bp-co-panel' +
      shipPanel +
      '" data-panel="shipping">' +
      '<p class="bp-co-hint">Envío a domicilio en todo Chile · se suman <strong>$15.000</strong> al total.</p>' +
      "</div>" +
      '<div class="bp-co-panel' +
      pickPanel +
      '" data-panel="pickup">' +
      '<div class="bp-co-pickup">' +
      "<strong>" +
      escapeHtml(PICKUP.name) +
      "</strong>" +
      "<p>" +
      escapeHtml(PICKUP.address) +
      "<br/>" +
      escapeHtml(PICKUP.city) +
      "</p>" +
      '<p class="bp-co-pickup-note">' +
      escapeHtml(PICKUP.note) +
      "</p></div></div>" +
      '<div class="bp-co-fields">' +
      '<p class="bp-co-section-label">Información de contacto</p>' +
      '<div class="bp-co-field bp-co-field--ship' +
      (isShip ? "" : " bp-co-field--hidden") +
      '"><label for="bpCoCountry">País / Región</label>' +
      '<select id="bpCoCountry" disabled><option selected>Chile</option></select></div>' +
      '<div class="bp-co-row bp-co-row--2">' +
      '<div class="bp-co-field"><label for="bpCoFirstName">Nombre</label>' +
      '<input type="text" id="bpCoFirstName" autocomplete="given-name" value="' +
      escapeHtml(data.firstName) +
      '" required/></div>' +
      '<div class="bp-co-field"><label for="bpCoLastName">Apellidos</label>' +
      '<input type="text" id="bpCoLastName" autocomplete="family-name" value="' +
      escapeHtml(data.lastName) +
      '" required/></div></div>' +
      '<div class="bp-co-field"><label for="bpCoCompany">Razón social <span class="bp-co-opt">(opcional)</span></label>' +
      '<input type="text" id="bpCoCompany" autocomplete="organization" value="' +
      escapeHtml(data.company) +
      '"/></div>' +
      '<div class="bp-co-field bp-co-field--ship' +
      (isShip ? "" : " bp-co-field--hidden") +
      '"><label for="bpCoAddress">Dirección</label>' +
      '<input type="text" id="bpCoAddress" autocomplete="street-address" value="' +
      escapeHtml(data.address) +
      '"/></div>' +
      '<div class="bp-co-field bp-co-field--ship' +
      (isShip ? "" : " bp-co-field--hidden") +
      '"><label for="bpCoAddress2">Casa, departamento, etc. <span class="bp-co-opt">(opcional)</span></label>' +
      '<input type="text" id="bpCoAddress2" autocomplete="address-line2" value="' +
      escapeHtml(data.address2) +
      '"/></div>' +
      '<div class="bp-co-field"><label for="bpCoRut">RUT</label>' +
      '<input type="text" id="bpCoRut" inputmode="text" autocomplete="off" placeholder="12.345.678-9" value="' +
      escapeHtml(data.rut) +
      '" required/></div>' +
      '<div class="bp-co-row bp-co-row--2 bp-co-row--ship' +
      (isShip ? "" : " bp-co-row--hidden") +
      '">' +
      '<div class="bp-co-field"><label for="bpCoCommune">Comuna</label>' +
      '<input type="text" id="bpCoCommune" value="' +
      escapeHtml(data.commune) +
      '"/></div>' +
      '<div class="bp-co-field"><label for="bpCoRegion">Región</label>' +
      '<select id="bpCoRegion">' +
      regionOptions(data.region) +
      "</select></div></div>" +
      '<div class="bp-co-field"><label for="bpCoPhone">Teléfono</label>' +
      '<input type="tel" id="bpCoPhone" autocomplete="tel" value="' +
      escapeHtml(data.phone) +
      '" required/></div>' +
      '<div class="bp-co-field"><label for="bpCoEmail">Email</label>' +
      '<input type="email" id="bpCoEmail" autocomplete="email" value="' +
      escapeHtml(data.email) +
      '" required/></div>' +
      '<label class="bp-co-save"><input type="checkbox" id="bpCoSave" ' +
      (data.saveInfo !== false ? "checked" : "") +
      "/> Guardar mi información para la próxima compra</label>" +
      "</div></section>"
    );
  }

  function wireDeliveryTabs(root, onChange) {
    if (!root) return;
    var tabs = root.querySelectorAll(".bp-co-tab[data-delivery]");
    var panels = root.querySelectorAll(".bp-co-panel[data-panel]");
    var shipFields = root.querySelectorAll(".bp-co-field--ship, .bp-co-row--ship");

    function setMode(mode) {
      var isShip = mode === "shipping";
      tabs.forEach(function (tab) {
        var active = tab.getAttribute("data-delivery") === mode;
        tab.classList.toggle("bp-co-tab--active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
      });
      panels.forEach(function (p) {
        var show = p.getAttribute("data-panel") === mode;
        if (show) p.removeAttribute("hidden");
        else p.setAttribute("hidden", "hidden");
      });
      shipFields.forEach(function (el) {
        el.classList.toggle("bp-co-field--hidden", !isShip);
        el.classList.toggle("bp-co-row--hidden", !isShip);
      });
      if (window.BlackpinkCart && typeof window.BlackpinkCart.setIncludeShipping === "function") {
        window.BlackpinkCart.setIncludeShipping(isShip);
      }
      if (typeof onChange === "function") onChange(mode);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        setMode(tab.getAttribute("data-delivery") || "shipping");
      });
    });

    var initialTab = root.querySelector(".bp-co-tab.bp-co-tab--active[data-delivery]");
    setMode(initialTab ? initialTab.getAttribute("data-delivery") || "pickup" : "pickup");

    var rutEl = root.getElementById("bpCoRut");
    if (rutEl) {
      rutEl.addEventListener("blur", function () {
        if (normalizeRut(rutEl.value).length >= 2) rutEl.value = formatRut(rutEl.value);
      });
    }
  }

  window.BlackpinkCheckoutCustomer = {
    PICKUP: PICKUP,
    load: load,
    save: save,
    readForm: readForm,
    validate: validate,
    rutValid: rutValid,
    formatRut: formatRut,
    renderFormHtml: renderFormHtml,
    wireDeliveryTabs: wireDeliveryTabs,
  };
})();
