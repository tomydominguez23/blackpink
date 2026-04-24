(function () {
  document.body.classList.add("admin-auth-loading");
  const STORAGE_KEY = "black_pinckl_tradein_settings_v1";
  const SESSION_KEY = "black_pinckl_admin_session_v1";
  const ADMIN_PRODUCTS_KEY = "black_pinckl_products_v1";
  const ADMIN_PANEL_SETTINGS_KEY = "black_pinckl_admin_panel_v1";
  const ALERT_STATE_KEY = "black_pinckl_alert_state_v1";
  const DEFAULT_INCREMENT = 12000;
  const DEFAULT_DEDUCTION = 8000;
  const DEFAULT_FLOOR = 0.35;

  function formatClp(n) {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(Math.round(n));
  }

  function todayLabel() {
    const d = new Date();
    return `Hoy ${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  }

  function showToast(msg, isError) {
    const toast = document.getElementById("adminToast");
    if (!toast) return;
    toast.textContent = msg;
    toast.style.background = isError ? "#b42318" : "#1a7f37";
    toast.classList.add("is-visible");
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  function readTradeInSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      return parsed;
    } catch (_) {
      return null;
    }
  }

  function writeTradeInSettings(payload) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      return parsed;
    } catch (_) {
      return null;
    }
  }

  function setSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function formatRole(role) {
    const m = {
      admin: "Administrador",
      seller: "Vendedor",
      catalog: "Catálogo",
      sales: "Ventas",
    };
    return m[role] || role || "—";
  }

  function sectionVisibleForRole(sectionId, role) {
    if (!sectionId) return true;
    if (role === "catalog" && sectionId === "ventas") return false;
    if (role === "sales" && ["tradein", "imagenes", "configuracion"].includes(sectionId)) return false;
    return true;
  }

  function applyRolePermissions(role) {
    const isAdmin = role === "admin";
    const readOnlyInv = role === "seller" || role === "sales";
    document.body.classList.toggle("admin-role-seller", readOnlyInv);
    document.body.classList.toggle("admin-role-catalog-only", role === "catalog");
    const roleBanner = document.getElementById("adminRoleBanner");
    if (roleBanner) roleBanner.hidden = isAdmin;
    document.querySelectorAll(".admin-nav-link").forEach((btn) => {
      const sec = btn.getAttribute("data-admin-section");
      const hide = !sectionVisibleForRole(sec, role);
      btn.hidden = hide;
      btn.style.display = hide ? "none" : "";
    });
    document
      .querySelectorAll("[data-role-required='admin']")
      .forEach((el) => {
        if (isAdmin) {
          el.removeAttribute("aria-hidden");
          if (el.classList.contains("admin-nav-link")) {
            el.disabled = false;
          } else {
            el.removeAttribute("disabled");
          }
        } else {
          el.setAttribute("aria-hidden", "true");
          if (el.classList.contains("admin-nav-link")) {
            el.disabled = true;
          } else if (el.matches("button, input, select, textarea")) {
            el.setAttribute("disabled", "true");
          }
        }
      });
    const activeBtn = document.querySelector(".admin-nav-link.is-active");
    const activeSec = activeBtn && activeBtn.getAttribute("data-admin-section");
    if (activeSec && !sectionVisibleForRole(activeSec, role)) {
      setActiveSection("dashboard");
    } else if (!isAdmin && !activeSec) {
      setActiveSection("dashboard");
    }
    const invAdd = document.getElementById("inventoryAddBtn");
    if (invAdd) {
      invAdd.disabled = readOnlyInv;
      if (readOnlyInv) invAdd.setAttribute("disabled", "true");
      else invAdd.removeAttribute("disabled");
    }
  }

  function updateSessionUI(session) {
    window.__adminUserRole = session && session.role ? session.role : "";
    const userName = document.getElementById("adminUserName");
    const roleBadge = document.getElementById("adminUserRole");
    if (userName) userName.textContent = session ? session.name : "Invitado";
    if (roleBadge) roleBadge.textContent = session ? formatRole(session.role) : "-";
    if (session) applyRolePermissions(session.role);
  }

  function applyAdminBrandLogo(logoUrl) {
    const target = String(logoUrl || "").trim();
    if (!target) return false;
    const sidebarLogo = document.getElementById("adminSidebarLogo");
    const topbarLogo = document.getElementById("adminTopbarLogo");
    const sidebarFallback = document.getElementById("adminSidebarLogoFallback");
    const topbarFallback = document.getElementById("adminTopbarLogoFallback");
    if (sidebarLogo) {
      sidebarLogo.src = target;
      sidebarLogo.hidden = false;
    }
    if (topbarLogo) {
      topbarLogo.src = target;
      topbarLogo.hidden = false;
    }
    if (sidebarFallback) sidebarFallback.hidden = true;
    if (topbarFallback) topbarFallback.hidden = true;
    return true;
  }

  async function initAdminBrandLogo() {
    try {
      const cached = localStorage.getItem("blackpink_site_assets_v1");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (applyAdminBrandLogo(parsed && parsed.logoUrl)) return;
      }
    } catch (_) {}

    if (!window.BP_SUPABASE || typeof window.BP_SUPABASE.fetchPublicSiteAssets !== "function") return;
    try {
      const assets = await window.BP_SUPABASE.fetchPublicSiteAssets();
      const logoAsset = (assets || []).find((item) => item && item.asset_type === "logo" && item.is_active);
      applyAdminBrandLogo(logoAsset && logoAsset.image_url);
    } catch (_) {}
  }

  async function callNotifyAdminAlert(kind, data) {
    const supa = window.BP_SUPABASE;
    if (!supa?.SUPABASE_URL || !supa?.SUPABASE_ANON_KEY) {
      const err = new Error("no_supabase_config");
      err.code = "no_config";
      throw err;
    }
    await supa.client.auth.refreshSession().catch(() => {});
    const {
      data: { session },
    } = await supa.client.auth.getSession();
    if (!session?.access_token) {
      const err = new Error("no_session");
      err.code = "no_session";
      throw err;
    }
    const res = await fetch(`${supa.SUPABASE_URL}/functions/v1/notify-admin-alert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
        apikey: supa.SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ kind, data: data || {} }),
    });
    const text = await res.text();
    let j = {};
    try {
      j = text ? JSON.parse(text) : {};
    } catch (_) {
      j = {};
    }
    if (!res.ok) {
      const err = new Error(j.error || text.slice(0, 200) || `HTTP ${res.status}`);
      err.code = j.error;
      throw err;
    }
    return j;
  }

  async function initAuth() {
    const logoutBtn = document.getElementById("adminLogoutBtn");
    let current = getSession();
    if (window.BP_SUPABASE) {
      try {
        const session = await window.BP_SUPABASE.getCurrentSession();
        if (!session) current = null;
        if (session) {
          const profile = await window.BP_SUPABASE.getMyProfile();
          if (profile && profile.role) {
            current = {
              username: session.user.email || "user",
              name: profile.full_name || session.user.email || "Usuario",
              role: profile.role,
            };
            setSession(current);
          } else {
            current = null;
          }
        }
      } catch (_) {
        current = getSession();
      }
    }
    if (!current) {
      window.location.href = "admin-login.html";
      return;
    }

    updateSessionUI(current);
    document.body.classList.remove("admin-auth-loading");

    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        if (window.BP_SUPABASE) {
          try {
            await window.BP_SUPABASE.signOutAdmin();
          } catch (_) {}
        }
        clearSession();
        window.location.href = "admin-login.html";
      });
    }
  }

  function setActiveSection(sectionId) {
    document.querySelectorAll(".admin-nav-link").forEach((btn) => {
      btn.classList.toggle(
        "is-active",
        btn.getAttribute("data-admin-section") === sectionId
      );
    });

    document.querySelectorAll(".admin-section").forEach((section) => {
      const active = section.id === `admin-${sectionId}`;
      section.classList.toggle("is-active", active);
    });
  }

  function initSectionNavigation() {
    const links = document.querySelectorAll(".admin-nav-link");
    links.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.hidden) return;
        const id = btn.getAttribute("data-admin-section");
        if (!id) return;
        setActiveSection(id);
      });
    });
  }

  function initDocTabs() {
    const tabs = document.querySelectorAll("[data-doc-tab]");
    const panes = document.querySelectorAll(".admin-doc-tab");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.getAttribute("data-doc-tab");
        tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
        panes.forEach((pane) => {
          pane.classList.toggle("is-active", pane.id === `doc-${key}`);
        });
      });
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  function categoryLabel(category) {
    const labels = {
      iphone: "iPhone",
      mac: "Mac",
      ipad: "iPad",
      watch: "Apple Watch",
      airpods: "AirPods",
      otros: "Otros",
    };
    return labels[category] || "Otros";
  }

  function normalizeImei(raw) {
    return String(raw || "").replace(/\D/g, "");
  }

  function readAdminProducts() {
    try {
      const raw = localStorage.getItem(ADMIN_PRODUCTS_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (_) {
      return null;
    }
  }

  function writeAdminProducts(products) {
    localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products));
  }

  function seedAdminProductsIfNeeded() {
    const existing = readAdminProducts();
    if (existing && existing.length) return existing;

    const seeded = (window.PRODUCTS_DATA || []).map((p, index) => {
      const imei = String(100000000000000 + index).slice(0, 15);
      return {
        id: p.id,
        imei,
        title: p.title,
        category: p.category,
        categoryLabel: p.categoryLabel || categoryLabel(p.category),
        condition: p.condition || "seminuevo",
        price: Number(p.price) || 0,
        oldPrice: Number(p.oldPrice) || null,
        stock: 1,
        image: p.image || "",
        images: Array.isArray(p.images) && p.images.length ? p.images : [p.image].filter(Boolean),
        description: p.description || "Producto cargado desde catálogo base.",
        longDescription: p.longDescription || p.description || "",
        specs: p.specs || {},
        reviews: Array.isArray(p.reviews) ? p.reviews : [],
        colors: Array.isArray(p.colors) ? p.colors : [],
        capacities: Array.isArray(p.capacities) ? p.capacities : [],
        chargerPrice: Number.isFinite(p.chargerPrice) ? p.chargerPrice : null,
        published: true,
        updatedAt: Date.now() - index * 1000,
      };
    });
    writeAdminProducts(seeded);
    return seeded;
  }

  function formatDateTime(ts) {
    const d = new Date(ts || Date.now());
    return d.toLocaleString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
      reader.readAsDataURL(file);
    });
  }

  function readPanelSettings() {
    try {
      const raw = localStorage.getItem(ADMIN_PANEL_SETTINGS_KEY);
      const d = raw ? JSON.parse(raw) : {};
      const t = Number(d.lowStockThreshold);
      return {
        lowStockThreshold: Number.isFinite(t) ? Math.max(0, Math.min(9999, Math.round(t))) : 3,
        alertEmailEnabled: Boolean(d.alertEmailEnabled),
        alertOnLowStock: d.alertOnLowStock !== false,
        alertOnNewPaid: Boolean(d.alertOnNewPaid),
      };
    } catch (_) {
      return {
        lowStockThreshold: 3,
        alertEmailEnabled: false,
        alertOnLowStock: true,
        alertOnNewPaid: false,
      };
    }
  }

  function writePanelSettings(payload) {
    localStorage.setItem(ADMIN_PANEL_SETTINGS_KEY, JSON.stringify(payload));
  }

  function csvEscape(cell) {
    const s = cell == null ? "" : String(cell);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }

  function downloadCsv(filename, rows) {
    const BOM = "\uFEFF";
    const text = BOM + rows.map((r) => r.map(csvEscape).join(",")).join("\r\n");
    const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function orderStatusLabel(status) {
    const m = {
      pending: "Pendiente",
      paid: "Pagado",
      shipped: "Enviado",
      failed: "Fallido",
      cancelled: "Cancelado",
    };
    return m[status] || status;
  }

  function shortOrderId(id) {
    if (!id || String(id).length < 8) return id || "—";
    return String(id).slice(0, 8);
  }

  function initAdminPanelFeatures() {
    let lastProductSnapshot = [];
    let ordersFullCache = [];

    function syncSettingsInputs() {
      const s = readPanelSettings();
      const th = document.getElementById("adminLowStockThreshold");
      if (th) th.value = String(s.lowStockThreshold);
      const ae = document.getElementById("adminAlertEmailEnabled");
      const al = document.getElementById("adminAlertLowStock");
      const ap = document.getElementById("adminAlertNewPaid");
      if (ae) ae.checked = s.alertEmailEnabled;
      if (al) al.checked = s.alertOnLowStock;
      if (ap) ap.checked = s.alertOnNewPaid;
    }

    async function maybeSendProactiveAlerts(settings, th, lowCount, zeroPublished) {
      if (window.__adminUserRole !== "admin" || !settings.alertEmailEnabled) return;
      if (!window.BP_SUPABASE) return;
      try {
        const dayKey = new Date().toISOString().slice(0, 10);
        let st = { lowStockDay: "", paidInitialized: false, seenPaidIds: [] };
        try {
          const raw = localStorage.getItem(ALERT_STATE_KEY);
          if (raw) Object.assign(st, JSON.parse(raw));
        } catch (_) {}
        if (settings.alertOnLowStock && (lowCount > 0 || zeroPublished > 0)) {
          if (st.lowStockDay !== dayKey) {
            await callNotifyAdminAlert("low_stock", {
              lowCount,
              zeroPublished,
              threshold: th,
            });
            st.lowStockDay = dayKey;
            localStorage.setItem(ALERT_STATE_KEY, JSON.stringify(st));
          }
        }
        if (settings.alertOnNewPaid && ordersFullCache && ordersFullCache.length) {
          const paid = ordersFullCache.filter((o) => o.status === "paid" || o.status === "shipped");
          if (!st.paidInitialized) {
            st.seenPaidIds = paid.map((o) => o.id);
            st.paidInitialized = true;
            localStorage.setItem(ALERT_STATE_KEY, JSON.stringify(st));
          } else {
            const seen = new Set(st.seenPaidIds || []);
            const fresh = paid.filter((o) => !seen.has(o.id));
            if (fresh.length) {
              await callNotifyAdminAlert("orders_paid", {
                orders: fresh.map((o) => ({
                  id: o.id,
                  total_amount: o.total_amount,
                  customer_email: o.customer_email,
                })),
              });
              st.seenPaidIds = [...seen, ...fresh.map((o) => o.id)].slice(-300);
              localStorage.setItem(ALERT_STATE_KEY, JSON.stringify(st));
            }
          }
        }
      } catch (_) {}
    }

    function applyKpiCounts(orders) {
      const list = orders || [];
      const set = (id, n) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(n);
      };
      set("kpiOrdersPending", list.filter((o) => o.status === "pending").length);
      set("kpiOrdersPaid", list.filter((o) => o.status === "paid").length);
      set("kpiOrdersShipped", list.filter((o) => o.status === "shipped").length);
      set(
        "kpiOrdersOther",
        list.filter((o) => o.status === "failed" || o.status === "cancelled").length
      );
    }

    async function syncOrdersFromServer() {
      if (!window.BP_SUPABASE || !window.BP_SUPABASE.fetchAdminOrders) return;
      try {
        ordersFullCache = await window.BP_SUPABASE.fetchAdminOrders({});
        applyKpiCounts(ordersFullCache);
      } catch (_) {
        applyKpiCounts([]);
      }
    }

    async function refreshDashboard() {
      const settings = readPanelSettings();
      const th = settings.lowStockThreshold;
      if (window.BP_SUPABASE?.fetchAdminOrders) {
        try {
          await syncOrdersFromServer();
        } catch (_) {}
      }
      let productsForDash = lastProductSnapshot;
      if (!productsForDash.length && window.BP_SUPABASE) {
        try {
          const { data, error } = await window.BP_SUPABASE.client
            .from("products")
            .select("*")
            .order("updated_at", { ascending: false })
            .limit(250);
          if (!error && data) productsForDash = data.map(window.BP_SUPABASE.mapProductRow);
        } catch (_) {}
      }

      const kpiInv = document.getElementById("kpiInventory");
      if (kpiInv) {
        const total = (productsForDash || []).reduce(
          (sum, p) => sum + (Number(p.price) || 0) * (Number(p.stock) || 0),
          0
        );
        kpiInv.textContent = formatClp(total);
      }

      let lowCount = 0;
      let zeroPublished = 0;
      (productsForDash || []).forEach((p) => {
        if (!p.published) return;
        const st = Number(p.stock) || 0;
        if (st === 0) zeroPublished += 1;
        else if (st <= th) lowCount += 1;
      });
      const kpiLow = document.getElementById("kpiLowStock");
      if (kpiLow) kpiLow.textContent = String(lowCount + zeroPublished);

      const banner = document.getElementById("adminStockAlertBanner");
      if (banner) {
        if (zeroPublished > 0) {
          banner.hidden = false;
          banner.className = "admin-stock-alert-banner admin-stock-alert-banner--danger";
          banner.innerHTML = `<strong>Sin stock publicado</strong> — ${zeroPublished} producto(s) publicado(s) con stock 0. Ocultá o reponé antes de vender.`;
        } else if (lowCount > 0) {
          banner.hidden = false;
          banner.className = "admin-stock-alert-banner admin-stock-alert-banner--warn";
          banner.innerHTML = `<strong>Stock bajo</strong> — ${lowCount} producto(s) con stock ≤ ${th} unidades (umbral en Configuración).`;
        } else {
          banner.hidden = true;
          banner.innerHTML = "";
        }
      }

      const alertsUl = document.getElementById("adminSmartAlerts");
      if (alertsUl) {
        const items = [];
        if (zeroPublished) {
          items.push({
            strong: `${zeroPublished} sin stock (publicados)`,
            span: "Reponé o despublicá para evitar ventas sin unidades.",
          });
        }
        if (lowCount) {
          items.push({
            strong: `${lowCount} con stock bajo`,
            span: `Umbral actual: ${th} unidades.`,
          });
        }
        const unp = (productsForDash || []).filter((p) => !p.published && (Number(p.stock) || 0) > 0).length;
        if (unp) {
          items.push({
            strong: `${unp} con stock sin publicar`,
            span: "Publicá en inventario para que aparezcan en la tienda.",
          });
        }
        if (!items.length) {
          alertsUl.innerHTML =
            '<li><span class="admin-muted">No hay alertas críticas. Todo en orden.</span></li>';
        } else {
          alertsUl.innerHTML = items
            .slice(0, 6)
            .map(
              (x) =>
                `<li><strong>${escapeHtml(x.strong)}</strong><span>${escapeHtml(x.span)}</span></li>`
            )
            .join("");
        }
      }

      const activity = document.getElementById("adminActivityFeed");
      if (activity && window.BP_SUPABASE) {
        try {
          const orderActs = (ordersFullCache || []).slice(0, 8).map((o) => ({
            t: new Date(o.created_at).getTime(),
            html: `<strong>Pedido ${escapeHtml(shortOrderId(o.id))}</strong><span>${escapeHtml(
              orderStatusLabel(o.status)
            )} · ${escapeHtml(o.customer_email || "sin email")} · ${formatClp(Number(o.total_amount) || 0)}</span>`,
          }));
          const prodActs = (productsForDash || []).slice(0, 8).map((p) => ({
            t: Number(p.updatedAt) || 0,
            html: `<strong>${escapeHtml(p.title || "Producto")}</strong><span>Inventario · stock ${
              Number(p.stock) || 0
            }</span>`,
          }));
          const merged = [...orderActs, ...prodActs].sort((a, b) => b.t - a.t).slice(0, 10);
          if (!merged.length) {
            activity.innerHTML = '<li><span class="admin-muted">Sin actividad reciente.</span></li>';
          } else {
            activity.innerHTML = merged.map((x) => `<li>${x.html}</li>`).join("");
          }
        } catch (_) {
          activity.innerHTML = '<li><span class="admin-muted">No se pudo cargar actividad.</span></li>';
        }
      }

      await maybeSendProactiveAlerts(settings, th, lowCount, zeroPublished);
    }

    async function loadOrdersTable() {
      const tbody = document.getElementById("ordersTableBody");
      const errEl = document.getElementById("ordersLoadError");
      const searchEl = document.getElementById("ordersSearch");
      const statusEl = document.getElementById("ordersStatusFilter");
      const fromEl = document.getElementById("ordersDateFrom");
      const toEl = document.getElementById("ordersDateTo");
      if (!tbody) return;
      if (!window.BP_SUPABASE || !window.BP_SUPABASE.fetchAdminOrders) {
        tbody.innerHTML =
          '<tr><td colspan="6" class="admin-empty-cell">Supabase no disponible.</td></tr>';
        return;
      }
      if (errEl) {
        errEl.hidden = true;
        errEl.textContent = "";
      }
      tbody.innerHTML = '<tr><td colspan="6" class="admin-empty-cell">Cargando…</td></tr>';
      try {
        const rows = await window.BP_SUPABASE.fetchAdminOrders({
          status: statusEl ? statusEl.value : "all",
          q: searchEl ? searchEl.value : "",
          dateFrom: fromEl && fromEl.value ? fromEl.value : undefined,
          dateTo: toEl && toEl.value ? toEl.value : undefined,
        });
        if (!rows.length) {
          tbody.innerHTML =
            '<tr><td colspan="6" class="admin-empty-cell">No hay pedidos con esos filtros.</td></tr>';
          return;
        }
        const canOrders = ["admin", "seller", "sales"].includes(window.__adminUserRole);
        tbody.innerHTML = rows
          .map((o) => {
            const pillClass =
              o.status === "paid" || o.status === "shipped" ? "pill--ok" : "pill--warn";
            const actions = [];
            if (canOrders && o.status === "paid") {
              actions.push(
                `<button type="button" class="btn btn-outline btn-sm" data-order-action="ship" data-order-id="${escapeHtml(
                  o.id
                )}">Marcar enviado</button>`
              );
            }
            if (canOrders && o.status === "pending") {
              actions.push(
                `<button type="button" class="btn btn-outline btn-sm" data-order-action="cancel" data-order-id="${escapeHtml(
                  o.id
                )}">Cancelar</button>`
              );
            }
            actions.push(
              `<button type="button" class="btn btn-outline btn-sm" data-order-action="detail" data-order-id="${escapeHtml(
                o.id
              )}">Detalle</button>`
            );
            return `<tr>
            <td>${escapeHtml(formatDateTime(o.created_at))}</td>
            <td><code style="font-size:0.78rem">${escapeHtml(shortOrderId(o.id))}</code></td>
            <td>${escapeHtml(o.customer_email || "—")}</td>
            <td>${formatClp(Number(o.total_amount) || 0)}</td>
            <td><span class="pill ${pillClass}">${escapeHtml(orderStatusLabel(o.status))}</span></td>
            <td><div class="admin-row-actions">${actions.join(" ")}</div></td>
          </tr>`;
          })
          .join("");
      } catch (_) {
        if (errEl) {
          errEl.hidden = false;
          errEl.textContent =
            "No se pudieron cargar pedidos. Ejecutá en Supabase supabase-migration-admin-orders-rls-shipped.sql.";
        }
        tbody.innerHTML =
          '<tr><td colspan="6" class="admin-empty-cell">Error al cargar pedidos.</td></tr>';
      }
    }

    async function openOrderDetail(orderId) {
      const modal = document.getElementById("adminOrderDetailModal");
      const title = document.getElementById("adminOrderDetailTitle");
      const body = document.getElementById("adminOrderDetailBody");
      if (!modal || !body || !window.BP_SUPABASE) return;
      let order = ordersFullCache.find((o) => o.id === orderId);
      if (!order) {
        const { data } = await window.BP_SUPABASE.client
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .maybeSingle();
        order = data;
      }
      if (title) title.textContent = `Pedido ${shortOrderId(orderId)}`;
      body.innerHTML = "<p>Cargando líneas…</p>";
      modal.hidden = false;
      try {
        const items = await window.BP_SUPABASE.fetchOrderItemsWithProducts(orderId);
        const meta = order
          ? `<p><strong>Estado:</strong> ${escapeHtml(orderStatusLabel(order.status))} · <strong>Cliente:</strong> ${escapeHtml(
              order.customer_email || "—"
            )} · <strong>Total:</strong> ${formatClp(Number(order.total_amount) || 0)}</p>`
          : "";
        const rows = items
          .map((it) => {
            const prod = it.products;
            const ptitle =
              prod && typeof prod === "object" && !Array.isArray(prod)
                ? prod.title || prod.external_id
                : "";
            return `<tr>
            <td>${escapeHtml(ptitle || "Producto")}</td>
            <td>${Number(it.quantity) || 0}</td>
            <td>${formatClp(Number(it.unit_price) || 0)}</td>
          </tr>`;
          })
          .join("");
        body.innerHTML = `${meta}<table><thead><tr><th>Producto</th><th>Cant.</th><th>P. unit.</th></tr></thead><tbody>${
          rows || "<tr><td colspan='3'>Sin líneas.</td></tr>"
        }</tbody></table>`;
      } catch (_) {
        body.innerHTML = "<p>No se pudieron cargar las líneas del pedido.</p>";
      }
    }

    function openModalById(id) {
      const el = document.getElementById(id);
      if (el) el.hidden = false;
    }

    function closeModalById(id) {
      const el = document.getElementById(id);
      if (el) el.hidden = true;
    }

    syncSettingsInputs();

    window.__adminNotifyInventoryLoaded = function (products) {
      lastProductSnapshot = Array.isArray(products) ? products : [];
      refreshDashboard();
    };

    document.getElementById("adminSavePanelSettingsBtn")?.addEventListener("click", () => {
      const inp = document.getElementById("adminLowStockThreshold");
      const v = inp ? Number(inp.value) : 3;
      writePanelSettings({
        lowStockThreshold: Number.isFinite(v) ? v : 3,
        alertEmailEnabled: document.getElementById("adminAlertEmailEnabled")?.checked ?? false,
        alertOnLowStock: document.getElementById("adminAlertLowStock")?.checked ?? true,
        alertOnNewPaid: document.getElementById("adminAlertNewPaid")?.checked ?? false,
      });
      showToast("Preferencias guardadas en este navegador.");
      refreshDashboard();
    });

    document.getElementById("adminNotifyTestBtn")?.addEventListener("click", async () => {
      try {
        await callNotifyAdminAlert("test", {});
        showToast("Correo de prueba enviado (si Resend está configurado).");
      } catch (e) {
        showToast(e && e.message ? String(e.message) : "No se pudo enviar (revisá secrets y despliegue).", true);
      }
    });

    document.getElementById("adminAlertsGoInventory")?.addEventListener("click", () => {
      setActiveSection("inventario");
      document.getElementById("inventorySearch")?.focus();
    });

    document.getElementById("adminExportBtn")?.addEventListener("click", () => openModalById("adminExportModal"));

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-close-modal]");
      if (!btn) return;
      closeModalById(btn.getAttribute("data-close-modal"));
    });

    document.getElementById("exportInventoryCsvBtn")?.addEventListener("click", async () => {
      if (!window.BP_SUPABASE) {
        showToast("Supabase no disponible.", true);
        return;
      }
      try {
        const { data, error } = await window.BP_SUPABASE.client.from("products").select("*").limit(500);
        if (error) throw error;
        const rows = [
          [
            "id",
            "external_id",
            "title",
            "category",
            "condition",
            "price",
            "stock",
            "published",
            "imei",
            "updated_at",
            "stock_source_product_id",
          ],
        ];
        (data || []).forEach((r) => {
          rows.push([
            r.id,
            r.external_id,
            r.title,
            r.category,
            r.condition,
            r.price,
            r.stock,
            r.published,
            r.imei || "",
            r.updated_at,
            r.stock_source_product_id || "",
          ]);
        });
        downloadCsv(`inventario-${new Date().toISOString().slice(0, 10)}.csv`, rows);
        showToast("CSV de inventario descargado.");
        closeModalById("adminExportModal");
      } catch (_) {
        showToast("No se pudo exportar inventario.", true);
      }
    });

    document.getElementById("exportOrdersCsvBtn")?.addEventListener("click", async () => {
      if (!window.BP_SUPABASE || !window.BP_SUPABASE.fetchAdminOrders) {
        showToast("Supabase no disponible.", true);
        return;
      }
      try {
        const orders = await window.BP_SUPABASE.fetchAdminOrders({});
        const rows = [
          ["id", "status", "customer_email", "total_amount", "created_at", "paid_at", "shipped_at"],
        ];
        (orders || []).forEach((o) => {
          rows.push([
            o.id,
            o.status,
            o.customer_email || "",
            o.total_amount,
            o.created_at,
            o.paid_at || "",
            o.shipped_at || "",
          ]);
        });
        downloadCsv(`pedidos-${new Date().toISOString().slice(0, 10)}.csv`, rows);
        showToast("CSV de pedidos descargado.");
        closeModalById("adminExportModal");
      } catch (_) {
        showToast("No se pudo exportar pedidos (revisa permisos SQL).", true);
      }
    });

    document.getElementById("ordersRefreshBtn")?.addEventListener("click", async () => {
      await loadOrdersTable();
      await syncOrdersFromServer();
      await refreshDashboard();
    });

    ["ordersSearch", "ordersStatusFilter", "ordersDateFrom", "ordersDateTo"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", () => loadOrdersTable());
      el.addEventListener("change", () => loadOrdersTable());
    });

    document.getElementById("ordersTableBody")?.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-order-action]");
      if (!btn) return;
      const id = btn.getAttribute("data-order-id");
      const action = btn.getAttribute("data-order-action");
      if (!id || !window.BP_SUPABASE) return;
      if (action === "detail") {
        openOrderDetail(id);
        return;
      }
      if (action === "ship") {
        const { error } = await window.BP_SUPABASE.updateOrderStatus(id, "shipped");
        if (error) {
          showToast("No se pudo actualizar (¿permiso admin?).", true);
          return;
        }
        showToast("Pedido marcado como enviado.");
        await syncOrdersFromServer();
        await loadOrdersTable();
        await refreshDashboard();
        return;
      }
      if (action === "cancel") {
        if (!window.confirm("¿Cancelar este pedido pendiente?")) return;
        const { error } = await window.BP_SUPABASE.client
          .from("orders")
          .update({ status: "cancelled" })
          .eq("id", id);
        if (error) {
          showToast("No se pudo cancelar.", true);
          return;
        }
        showToast("Pedido cancelado.");
        await syncOrdersFromServer();
        await loadOrdersTable();
        await refreshDashboard();
      }
    });

    const ADMIN_SECTION_KEYWORDS = [
      { section: "dashboard", keys: ["panel", "control", "inicio", "dashboard", "resumen", "kpi", "alerta"] },
      {
        section: "inventario",
        keys: ["inventario", "stock", "producto", "productos", "iphone", "imei", "mac", "ipad"],
      },
      { section: "documentos", keys: ["documento", "documentos", "contrato", "pdf"] },
      { section: "leads", keys: ["lead", "leads", "oportunidad"] },
      { section: "clientes", keys: ["cliente", "clientes"] },
      { section: "ventas", keys: ["venta", "ventas", "pedido", "pedidos", "orden", "order"] },
      { section: "tradein", keys: ["trade", "tradein", "tasación", "equipo", "recepción"] },
      { section: "imagenes", keys: ["imagen", "imágenes", "banner", "logo", "web"] },
      { section: "asistente", keys: ["asistente", "ia", "assist", "bp assist", "pregunta", "chat"] },
      { section: "configuracion", keys: ["config", "configuración", "ajuste", "umbral"] },
    ];

    document.getElementById("adminNewSaleBtn")?.addEventListener("click", () => {
      setActiveSection("ventas");
      showToast("Pedidos: al integrar la pasarela, los pagos confirmados aparecerán aquí.");
    });

    const searchForm = document.getElementById("adminGlobalSearchForm");
    const searchInput = document.getElementById("adminSearch");
    if (searchForm && searchInput) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const q = searchInput.value.trim().toLowerCase();
        if (!q) return;
        const navLinks = Array.from(document.querySelectorAll(".admin-nav-link"));
        let hit = navLinks.find((btn) => btn.textContent.toLowerCase().includes(q));
        if (!hit) {
          const block = ADMIN_SECTION_KEYWORDS.find((b) =>
            b.keys.some((k) => q.includes(k) || (k.length > 2 && k.includes(q)))
          );
          if (block) hit = navLinks.find((btn) => btn.getAttribute("data-admin-section") === block.section);
        }
        if (hit) {
          const target = hit.getAttribute("data-admin-section");
          setActiveSection(target);
          if (target === "inventario") {
            const invSearch = document.getElementById("inventorySearch");
            if (invSearch) {
              invSearch.value = searchInput.value.trim();
              invSearch.dispatchEvent(new Event("input", { bubbles: true }));
            }
          }
          showToast(`Navegando a: ${hit.textContent.trim()}`);
          return;
        }
        if (lastProductSnapshot.length) {
          const match = lastProductSnapshot.find(
            (p) =>
              String(p.title || "")
                .toLowerCase()
                .includes(q) ||
              (p.imei && String(p.imei).includes(q))
          );
          if (match) {
            setActiveSection("inventario");
            const invSearch = document.getElementById("inventorySearch");
            if (invSearch) {
              invSearch.value = match.title || searchInput.value.trim();
              invSearch.dispatchEvent(new Event("input", { bubbles: true }));
            }
            showToast(`Producto encontrado: ${match.title}`);
            return;
          }
        }
        showToast("No se encontró coincidencia. Probá con el módulo o el nombre del producto.", true);
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        ["adminExportModal", "adminHelpModal", "adminOrderDetailModal"].forEach((id) => closeModalById(id));
      }
      const tag = (e.target && e.target.tagName) || "";
      const inField = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (e.key === "?" && !inField) {
        e.preventDefault();
        openModalById("adminHelpModal");
      }
      if (e.key === "/" && !inField) {
        e.preventDefault();
        searchInput?.focus();
      }
    });

    loadOrdersTable();
    refreshDashboard();
  }

  function initInventoryModule() {
    const tableBody = document.getElementById("inventoryTableBody");
    const search = document.getElementById("inventorySearch");
    const categoryFilter = document.getElementById("inventoryCategoryFilter");
    const statusFilter = document.getElementById("inventoryStatusFilter");
    const addBtn = document.getElementById("inventoryAddBtn");
    const modal = document.getElementById("inventoryModal");
    const form = document.getElementById("inventoryAddForm");
    const cancelBtn = document.getElementById("inventoryCancelBtn");
    const modalTitle = document.getElementById("inventoryModalTitle");
    const previewModal = document.getElementById("inventoryPreviewModal");
    const previewCloseBtn = document.getElementById("inventoryPreviewCloseBtn");
    const previewPaneResumen = document.getElementById("inventoryPreviewPaneResumen");
    const previewPaneTimeline = document.getElementById("inventoryPreviewPaneTimeline");
    const previewTabs = Array.from(document.querySelectorAll(".inv-preview-tab"));
    if (!tableBody || !search || !addBtn || !form || !cancelBtn || !categoryFilter || !statusFilter || !modal) return;

    const fields = {
      editId: document.getElementById("invEditId"),
      name: document.getElementById("invName"),
      imei: document.getElementById("invImei"),
      category: document.getElementById("invCategory"),
      condition: document.getElementById("invCondition"),
      stock: document.getElementById("invStock"),
      description: document.getElementById("invDescription"),
      longDescription: document.getElementById("invLongDescription"),
      published: document.getElementById("invPublished"),
      colors: document.getElementById("invColors"),
      stockSource: document.getElementById("invStockSource"),
    };
    const imageFiles = document.getElementById("invImageFiles");
    const imagesList = document.getElementById("invImagesList");
    const colorImageTarget = document.getElementById("invColorImageTarget");
    const colorImagesList = document.getElementById("invColorImagesList");
    const previewCard = document.getElementById("invPreviewCard");
    const variantList = document.getElementById("invVariantList");
    const addVariantBtn = document.getElementById("invAddVariantBtn");
    if (
      Object.entries(fields).some(([key, el]) => key !== "stockSource" && !el) ||
      !imageFiles ||
      !imagesList ||
      !colorImageTarget ||
      !colorImagesList ||
      !previewCard ||
      !variantList ||
      !addVariantBtn
    ) return;

    function invConditionLabel(c) {
      if (c === "nuevo") return "Nuevo / sellado";
      if (c === "openbox") return "Open box";
      return "Seminuevo";
    }

    let products = [];
    let supportsStockSourceProductColumn = true;
    let images = [];
    let colorImages = {};
    let variants = [];
    let activePreviewId = "";
    /** Un color por cada índice de `images` (nombre normalizado); vacío = sin asignar. */
    let imageColorTags = [];

    const invIphoneColorAside = document.getElementById("invIphoneColorAside");
    const invIphoneColorPaletteEl = document.getElementById("invIphoneColorPalette");
    const invColorsHelpMac = document.getElementById("invColorsHelpMac");
    const invColorsHelpIphone = document.getElementById("invColorsHelpIphone");

    const INVENTORY_GB_PRESETS = [
      { gb: 64, label: "64 GB" },
      { gb: 128, label: "128 GB" },
      { gb: 256, label: "256 GB" },
      { gb: 512, label: "512 GB" },
      { gb: 1024, label: "1 TB" },
    ];

    function formatCapacityLabelForStore(gb) {
      const n = Number(gb);
      if (!Number.isFinite(n) || n <= 0) return "";
      if (n >= 1024 && n % 1024 === 0) {
        const t = n / 1024;
        return t === 1 ? "1 TB" : `${t} TB`.replace(/\.0$/, "");
      }
      return `${n} GB`;
    }

    function inventoryGbSelectOptionsHtml(currentGb) {
      const cur = Number(currentGb);
      const known = INVENTORY_GB_PRESETS.some((o) => o.gb === cur);
      const extra =
        Number.isFinite(cur) && cur > 0 && !known
          ? `<option value="${cur}" selected>${cur} GB (legacy)</option>`
          : "";
      const opts = INVENTORY_GB_PRESETS.map(
        (o) => `<option value="${o.gb}"${cur === o.gb ? " selected" : ""}>${o.label}</option>`
      ).join("");
      return extra + opts;
    }

    function nextInventoryGbPreset() {
      const used = new Set(variants.map((v) => Number(v.gb)).filter(Number.isFinite));
      for (const o of INVENTORY_GB_PRESETS) {
        if (!used.has(o.gb)) return o.gb;
      }
      return 128;
    }

    /** Paleta amplia de acabados iPhone (nombre + muestra). */
    const IPHONE_PALETTE = [
      { name: "Negro", hex: "#1c1c1e" },
      { name: "Medianoche", hex: "#191921" },
      { name: "Blanco", hex: "#fafafa" },
      { name: "Blanco estelar", hex: "#f2f2f7" },
      { name: "Rojo", hex: "#c0392b" },
      { name: "Azul", hex: "#3d5a80" },
      { name: "Ultramarino", hex: "#2f3e5c" },
      { name: "Sierra Azul", hex: "#9eb5cb" },
      { name: "Azul alpino", hex: "#5b7c99" },
      { name: "Celeste", hex: "#9ecae1" },
      { name: "Verde", hex: "#5a7d5e" },
      { name: "Verde alpino", hex: "#4a5d4a" },
      { name: "Amarillo", hex: "#f4d35e" },
      { name: "Rosado", hex: "#f4b6c2" },
      { name: "Rosa", hex: "#e8b4bc" },
      { name: "Morado", hex: "#6e5a8a" },
      { name: "Púrpura", hex: "#7b5fa8" },
      { name: "Coral", hex: "#ff6f55" },
      { name: "Gris Espacial", hex: "#4a4a4a" },
      { name: "Plata", hex: "#c0c0c0" },
      { name: "Grafito", hex: "#3c3c3e" },
      { name: "Oro", hex: "#e6c992" },
      { name: "Dorado", hex: "#d4a853" },
      { name: "Titanio Negro", hex: "#3a3a3c" },
      { name: "Titanio Blanco", hex: "#e8e8e6" },
      { name: "Titanio Natural", hex: "#b9b3a9" },
      { name: "Titanio Azul", hex: "#6b7a8f" },
      { name: "Titanio del desierto", hex: "#c4a57a" },
    ];

    function normalizeColorName(value) {
      const raw = String(value || "").trim().replace(/\s+/g, " ");
      if (!raw) return "";
      return raw
        .split(" ")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(" ");
    }

    function normalizeColorKey(value) {
      return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
    }

    function parseColorNames(input) {
      const list = String(input || "")
        .split(",")
        .map((part) => normalizeColorName(part))
        .filter(Boolean);
      return Array.from(new Set(list));
    }

    function colorHexFromName(name) {
      const n = String(name || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const map = {
        negro: "#1f1f1f",
        blanca: "#f1f1f1",
        blanco: "#f1f1f1",
        plata: "#c0c0c0",
        gris: "#7b7b7b",
        grafito: "#4a4a4a",
        "gris espacial": "#4a4a4a",
        celeste: "#9ecae1",
        azul: "#4f6d8a",
        ultramarino: "#2f3e5c",
        "sierra azul": "#9eb5cb",
        "azul alpino": "#5b7c99",
        verde: "#7aa37a",
        "verde alpino": "#4a5d4a",
        amarillo: "#f4d35e",
        medianoche: "#191921",
        "blanco estelar": "#f2f2f7",
        oro: "#e6c992",
        coral: "#ff6f55",
        dorado: "#d4a853",
        rosa: "#f4b6c2",
        rosado: "#f4b6c2",
        rojo: "#c0392b",
        purpura: "#8b6bbd",
        morado: "#8b6bbd",
        "titanio negro": "#3a3a3c",
        "titanio blanco": "#e8e8e6",
        "titanio natural": "#b9b3a9",
        "titanio azul": "#6b7a8f",
        "titanio del desierto": "#c4a57a",
      };
      return map[n] || "#bdbdbd";
    }

    function ensureImageColorTagsLength() {
      while (imageColorTags.length < images.length) imageColorTags.push("");
      if (imageColorTags.length > images.length) imageColorTags.length = images.length;
    }

    function renderIphonePalette() {
      if (!invIphoneColorPaletteEl) return;
      const selected = parseColorNames(fields.colors.value);
      const selectedKeys = new Set(selected.map((s) => normalizeColorKey(s)));
      invIphoneColorPaletteEl.innerHTML = IPHONE_PALETTE.map(({ name, hex }) => {
        const on = selectedKeys.has(normalizeColorKey(name)) ? " is-on" : "";
        return `<button type="button" class="inv-palette-chip${on}" data-palette-color="${escapeHtml(
          name
        )}" title="${escapeHtml(name)}" aria-pressed="${on ? "true" : "false"}" style="--chip:${escapeHtml(hex)}"></button>`;
      }).join("");
    }

    function syncInventoryColorsUi() {
      const cat = fields.category && fields.category.value;
      const isIphone = cat === "iphone";
      if (invIphoneColorAside) invIphoneColorAside.hidden = !isIphone;
      if (fields.colors) {
        fields.colors.readOnly = Boolean(isIphone);
        fields.colors.placeholder = isIphone ? "Seleccioná colores con la paleta →" : "Negro, Celeste, Verde, Amarillo, Rosado";
        fields.colors.title = isIphone ? "Colores definidos con la paleta (iPhone)" : "Separados por coma";
      }
      if (invColorsHelpMac) invColorsHelpMac.hidden = Boolean(isIphone);
      if (invColorsHelpIphone) invColorsHelpIphone.hidden = !isIphone;
      if (isIphone) renderIphonePalette();
    }

    function syncColorImageTargetOptions() {
      const colors = parseColorNames(fields.colors.value);
      const current = colorImageTarget.value;
      const opts = ['<option value="">Fotos generales (sin color)</option>'];
      colors.forEach((name) => {
        opts.push(`<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`);
      });
      colorImageTarget.innerHTML = opts.join("");
      if (current && colors.includes(current)) colorImageTarget.value = current;
    }

    function renderColorImages() {
      const entries = Object.entries(colorImages).filter(([, list]) => Array.isArray(list) && list.length);
      if (!entries.length) {
        colorImagesList.innerHTML = '<p class="admin-form-help">No hay fotos específicas por color.</p>';
        return;
      }
      colorImagesList.innerHTML = entries
        .map(
          ([color, list]) => `
          <div class="inv-variant-head" style="margin-top:8px;"><strong>${escapeHtml(color)}</strong></div>
          ${list
            .map(
              (url, i) => `
              <div class="inv-image-row" data-color="${escapeHtml(color)}" data-idx="${i}">
                <img src="${escapeHtml(url)}" alt="" />
                <div class="inv-image-actions">
                  <button type="button" class="btn btn-outline btn-sm" data-action="cimg-up">↑</button>
                  <button type="button" class="btn btn-outline btn-sm" data-action="cimg-down">↓</button>
                  <button type="button" class="btn btn-outline btn-sm" data-action="cimg-remove">Quitar</button>
                </div>
              </div>`
            )
            .join("")}
        `
        )
        .join("");
    }

    async function logProductAudit(productIdUuid, action, summary, details) {
      if (!window.BP_SUPABASE || !productIdUuid) return;
      try {
        const sess = await window.BP_SUPABASE.getCurrentSession();
        const u = sess && sess.user;
        await window.BP_SUPABASE.client.from("product_audit_log").insert({
          product_id: productIdUuid,
          actor_id: u?.id ?? null,
          actor_email: u?.email ?? null,
          action,
          summary: summary || "",
          details: details && typeof details === "object" ? details : {},
        });
      } catch (_) {}
    }

    async function refreshInventoryAuditPreview() {
      const tbody = document.getElementById("adminInventoryAuditBody");
      if (!tbody || !window.BP_SUPABASE) return;
      try {
        const { data, error } = await window.BP_SUPABASE.client
          .from("product_audit_log")
          .select("created_at, action, summary, actor_email, details")
          .order("created_at", { ascending: false })
          .limit(40);
        if (error) throw error;
        if (!data || !data.length) {
          tbody.innerHTML =
            '<tr><td colspan="5"><span class="admin-muted">Sin registros todavía.</span></td></tr>';
          return;
        }
        tbody.innerHTML = data
          .map((row) => {
            const det = row.details && typeof row.details === "object" ? row.details : {};
            const bits = [];
            if (det.price_before != null && det.price_after != null) {
              bits.push(`precio ${det.price_before}→${det.price_after}`);
            }
            if (det.stock_before != null && det.stock_after != null) {
              bits.push(`stock ${det.stock_before}→${det.stock_after}`);
            }
            const detailStr = bits.join(" · ");
            return `<tr>
              <td>${escapeHtml(formatDateTime(row.created_at))}</td>
              <td>${escapeHtml(row.actor_email || "—")}</td>
              <td>${escapeHtml(row.action)}</td>
              <td>${escapeHtml(row.summary || "—")}</td>
              <td>${escapeHtml(detailStr || "—")}</td>
            </tr>`;
          })
          .join("");
      } catch (_) {
        tbody.innerHTML =
          '<tr><td colspan="5"><span class="admin-muted">No se pudo cargar auditoría (¿migración aplicada?).</span></td></tr>';
      }
    }

    function openDuplicateFromProduct(product) {
      const vars =
        product.specs && Array.isArray(product.specs._variants) && product.specs._variants.length
          ? product.specs._variants.map((v) => ({ ...v }))
          : [];
      const dup = {
        ...product,
        id: `custom-${Date.now()}`,
        dbId: undefined,
        imei: "",
        stockSourceProductId: product.stockSourceProductId || product.dbId || null,
        published: false,
        title: `${product.title || "Producto"} (copia)`,
        specs: {
          ...(product.specs || {}),
          _variants: vars.length
            ? vars
            : [
                {
                  gb: 128,
                  price: Number(product.price) || 0,
                  oldPrice: product.oldPrice ?? null,
                  stock: Math.max(0, Number(product.stock) || 0),
                },
              ],
          _history: [],
        },
      };
      fillFormForEdit(dup);
    }

    function isMissingStockSourceColumnError(err) {
      const msg =
        err && typeof err.message === "string"
          ? err.message
          : err && typeof err.details === "string"
            ? err.details
            : "";
      return (
        typeof msg === "string" &&
        msg.includes("stock_source_product_id") &&
        (msg.includes("schema cache") || msg.includes("Could not find the") || msg.includes("column"))
      );
    }

    function toDbPayload(payload, keepExternalId, options) {
      function intOrNull(v) {
        const n = Math.round(Number(v));
        return Number.isFinite(n) ? n : null;
      }
      function intOrZero(v) {
        const n = Math.round(Number(v));
        return Number.isFinite(n) ? n : 0;
      }
      const imeiForDb =
        payload.imei && String(payload.imei).length === 15 ? String(payload.imei) : null;
      let specsJson = {};
      try {
        specsJson = JSON.parse(JSON.stringify(payload.specs || {}));
      } catch (_) {
        specsJson = {};
      }
      const dbPayload = {
        external_id: keepExternalId || payload.id,
        imei: imeiForDb,
        title: payload.title,
        category: payload.category,
        category_label: payload.categoryLabel,
        condition: payload.condition,
        price: intOrZero(payload.price),
        old_price: payload.oldPrice == null ? null : intOrNull(payload.oldPrice),
        stock: intOrZero(payload.stock),
        cover_image_url: payload.image || "",
        images: Array.isArray(payload.images) ? payload.images : [],
        description: payload.description || "",
        long_description: payload.longDescription || "",
        specs: specsJson,
        reviews: Array.isArray(payload.reviews) ? payload.reviews : [],
        colors: Array.isArray(payload.colors) ? payload.colors : [],
        capacities: Array.isArray(payload.capacities) ? payload.capacities : [],
        charger_price: payload.chargerPrice == null ? null : intOrNull(payload.chargerPrice),
        published: Boolean(payload.published),
      };
      const includeStockSource =
        !options || options.includeStockSource === undefined ? true : Boolean(options.includeStockSource);
      if (includeStockSource && supportsStockSourceProductColumn) {
        dbPayload.stock_source_product_id = payload.stockSourceProductId || null;
      }
      return dbPayload;
    }

    async function saveProductToSupabase(payload, existingProduct) {
      const isEdit = Boolean(existingProduct && existingProduct.dbId);
      const stableExternalId = existingProduct ? existingProduct.id : payload.id;
      async function runWrite(includeStockSource) {
        const queryPayload = toDbPayload(payload, stableExternalId, { includeStockSource });
        if (isEdit) {
          return window.BP_SUPABASE.client.from("products").update(queryPayload).eq("id", existingProduct.dbId);
        }
        return window.BP_SUPABASE.client.from("products").insert(queryPayload).select("id").single();
      }

      let result = await runWrite(supportsStockSourceProductColumn);
      let stockSourceColumnUnavailable = false;
      if (result.error && supportsStockSourceProductColumn && isMissingStockSourceColumnError(result.error)) {
        supportsStockSourceProductColumn = false;
        stockSourceColumnUnavailable = true;
        result = await runWrite(false);
      }
      return {
        result,
        stockSourceColumnUnavailable,
      };
    }

    async function uploadInventoryImage(file, productId) {
      if (!window.BP_SUPABASE || !file) return null;
      const cleanName = String(file.name || "image.jpg").replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `products/${productId}-${Date.now()}-${cleanName}`;
      const { error } = await window.BP_SUPABASE.client.storage
        .from("product-images")
        .upload(path, file, { upsert: false });
      if (error) throw error;
      const {
        data: { publicUrl },
      } = window.BP_SUPABASE.client.storage.from("product-images").getPublicUrl(path);
      return publicUrl;
    }

    function openModal(isEdit) {
      if (modalTitle) modalTitle.textContent = isEdit ? "Editar inventario" : "Agregar inventario";
      modal.hidden = false;
    }

    function closeModal() {
      modal.hidden = true;
      clearForm();
    }

    function renderPreview() {
      const title = fields.name.value.trim() || "Nombre del producto";
      const cat = categoryLabel(fields.category.value);
      const firstImage = images[0] || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&q=80";
      const firstVar = variants[0] || { price: 0, oldPrice: null, gb: "Base" };
      previewCard.innerHTML = `
        <img src="${escapeHtml(firstImage)}" alt="" style="width:100%;height:170px;object-fit:cover;border-radius:10px;border:1px solid #eee" />
        <p style="margin:8px 0 0;font-size:12px;color:#6f7d96">${escapeHtml(cat)} · ${escapeHtml(invConditionLabel(fields.condition.value || "seminuevo"))}</p>
        ${
          fields.stockSource && String(fields.stockSource.value || "").trim()
            ? `<p style="margin:4px 0 0;font-size:11px;color:#b45309">Stock compartido (se alinea al guardar con el producto dueño)</p>`
            : ""
        }
        <h4 style="margin:4px 0 0;font-size:14px">${escapeHtml(title)}</h4>
        <p style="margin:4px 0 0;font-size:13px;color:#3353ba">${escapeHtml(
          Number.isFinite(Number(firstVar.gb)) ? formatCapacityLabelForStore(firstVar.gb) : String(firstVar.gb || "Base")
        )}</p>
        <p style="margin:4px 0 0;font-size:16px;font-weight:700">${formatClp(Number(firstVar.price) || 0)}</p>
        ${
          Number(firstVar.oldPrice) > 0
            ? `<p style="margin:2px 0 0;font-size:12px;color:#7a869b;text-decoration:line-through">${formatClp(
                Number(firstVar.oldPrice)
              )}</p>`
            : ""
        }
      `;
    }

    function syncInvStockField() {
      if (!fields.stock) return;
      const t = variants.reduce((a, v) => a + Math.max(0, Number(v.stock) || 0), 0);
      fields.stock.value = String(t);
    }

    function renderVariants() {
      if (!variants.length) {
        variantList.innerHTML = '<p class="admin-form-help">Sin variantes. Agrega una capacidad.</p>';
        syncInvStockField();
        renderPreview();
        return;
      }
      const heading = `<div class="inv-variant-headings" aria-hidden="true"><span>Cap.</span><span>Precio</span><span>P. ant.</span><span>Stock</span><span></span></div>`;
      variantList.innerHTML =
        heading +
        variants
          .map(
            (v, i) => `
          <div class="inv-variant-row" data-idx="${i}">
            <select data-field="gb" aria-label="Capacidad">${inventoryGbSelectOptionsHtml(v.gb)}</select>
            <input type="number" min="0" step="1000" data-field="price" value="${Number(v.price) || ""}" placeholder="Precio" />
            <input type="number" min="0" step="1000" data-field="oldPrice" value="${
              Number(v.oldPrice) || ""
            }" placeholder="Precio anterior" />
            <input type="number" min="0" step="1" data-field="stock" value="${Number(v.stock) || 0}" placeholder="Stock" title="Stock para este almacenamiento (GB)" />
            <button type="button" class="btn btn-outline btn-sm" data-action="remove-variant">Quitar</button>
          </div>`
          )
          .join("");
      syncInvStockField();
      renderPreview();
    }

    function renderImages() {
      ensureImageColorTagsLength();
      if (!images.length) {
        imagesList.innerHTML = '<p class="admin-form-help">No hay fotos agregadas.</p>';
        renderPreview();
        return;
      }
      const modelColors = parseColorNames(fields.colors.value);
      const isIphone = fields.category && fields.category.value === "iphone";
      imagesList.innerHTML = images
        .map((url, i) => {
          const assigned = imageColorTags[i] ? normalizeColorName(imageColorTags[i]) : "";
          const chipsHtml = modelColors.length
            ? modelColors
                .map((cn) => {
                  const active =
                    assigned && normalizeColorKey(cn) === normalizeColorKey(assigned) ? " is-active" : "";
                  return `<button type="button" class="inv-img-color-chip${active}" data-img-idx="${i}" data-assign-color="${escapeHtml(
                    cn
                  )}" title="${escapeHtml(cn)}" aria-label="${escapeHtml(cn)}" style="background:${escapeHtml(
                    colorHexFromName(cn)
                  )}"></button>`;
                })
                .join("")
            : `<span class="admin-form-help">${
                isIphone ? "Elegí colores con la paleta." : "Escribí los colores del equipo arriba."
              }</span>`;
          const clearBtn = assigned
            ? `<button type="button" class="btn btn-outline btn-sm" data-action="img-clear-color" data-idx="${i}">Sin color</button>`
            : "";
          return `
          <div class="inv-image-row" data-idx="${i}">
            <img src="${escapeHtml(url)}" alt="" />
            <div class="inv-image-right">
              <div class="inv-image-actions">
                <button type="button" class="btn btn-outline btn-sm" data-action="img-up">↑</button>
                <button type="button" class="btn btn-outline btn-sm" data-action="img-down">↓</button>
                <button type="button" class="btn btn-outline btn-sm" data-action="img-remove">Quitar</button>
              </div>
              <div class="inv-image-color-assign">
                <span class="inv-image-meta-label">Color en esta foto</span>
                <div class="inv-img-color-chips">${chipsHtml}</div>
                ${clearBtn}
              </div>
            </div>
          </div>`;
        })
        .join("");
      renderPreview();
    }

    async function loadProducts() {
      if (window.BP_SUPABASE) {
        const { data, error } = await window.BP_SUPABASE.client
          .from("products")
          .select("*")
          .order("updated_at", { ascending: false });
        if (error) throw error;
        return (data || []).map(window.BP_SUPABASE.mapProductRow);
      }
      return seedAdminProductsIfNeeded();
    }

    function updateInventoryKpi() {
      const kpi = document.getElementById("kpiInventory");
      if (!kpi) return;
      const total = products.reduce((sum, p) => sum + (Number(p.price) || 0) * (Number(p.stock) || 0), 0);
      kpi.textContent = formatClp(total);
    }

    function clearForm() {
      fields.editId.value = "";
      form.reset();
      fields.published.checked = false;
      images = [];
      imageColorTags = [];
      colorImages = {};
      variants = [];
      syncColorImageTargetOptions();
      syncInventoryColorsUi();
      renderColorImages();
      renderImages();
      renderVariants();
      if (fields.stockSource) fields.stockSource.value = "";
    }

    function openCreateForm() {
      clearForm();
      variants = [{ gb: 128, price: 0, oldPrice: null, stock: 1 }];
      renderVariants();
      fields.name.focus();
      openModal(false);
    }

    function closeForm() {
      closeModal();
    }

    function closePreview() {
      if (previewModal) previewModal.hidden = true;
      activePreviewId = "";
    }

    function getProductTimeline(product) {
      const history = product?.specs?._history;
      if (Array.isArray(history) && history.length) {
        return history
          .slice()
          .sort((a, b) => Number(b.at || 0) - Number(a.at || 0))
          .map((item) => ({
            type: item.type || "update",
            title: item.title || "Actualizacion",
            note: item.note || "",
            amount: Number(item.amount) || 0,
            at: Number(item.at) || Date.now(),
          }));
      }
      return [
        {
          type: product?.published ? "published" : "draft",
          title: product?.published ? "Producto publicado" : "Producto creado",
          note: "Registro inicial de inventario",
          amount: Number(product?.price) || 0,
          at: Number(product?.updatedAt) || Date.now(),
        },
      ];
    }

    function renderPreviewResumen(product) {
      if (!previewPaneResumen) return;
      const image =
        product.image ||
        (Array.isArray(product.images) && product.images[0]) ||
        "data:image/svg+xml;utf8," +
          encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480"><rect width="100%" height="100%" fill="#eef2ff"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-size="26" font-family="Arial">Sin imagen</text></svg>'
          );
      const statusClass = product.published ? "pill--ok" : "pill--warn";
      const statusText = product.published ? "Publicado" : "Listo para la foto";
      previewPaneResumen.innerHTML = `
        <div class="inv-pr-top">
          <span class="pill ${statusClass}">${statusText}</span>
          <span class="inv-pr-stock">${Number(product.stock) || 0} en stock${
            product.stockSourceProductId ? " · stock vinculado" : ""
          }</span>
        </div>
        <img class="inv-pr-image" src="${escapeHtml(image)}" alt="${escapeHtml(product.title)}" />
        <h4 class="inv-pr-title">${escapeHtml(product.title)}</h4>
        <p class="inv-pr-meta">${escapeHtml(product.imei || "Sin IMEI")} · ${escapeHtml(
          product.categoryLabel || categoryLabel(product.category)
        )}</p>
        <div class="inv-pr-price">${formatClp(Number(product.price) || 0)}</div>
        <button type="button" class="inv-pr-quick-head">Acciones rapidas</button>
        <div class="inv-pr-quick-actions">
          <button type="button" class="btn btn-outline" data-preview-quick="edit">Editar publicacion</button>
          <button type="button" class="btn btn-outline" data-preview-quick="toggle">${
            product.published ? "Ocultar publicacion" : "Publicar ahora"
          }</button>
        </div>
      `;
    }

    function renderPreviewTimeline(product) {
      if (!previewPaneTimeline) return;
      const timeline = getProductTimeline(product);
      previewPaneTimeline.innerHTML = `
        <div class="inv-tl-kpis">
          <article><span>Utilidad total</span><strong>${formatClp(Number(product.price || 0) * (Number(product.stock) || 0))}</strong></article>
          <article><span>Stock</span><strong>${Number(product.stock) || 0}</strong></article>
          <article><span>Estado</span><strong>${product.published ? "Publicado" : "Borrador"}</strong></article>
        </div>
        <div class="inv-tl-list">
          ${timeline
            .map(
              (item) => `
            <div class="inv-tl-item">
              <div class="inv-tl-dot"></div>
              <div class="inv-tl-content">
                <p class="inv-tl-title">${escapeHtml(item.title)}</p>
                <p class="inv-tl-note">${escapeHtml(item.note || formatDateTime(item.at))}${
                  item.actor_email
                    ? ` · <span style="opacity:0.85">${escapeHtml(String(item.actor_email))}</span>`
                    : ""
                }</p>
              </div>
              <div class="inv-tl-amount">${item.amount > 0 ? formatClp(item.amount) : "-"}</div>
            </div>`
            )
            .join("")}
        </div>
      `;
    }

    function openPreview(product) {
      if (!previewModal || !product) return;
      activePreviewId = product.id;
      renderPreviewResumen(product);
      renderPreviewTimeline(product);
      previewTabs.forEach((tab) =>
        tab.classList.toggle("is-active", tab.getAttribute("data-preview-tab") === "resumen")
      );
      if (previewPaneResumen) previewPaneResumen.classList.add("is-active");
      if (previewPaneTimeline) previewPaneTimeline.classList.remove("is-active");
      previewModal.hidden = false;
    }

    async function handleTogglePublication(product) {
      try {
        const now = Date.now();
        let actorEmail = "";
        let actorId = "";
        if (window.BP_SUPABASE) {
          const s = await window.BP_SUPABASE.getCurrentSession();
          if (s?.user) {
            actorEmail = s.user.email || "";
            actorId = s.user.id || "";
          }
        }
        const nextSpecs = {
          ...(product.specs || {}),
          _history: [
            ...getProductTimeline(product),
            {
              type: product.published ? "hidden" : "published",
              title: product.published ? "Producto ocultado" : "Producto publicado",
              note: "Cambio de estado desde acciones rapidas",
              amount: Number(product.price) || 0,
              at: now,
              actor_email: actorEmail || undefined,
              actor_id: actorId || undefined,
            },
          ],
        };
        if (window.BP_SUPABASE && product.dbId) {
          const { error } = await window.BP_SUPABASE.client
            .from("products")
            .update({ published: !product.published, updated_at: new Date(now).toISOString(), specs: nextSpecs })
            .eq("id", product.dbId);
          if (error) throw error;
          await logProductAudit(product.dbId, "publish_toggle", product.published ? "Despublicó" : "Publicó", {
            published_after: !product.published,
          });
          products = await loadProducts();
        } else {
          products = products.map((p) =>
            p.id === product.id ? { ...p, published: !p.published, specs: nextSpecs, updatedAt: now } : p
          );
          writeAdminProducts(products);
        }
        renderInventoryTable();
        if (typeof window.__adminNotifyInventoryLoaded === "function") {
          window.__adminNotifyInventoryLoaded(products);
        }
        if (activePreviewId) {
          const refreshed = products.find((p) => p.id === activePreviewId);
          if (refreshed) openPreview(refreshed);
        }
        refreshInventoryAuditPreview();
        showToast("Estado de publicacion actualizado.");
      } catch (_) {
        showToast("No se pudo actualizar el estado.", true);
      }
    }

    function getFilteredProducts() {
      const term = search.value.trim().toLowerCase();
      const cat = categoryFilter.value;
      const status = statusFilter.value;
      return products.filter((p) => {
        const byTerm =
          !term ||
          String(p.title).toLowerCase().includes(term) ||
          (p.imei && String(p.imei).includes(term)) ||
          String(p.categoryLabel || "").toLowerCase().includes(term);
        const byCat = cat === "all" || p.category === cat;
        const byStatus =
          status === "all" ||
          (status === "published" && p.published) ||
          (status === "draft" && !p.published);
        return byTerm && byCat && byStatus;
      });
    }

    function formatVariantStocksForTable(p) {
      const list = p.specs && Array.isArray(p.specs._variants) ? p.specs._variants : [];
      if (!list.length) return escapeHtml(String(Number(p.stock) || 0));
      const parts = list
        .filter((x) => x != null && Number(x.gb) > 0)
        .map((x) => `${formatCapacityLabelForStore(x.gb)}: ${Number(x.stock) || 0}`);
      if (!parts.length) return escapeHtml(String(Number(p.stock) || 0));
      return parts.map((line) => escapeHtml(line)).join("<br />");
    }

    function renderInventoryTable() {
      const rows = getFilteredProducts();
      const sellerMode = document.body.classList.contains("admin-role-seller");
      if (!rows.length) {
        tableBody.innerHTML = '<tr><td colspan="8">No hay productos con esos filtros.</td></tr>';
        updateInventoryKpi();
        return;
      }
      tableBody.innerHTML = rows
        .map((p) => {
          const stateClass = p.published ? "pill--ok" : "pill--warn";
          const stateText = p.published ? "Publicado" : "Listo para foto";
          const variantCount =
            p.specs && Array.isArray(p.specs._variants) ? p.specs._variants.length : 0;
          const defaultThumb =
            "data:image/svg+xml;utf8," +
            encodeURIComponent(
              '<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72"><rect width="72" height="72" fill="#eef2ff"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="Arial">Sin imagen</text></svg>'
            );
          const thumb = p.image || (Array.isArray(p.images) && p.images[0]) || defaultThumb;
          return `
            <tr>
              <td>
                <div class="inv-list-product-cell">
                  <img src="${escapeHtml(thumb)}" alt="" class="inv-list-thumb" />
                  <div>
                    <strong>${escapeHtml(p.title)}</strong><br />
                    <span>${escapeHtml(invConditionLabel(p.condition))}</span>${
                      p.stockSourceProductId
                        ? '<br /><span class="admin-muted" title="Replica stock del producto canónico">Stock vinculado</span>'
                        : ""
                    }
                  </div>
                </div>
              </td>
              <td>${escapeHtml(p.imei || "-")}</td>
              <td>${escapeHtml(p.categoryLabel || categoryLabel(p.category))}</td>
              <td>${formatClp(p.price || 0)}${variantCount ? `<br /><span>${variantCount} variante(s)</span>` : ""}</td>
              <td><span class="pill ${stateClass}">${stateText}</span></td>
              <td class="inv-stock-cell">${formatVariantStocksForTable(p)}</td>
              <td>${formatDateTime(p.updatedAt)}</td>
              <td>
                <div class="admin-row-actions">
                  <button type="button" class="btn btn-outline btn-sm" title="Editar" data-action="edit" data-id="${escapeHtml(p.id)}" ${sellerMode ? "disabled" : ""}>✎</button>
                  <button type="button" class="btn btn-outline btn-sm" title="Duplicar como plantilla" data-action="duplicate" data-id="${escapeHtml(p.id)}" ${sellerMode ? "disabled" : ""}>⎘</button>
                  <button type="button" class="btn btn-outline btn-sm" title="Vista previa" data-action="preview" data-id="${escapeHtml(p.id)}">👁</button>
                  <button type="button" class="btn btn-outline btn-sm" title="${p.published ? "Ocultar" : "Publicar"}" data-action="toggle" data-id="${escapeHtml(p.id)}" ${sellerMode ? "disabled" : ""}>◎</button>
                  <button type="button" class="btn btn-outline btn-sm" title="Eliminar" data-action="delete" data-id="${escapeHtml(p.id)}" ${sellerMode ? "disabled" : ""}>🗑</button>
                </div>
              </td>
            </tr>
          `;
        })
        .join("");
      updateInventoryKpi();
    }

    function fillFormForEdit(product) {
      fields.editId.value = product.id;
      fields.name.value = product.title || "";
      fields.imei.value = product.imei || "";
      fields.category.value = product.category || "";
      fields.condition.value = product.condition || "seminuevo";
      fields.description.value = product.description || "";
      fields.longDescription.value = product.longDescription || "";
      fields.published.checked = Boolean(product.published);
      fields.colors.value = Array.isArray(product.colors) ? product.colors.map((c) => c?.name).filter(Boolean).join(", ") : "";
      images = Array.isArray(product.images) && product.images.length ? [...product.images] : [product.image].filter(Boolean);
      const rawImgColors =
        product.specs && Array.isArray(product.specs._imageColors) ? product.specs._imageColors : [];
      imageColorTags = images.map((_, i) =>
        rawImgColors[i] ? normalizeColorName(String(rawImgColors[i])) : ""
      );
      ensureImageColorTagsLength();
      colorImages =
        product.specs && product.specs._colorImages && typeof product.specs._colorImages === "object"
          ? Object.fromEntries(
              Object.entries(product.specs._colorImages).map(([k, list]) => [
                normalizeColorName(k),
                Array.isArray(list) ? [...list] : [],
              ])
            )
          : {};
      syncColorImageTargetOptions();
      syncInventoryColorsUi();
      renderColorImages();
      variants =
        (product.specs && Array.isArray(product.specs._variants) && product.specs._variants.length
          ? product.specs._variants
          : [
              {
                gb: 128,
                price: Number(product.price) || 0,
                oldPrice: Number(product.oldPrice) || null,
                stock: Number(product.stock) || 0,
              },
            ]).map((v) => ({ ...v }));
      renderImages();
      renderVariants();
      if (fields.stockSource) {
        fields.stockSource.value = product.stockSourceProductId || "";
      }
      fields.name.focus();
      openModal(true);
    }

    addBtn.addEventListener("click", () => {
      openCreateForm();
    });
    cancelBtn.addEventListener("click", () => {
      closeForm();
    });
    modal.addEventListener("click", (e) => {
      if (e.target && e.target.hasAttribute("data-close-inv-modal")) closeForm();
    });
    if (previewModal) {
      previewModal.addEventListener("click", (e) => {
        if (e.target && e.target.hasAttribute("data-close-preview-modal")) closePreview();
      });
    }
    if (previewCloseBtn) previewCloseBtn.addEventListener("click", closePreview);
    previewTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.getAttribute("data-preview-tab");
        previewTabs.forEach((t) => t.classList.toggle("is-active", t === tab));
        if (previewPaneResumen) previewPaneResumen.classList.toggle("is-active", target === "resumen");
        if (previewPaneTimeline) previewPaneTimeline.classList.toggle("is-active", target === "timeline");
      });
    });
    if (previewPaneResumen) {
      previewPaneResumen.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-preview-quick]");
        if (!btn || !activePreviewId) return;
        const product = products.find((p) => p.id === activePreviewId);
        if (!product) return;
        const action = btn.getAttribute("data-preview-quick");
        if (action === "edit") {
          closePreview();
          fillFormForEdit(product);
          return;
        }
        if (action === "toggle") handleTogglePublication(product);
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeForm();
      if (e.key === "Escape" && previewModal && !previewModal.hidden) closePreview();
    });

    addVariantBtn.addEventListener("click", () => {
      variants.push({ gb: nextInventoryGbPreset(), price: 0, oldPrice: null, stock: 1 });
      renderVariants();
    });
    function onVariantFieldInput(e) {
      const row = e.target.closest(".inv-variant-row");
      if (!row) return;
      const idx = Number(row.getAttribute("data-idx"));
      const field = e.target.getAttribute("data-field");
      if (!Number.isFinite(idx) || !field || !variants[idx]) return;
      const raw = Number(e.target.value);
      if (field === "stock") {
        variants[idx][field] = Number.isFinite(raw) ? Math.max(0, raw) : 0;
        syncInvStockField();
      } else {
        variants[idx][field] = raw;
      }
      renderPreview();
    }
    variantList.addEventListener("input", onVariantFieldInput);
    variantList.addEventListener("change", onVariantFieldInput);
    variantList.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action='remove-variant']");
      if (!btn) return;
      const row = btn.closest(".inv-variant-row");
      if (!row) return;
      const idx = Number(row.getAttribute("data-idx"));
      variants = variants.filter((_, i) => i !== idx);
      renderVariants();
    });

    fields.colors.addEventListener("input", () => {
      syncColorImageTargetOptions();
      renderImages();
      renderPreview();
    });

    fields.category.addEventListener("change", () => {
      syncInventoryColorsUi();
      renderImages();
      renderPreview();
    });

    if (invIphoneColorPaletteEl) {
      invIphoneColorPaletteEl.addEventListener("click", (e) => {
        const b = e.target.closest("[data-palette-color]");
        if (!b) return;
        const rawName = b.getAttribute("data-palette-color");
        if (!rawName) return;
        let list = parseColorNames(fields.colors.value);
        const key = normalizeColorKey(rawName);
        const idx = list.findIndex((c) => normalizeColorKey(c) === key);
        if (idx >= 0) list.splice(idx, 1);
        else list.push(normalizeColorName(rawName));
        fields.colors.value = list.join(", ");
        imageColorTags = imageColorTags.map((tag) =>
          tag && list.some((c) => normalizeColorKey(c) === normalizeColorKey(tag)) ? tag : ""
        );
        syncColorImageTargetOptions();
        renderIphonePalette();
        renderImages();
        renderPreview();
      });
    }

    imageFiles.addEventListener("change", async () => {
      const files = Array.from(imageFiles.files || []);
      if (!files.length) return;
      const productId = fields.editId.value || `new-${Date.now()}`;
      const targetColor = normalizeColorName(colorImageTarget.value);
      for (const file of files) {
        try {
          const uploaded = await uploadInventoryImage(file, productId);
          if (uploaded) {
            if (targetColor) {
              if (!Array.isArray(colorImages[targetColor])) colorImages[targetColor] = [];
              colorImages[targetColor].push(uploaded);
            } else {
              images.push(uploaded);
              imageColorTags.push("");
            }
          }
        } catch (err) {
          const msg =
            err && typeof err.message === "string"
              ? err.message
              : err && err.error_description
                ? String(err.error_description)
                : String(err || "Error al subir");
          showToast(`No se pudo subir la imagen: ${msg}`, true);
        }
      }
      imageFiles.value = "";
      renderImages();
      renderColorImages();
    });
    imagesList.addEventListener("click", (e) => {
      const assign = e.target.closest("button[data-assign-color]");
      if (assign) {
        const idx = Number(assign.dataset.imgIdx);
        const color = assign.getAttribute("data-assign-color");
        if (!Number.isFinite(idx) || !color) return;
        ensureImageColorTagsLength();
        imageColorTags[idx] = normalizeColorName(color);
        renderImages();
        return;
      }
      const clearC = e.target.closest("button[data-action='img-clear-color']");
      if (clearC) {
        const idx = Number(clearC.getAttribute("data-idx"));
        if (!Number.isFinite(idx)) return;
        ensureImageColorTagsLength();
        imageColorTags[idx] = "";
        renderImages();
        return;
      }
      const row = e.target.closest(".inv-image-row");
      const btn = e.target.closest("button[data-action]");
      if (!row || !btn) return;
      const idx = Number(row.getAttribute("data-idx"));
      if (!Number.isFinite(idx)) return;
      const action = btn.getAttribute("data-action");
      if (action === "img-remove") {
        images = images.filter((_, i) => i !== idx);
        imageColorTags.splice(idx, 1);
      }
      if (action === "img-up" && idx > 0) {
        [images[idx - 1], images[idx]] = [images[idx], images[idx - 1]];
        [imageColorTags[idx - 1], imageColorTags[idx]] = [imageColorTags[idx], imageColorTags[idx - 1]];
      }
      if (action === "img-down" && idx < images.length - 1) {
        [images[idx + 1], images[idx]] = [images[idx], images[idx + 1]];
        [imageColorTags[idx + 1], imageColorTags[idx]] = [imageColorTags[idx], imageColorTags[idx + 1]];
      }
      renderImages();
    });
    colorImagesList.addEventListener("click", (e) => {
      const row = e.target.closest(".inv-image-row[data-color][data-idx]");
      const btn = e.target.closest("button[data-action]");
      if (!row || !btn) return;
      const color = normalizeColorName(row.getAttribute("data-color"));
      const idx = Number(row.getAttribute("data-idx"));
      if (!color || !Number.isFinite(idx) || !Array.isArray(colorImages[color])) return;
      const action = btn.getAttribute("data-action");
      if (action === "cimg-remove") colorImages[color] = colorImages[color].filter((_, i) => i !== idx);
      if (action === "cimg-up" && idx > 0) [colorImages[color][idx - 1], colorImages[color][idx]] = [colorImages[color][idx], colorImages[color][idx - 1]];
      if (action === "cimg-down" && idx < colorImages[color].length - 1)
        [colorImages[color][idx + 1], colorImages[color][idx]] = [colorImages[color][idx], colorImages[color][idx + 1]];
      if (!colorImages[color].length) delete colorImages[color];
      renderColorImages();
    });
    ["input", "change"].forEach((evt) => form.addEventListener(evt, renderPreview));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const isEdit = Boolean(fields.editId.value);
      const name = fields.name.value.trim();
      const imeiDigits = normalizeImei(fields.imei.value);
      let imei = "";
      if (imeiDigits.length > 0) {
        if (!/^\d{15}$/.test(imeiDigits)) {
          showToast("El IMEI debe tener exactamente 15 dígitos o dejarse vacío.", true);
          return;
        }
        imei = imeiDigits;
      }
      const category = fields.category.value;
      const condition = fields.condition.value;
      const cleanVariants = variants
        .map((v) => ({
          gb: Number(v.gb),
          price: Number(v.price),
          oldPrice: Number(v.oldPrice) || null,
          stock: Math.max(0, Number(v.stock) || 0),
        }))
        .filter((v) => Number.isFinite(v.gb) && Number.isFinite(v.price) && Number.isFinite(v.stock));
      const totalVariantStock = cleanVariants.reduce((acc, v) => acc + v.stock, 0);
      if (!name || !category || !condition || !cleanVariants.length) {
        showToast("Completa los campos obligatorios del producto.", true);
        return;
      }
      const duplicate =
        imei &&
        products.some((p) => p.imei === imei && (!isEdit || p.id !== fields.editId.value));
      if (duplicate) {
        showToast("Ese IMEI ya está registrado en inventario.", true);
        return;
      }

      const existingProduct = isEdit
        ? products.find((p) => p.id === fields.editId.value)
        : null;
      const rawStockSource = fields.stockSource ? String(fields.stockSource.value || "").trim() : "";
      let resolvedStockSource = null;
      if (rawStockSource) {
        const uuidRe =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89abAB][0-9a-f]{3}-[0-9a-f]{12}$/;
        if (!uuidRe.test(rawStockSource)) {
          showToast("El UUID de stock compartido no es válido.", true);
          return;
        }
        resolvedStockSource = rawStockSource;
        if (isEdit && existingProduct && existingProduct.dbId && resolvedStockSource === existingProduct.dbId) {
          showToast("No podés vincular el stock al mismo producto.", true);
          return;
        }
      }
      const image = images[0] || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&q=80";
      const baseVariant = [...cleanVariants].sort((a, b) => a.price - b.price)[0];
      const colorNames = parseColorNames(fields.colors.value);
      ensureImageColorTagsLength();
      const cleanImageColors = images.map((_, i) =>
        imageColorTags[i] ? normalizeColorName(imageColorTags[i]) : ""
      );
      const cleanColorImages = Object.fromEntries(
        Object.entries(colorImages)
          .map(([name, list]) => [normalizeColorName(name), Array.isArray(list) ? list.filter(Boolean) : []])
          .filter(([, list]) => list.length)
      );
      const fallbackFromColor = Object.values(cleanColorImages).find((list) => Array.isArray(list) && list.length)?.[0] || "";
      const coverImage = images[0] || fallbackFromColor || image;

      const previousHistory =
        existingProduct &&
        existingProduct.specs &&
        Array.isArray(existingProduct.specs._history)
          ? existingProduct.specs._history
          : [];
      const nowTs = Date.now();
      let actorEmail = "";
      let actorId = "";
      if (window.BP_SUPABASE) {
        const s = await window.BP_SUPABASE.getCurrentSession();
        if (s?.user) {
          actorEmail = s.user.email || "";
          actorId = s.user.id || "";
        }
      }

      const payload = {
        id: isEdit ? fields.editId.value : `custom-${Date.now()}`,
        imei,
        title: name,
        category,
        categoryLabel: categoryLabel(category),
        condition,
        price: Number(baseVariant.price) || 0,
        oldPrice: Number(baseVariant.oldPrice) || null,
        stock: totalVariantStock,
        image: coverImage,
        images: [...images],
        description:
          fields.description.value.trim() ||
          (imei
            ? `Producto ingresado desde panel con IMEI ${imei}.`
            : "Producto ingresado desde panel administrativo."),
        longDescription:
          fields.longDescription.value.trim() ||
          (imei
            ? `Equipo cargado desde panel administrativo Blackpink Store.\n\nIMEI: ${imei}.`
            : "Equipo cargado desde panel administrativo Blackpink Store."),
        specs: {
          ...(imei ? { IMEI: imei } : {}),
          Estado: invConditionLabel(condition),
          Categoría: categoryLabel(category),
          _colorImages: cleanColorImages,
          _imageColors: cleanImageColors,
          _variants: cleanVariants,
          _history: [
            ...previousHistory,
            {
              type: existingProduct ? "update" : "create",
              title: existingProduct ? "Producto editado" : "Producto creado",
              note: existingProduct
                ? "Cambios guardados desde el editor"
                : "Registro inicial de inventario",
              amount: Number(baseVariant.price) || 0,
              at: nowTs,
              actor_email: actorEmail || undefined,
              actor_id: actorId || undefined,
            },
          ],
        },
        reviews: [],
        colors: colorNames.map((name) => ({ name, hex: colorHexFromName(name) })),
        capacities: cleanVariants.map((v) => formatCapacityLabelForStore(v.gb)),
        chargerPrice: null,
        published: Boolean(fields.published.checked),
        updatedAt: nowTs,
        stockSourceProductId: resolvedStockSource,
      };

      try {
        let stockSourceColumnUnavailable = false;
        if (window.BP_SUPABASE) {
          const prevP = existingProduct ? Number(existingProduct.price) : null;
          const prevS = existingProduct ? Number(existingProduct.stock) : null;
          const { result, stockSourceColumnUnavailable: missingStockColumn } = await saveProductToSupabase(
            payload,
            existingProduct
          );
          stockSourceColumnUnavailable = missingStockColumn;
          if (result.error) throw result.error;
          if (existingProduct && existingProduct.dbId) {
            await logProductAudit(existingProduct.dbId, "product_update", "Actualización desde panel", {
              price_before: prevP,
              price_after: Number(payload.price),
              stock_before: prevS,
              stock_after: Number(payload.stock),
            });
          } else {
            const inserted = result.data;
            if (inserted && inserted.id) {
              await logProductAudit(inserted.id, "product_create", "Alta desde panel", {
                price_after: Number(payload.price),
                stock_after: Number(payload.stock),
              });
            }
          }
          products = await loadProducts();
        } else if (isEdit) {
          products = products.map((p) => (p.id === payload.id ? { ...p, ...payload } : p));
          writeAdminProducts(products);
        } else {
          products.unshift(payload);
          writeAdminProducts(products);
        }
        renderInventoryTable();
        if (typeof window.__adminNotifyInventoryLoaded === "function") {
          window.__adminNotifyInventoryLoaded(products);
        }
        closeForm();
        refreshInventoryAuditPreview();
        if (stockSourceColumnUnavailable && payload.stockSourceProductId) {
          showToast(
            "Producto guardado, pero tu base actual no soporta stock compartido. Ejecuta la migración de stock compartido para habilitarlo."
          );
        } else {
          showToast(existingProduct ? "Producto actualizado correctamente." : "Producto agregado al inventario.");
        }
      } catch (err) {
        console.error(err);
        const msg =
          err && typeof err.message === "string"
            ? err.message
            : err && err.error_description
              ? String(err.error_description)
              : "Error desconocido";
        showToast("No se pudo guardar en Supabase: " + msg, true);
      }
    });

    tableBody.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action][data-id]");
      if (!btn) return;
      const action = btn.getAttribute("data-action");
      const id = btn.getAttribute("data-id");
      const product = products.find((p) => p.id === id);
      if (!product) return;

      if (action === "edit") {
        fillFormForEdit(product);
        return;
      }
      if (action === "duplicate") {
        openDuplicateFromProduct(product);
        return;
      }
      if (action === "preview") {
        openPreview(product);
        return;
      }
      if (action === "toggle") {
        handleTogglePublication(product);
        return;
      }
      if (action === "delete") {
        (async () => {
          const ok = window.confirm(`¿Eliminar "${product.title}" del inventario?`);
          if (!ok) return;
          try {
            if (window.BP_SUPABASE && product.dbId) {
              const { error } = await window.BP_SUPABASE.client
                .from("products")
                .delete()
                .eq("id", product.dbId);
              if (error) throw error;
              products = await loadProducts();
            } else {
              products = products.filter((p) => p.id !== id);
              writeAdminProducts(products);
            }
            renderInventoryTable();
            if (typeof window.__adminNotifyInventoryLoaded === "function") {
              window.__adminNotifyInventoryLoaded(products);
            }
            showToast("Producto eliminado.");
          } catch (_) {
            showToast("No se pudo eliminar el producto.", true);
          }
        })();
      }
    });

    search.addEventListener("input", renderInventoryTable);
    categoryFilter.addEventListener("change", renderInventoryTable);
    statusFilter.addEventListener("change", renderInventoryTable);
    loadProducts()
      .then((loaded) => {
        products = loaded;
        renderInventoryTable();
        refreshInventoryAuditPreview();
        if (typeof window.__adminNotifyInventoryLoaded === "function") {
          window.__adminNotifyInventoryLoaded(products);
        }
      })
      .catch(() => {
        products = seedAdminProductsIfNeeded();
        renderInventoryTable();
        refreshInventoryAuditPreview();
        if (typeof window.__adminNotifyInventoryLoaded === "function") {
          window.__adminNotifyInventoryLoaded(products);
        }
      });
    syncInventoryColorsUi();
    renderImages();
    renderVariants();
  }

  function flattenTradeInModels(data) {
    const list = [];
    const categories = (data && data.categories) || [];
    const catMap = new Map(categories.map((c) => [c.id, c.name]));
    const modelsObj = (data && data.models) || {};
    Object.keys(modelsObj).forEach((catId) => {
      (modelsObj[catId] || []).forEach((m) => {
        list.push({
          categoryId: catId,
          categoryName: catMap.get(catId) || catId,
          id: m.id,
          name: m.name,
          base: m.base,
          capacities: Array.isArray(m.capacities) ? m.capacities : [],
        });
      });
    });
    return list;
  }

  async function initTradeInModule() {
    let data = window.TRADE_IN_DATA || null;

    const tableBody = document.getElementById("tradeInPricingTableBody");
    const search = document.getElementById("tradeInSearch");
    const catFilter = document.getElementById("tradeInCategoryFilter");
    const categoryTags = document.getElementById("tradeInCategoryTags");
    const addCategoryBtn = document.getElementById("tradeInAddCategoryBtn");
    const addModelBtn = document.getElementById("tradeInAddModelBtn");
    const saveBtn = document.getElementById("tradeInSaveBtn");
    const resetBtn = document.getElementById("tradeInResetBtn");
    const incrementInput = document.getElementById("tradeInIncrement");
    const deductionInput = document.getElementById("tradeInDeduction");
    const floorInput = document.getElementById("tradeInFloor");
    const previewModel = document.getElementById("tradeInPreviewModel");
    const previewCap = document.getElementById("tradeInPreviewCapacity");
    const previewBtn = document.getElementById("tradeInPreviewCalcBtn");
    const previewResult = document.getElementById("tradeInPreviewResult");
    const modelModal = document.getElementById("tradeInModelModal");
    const modelModalTitle = document.getElementById("tradeInModelModalTitle");
    const modelCancelBtn = document.getElementById("tradeInModelCancelBtn");
    const modelForm = document.getElementById("tradeInModelForm");
    const modelCategory = document.getElementById("tradeInModelCategory");
    const modelName = document.getElementById("tradeInModelName");
    const modelId = document.getElementById("tradeInModelId");
    const modelEditOriginalId = document.getElementById("tradeInModelEditOriginalId");
    const modelYear = document.getElementById("tradeInModelYear");
    const modelBase = document.getElementById("tradeInModelBase");
    const modelCaps = document.getElementById("tradeInModelCaps");
    const modelImgFile = document.getElementById("tradeInModelImgFile");
    const modelRemoveImg = document.getElementById("tradeInModelRemoveImg");
    const modelImgPreview = document.getElementById("tradeInModelImgPreview");
    const categoryModal = document.getElementById("tradeInCategoryModal");
    const categoryCancelBtn = document.getElementById("tradeInCategoryCancelBtn");
    const categoryForm = document.getElementById("tradeInCategoryForm");
    const categoryIdInput = document.getElementById("tradeInCategoryId");
    const categoryEditOriginalId = document.getElementById("tradeInCategoryEditOriginalId");
    const categoryNameInput = document.getElementById("tradeInCategoryName");
    const categoryImgFile = document.getElementById("tradeInCategoryImgFile");
    const categoryRemoveImg = document.getElementById("tradeInCategoryRemoveImg");
    const categoryImgPreview = document.getElementById("tradeInCategoryImgPreview");
    const previewModal = document.getElementById("tradeInPreviewModal");
    const previewCloseBtn = document.getElementById("tradeInPreviewCloseBtn");
    const previewPane = document.getElementById("tradeInPreviewPane");
    if (
      !tableBody ||
      !search ||
      !catFilter ||
      !categoryTags ||
      !addCategoryBtn ||
      !addModelBtn ||
      !saveBtn ||
      !resetBtn ||
      !incrementInput ||
      !deductionInput ||
      !floorInput ||
      !previewModel ||
      !previewCap ||
      !previewBtn ||
      !previewResult ||
      !modelModal ||
      !modelCancelBtn ||
      !modelForm ||
      !modelCategory ||
      !modelName ||
      !modelId ||
      !modelEditOriginalId ||
      !modelYear ||
      !modelBase ||
      !modelCaps ||
      !modelImgFile ||
      !modelRemoveImg ||
      !modelImgPreview ||
      !categoryModal ||
      !categoryCancelBtn ||
      !categoryForm ||
      !categoryIdInput ||
      !categoryEditOriginalId ||
      !categoryNameInput ||
      !categoryImgFile ||
      !categoryRemoveImg ||
      !categoryImgPreview ||
      !previewModal ||
      !previewCloseBtn ||
      !previewPane
    ) {
      return;
    }

    const settings = {
      incrementPerTier: DEFAULT_INCREMENT,
      fixedDeduction: DEFAULT_DEDUCTION,
      minPercentFloor: DEFAULT_FLOOR,
    };
    let modelRows = [];
    let categories = [];
    let editingModelImageUrl = "";
    let editingCategoryImageUrl = "";

    incrementInput.value = String(settings.incrementPerTier ?? DEFAULT_INCREMENT);
    deductionInput.value = String(settings.fixedDeduction ?? DEFAULT_DEDUCTION);
    floorInput.value = String(settings.minPercentFloor ?? DEFAULT_FLOOR);

    function slugify(value) {
      return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-_]/g, "");
    }

    function closeModelModal() {
      modelModal.hidden = true;
      modelForm.reset();
      modelEditOriginalId.value = "";
      editingModelImageUrl = "";
      modelRemoveImg.checked = false;
      modelImgPreview.style.backgroundImage = "";
      modelImgPreview.textContent = "Sin imagen";
    }

    function closeCategoryModal() {
      categoryModal.hidden = true;
      categoryForm.reset();
      categoryEditOriginalId.value = "";
      categoryIdInput.readOnly = false;
      editingCategoryImageUrl = "";
      categoryRemoveImg.checked = false;
      categoryImgPreview.style.backgroundImage = "";
      categoryImgPreview.textContent = "Sin imagen";
    }

    function renderImagePreview(targetEl, fileInput, currentUrl, removeChecked) {
      if (!targetEl) return;
      if (removeChecked) {
        targetEl.style.backgroundImage = "";
        targetEl.textContent = "Imagen eliminada";
        return;
      }
      const file = fileInput && fileInput.files && fileInput.files[0];
      if (file) {
        readFileAsDataUrl(file)
          .then((dataUrl) => {
            targetEl.style.backgroundImage = `url("${String(dataUrl).replace(/"/g, '\\"')}")`;
            targetEl.textContent = "";
          })
          .catch(() => {
            targetEl.style.backgroundImage = "";
            targetEl.textContent = "No se pudo previsualizar";
          });
        return;
      }
      if (currentUrl) {
        targetEl.style.backgroundImage = `url("${String(currentUrl).replace(/"/g, '\\"')}")`;
        targetEl.textContent = "";
        return;
      }
      targetEl.style.backgroundImage = "";
      targetEl.textContent = "Sin imagen";
    }

    function closePreviewModal() {
      previewModal.hidden = true;
      previewPane.innerHTML = "";
    }

    function renderCategorySelects() {
      const options = categories
        .map((c) => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`)
        .join("");
      catFilter.innerHTML = `<option value="all">Todas las categorías</option>${options}`;
      modelCategory.innerHTML = `<option value="">Selecciona categoría</option>${options}`;
    }

    function renderCategoryTags() {
      if (!categories.length) {
        categoryTags.innerHTML = '<p class="admin-form-help">Sin categorías cargadas.</p>';
        return;
      }
      categoryTags.innerHTML = categories
        .map(
          (c) => `
        <span class="tradein-cat-tag">
          ${escapeHtml(c.name)}
          <button type="button" data-action="edit-category" data-id="${escapeHtml(c.id)}" title="Editar categoria">✎</button>
          <button type="button" data-action="delete-category" data-id="${escapeHtml(c.id)}" title="Eliminar categoria">×</button>
        </span>`
        )
        .join("");
    }

    function renderPreviewSelectors() {
      previewModel.innerHTML = modelRows
        .map((m) => `<option value="${m.id}">${m.categoryName} · ${m.name}</option>`)
        .join("");
      renderPreviewCapacities();
    }

    function renderPreviewCapacities() {
      const selected = modelRows.find((m) => m.id === previewModel.value);
      if (!selected) {
        previewCap.innerHTML = "";
        return;
      }
      const caps = selected.capacities && selected.capacities.length ? selected.capacities : [0];
      previewCap.innerHTML = caps
        .map((c) => {
          const label = c === 0 ? "Sin capacidad" : c >= 1024 ? `${c / 1024} TB` : `${c} GB`;
          return `<option value="${c}">${label}</option>`;
        })
        .join("");
    }

    function currentBase(model) {
      return Number(model.base) || 0;
    }

    function renderTradeInRows() {
      const term = search.value.trim().toLowerCase();
      const catVal = catFilter.value;
      const rows = modelRows.filter((row) => {
        const byTerm = !term || `${row.name} ${row.id}`.toLowerCase().includes(term);
        const byCat = catVal === "all" || row.categoryId === catVal;
        return byTerm && byCat;
      });

      tableBody.innerHTML = rows
        .map((row) => {
          const caps = row.capacities.length
            ? row.capacities
                .map((c) => (c >= 1024 ? `${c / 1024} TB` : `${c} GB`))
                .join(", ")
            : "N/A";
          return `
            <tr>
              <td>${row.categoryName}</td>
              <td><strong>${row.name}</strong></td>
              <td>${row.id}</td>
              <td>
                <input
                  class="admin-table-input"
                  type="number"
                  min="0"
                  step="1000"
                  data-model-base="${row.id}"
                  value="${currentBase(row)}"
                />
              </td>
              <td>${caps}</td>
              <td>
                <div class="admin-row-actions">
                  <button type="button" class="btn btn-outline btn-sm" data-action="edit-model" data-id="${escapeHtml(row.id)}">✎</button>
                  <button type="button" class="btn btn-outline btn-sm" data-action="preview-model" data-id="${escapeHtml(row.id)}">👁</button>
                  <button type="button" class="btn btn-outline btn-sm" data-action="delete-model" data-id="${escapeHtml(row.id)}">🗑</button>
                </div>
              </td>
            </tr>
          `;
        })
        .join("");
      if (!rows.length) {
        tableBody.innerHTML = `<tr><td colspan="6">Sin resultados con esos filtros.</td></tr>`;
      }
      renderPreviewSelectors();
    }

    function openModelPreview(model) {
      if (!model) return;
      const caps = model.capacities && model.capacities.length
        ? model.capacities.map((c) => (c >= 1024 ? `${c / 1024} TB` : `${c} GB`)).join(" · ")
        : "Sin capacidades";
      const img = model.img || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&q=80";
      previewPane.innerHTML = `
        <div class="inv-pr-top">
          <span class="pill pill--ok">${escapeHtml(model.categoryName)}</span>
          <span class="inv-pr-stock">ID: ${escapeHtml(model.id)}</span>
        </div>
        <img class="inv-pr-image" src="${escapeHtml(img)}" alt="" />
        <h4 class="inv-pr-title">${escapeHtml(model.name)}</h4>
        <p class="inv-pr-meta">Año ${escapeHtml(String(model.year || "-"))} · ${escapeHtml(caps)}</p>
        <div class="inv-pr-price">${formatClp(Number(model.base) || 0)}</div>
      `;
      previewModal.hidden = false;
    }

    function openEditModelModal(row) {
      modelModalTitle.textContent = "Editar modelo";
      modelEditOriginalId.value = row.id;
      modelCategory.value = row.categoryId;
      modelName.value = row.name || "";
      modelId.value = row.id || "";
      modelYear.value = row.year || "";
      modelBase.value = String(Number(row.base) || 0);
      modelCaps.value = Array.isArray(row.capacities) ? row.capacities.join(",") : "";
      modelImgFile.value = "";
      modelRemoveImg.checked = false;
      editingModelImageUrl = row.img || "";
      renderImagePreview(modelImgPreview, modelImgFile, editingModelImageUrl, false);
      modelModal.hidden = false;
      modelName.focus();
    }

    async function refreshTradeInData() {
      if (window.BP_SUPABASE) {
        const remote = await window.BP_SUPABASE.fetchTradeInData();
        if (remote && remote.categories) {
          data = {
            categories: remote.categories || [],
            models: remote.models || {},
          };
          if (remote.settings) {
            settings.incrementPerTier = remote.settings.incrementPerTier ?? DEFAULT_INCREMENT;
            settings.fixedDeduction = remote.settings.fixedDeduction ?? DEFAULT_DEDUCTION;
            settings.minPercentFloor = remote.settings.minPercentFloor ?? DEFAULT_FLOOR;
          }
        }
      } else if (!data) {
        data = window.TRADE_IN_DATA || null;
      }
      if (!data) return;
      categories = (data.categories || []).map((c) => ({
        id: c.id,
        name: c.name,
        img: c.img || "",
      }));
      modelRows = flattenTradeInModels(data);
      incrementInput.value = String(settings.incrementPerTier ?? DEFAULT_INCREMENT);
      deductionInput.value = String(settings.fixedDeduction ?? DEFAULT_DEDUCTION);
      floorInput.value = String(settings.minPercentFloor ?? DEFAULT_FLOOR);
      renderCategorySelects();
      renderCategoryTags();
      renderTradeInRows();
    }

    async function deleteCategory(categoryId) {
      const modelsInCategory = modelRows.filter((m) => m.categoryId === categoryId);
      if (modelsInCategory.length) {
        const okModels = window.confirm("Esta categoria tiene modelos. ¿Eliminar categoria y sus modelos?");
        if (!okModels) return;
      }
      try {
        if (window.BP_SUPABASE) {
          await Promise.all(modelsInCategory.map((m) => window.BP_SUPABASE.deleteTradeInModel(m.id)));
          const { error } = await window.BP_SUPABASE.deleteTradeInCategory(categoryId);
          if (error) throw error;
        }
        await refreshTradeInData();
        showToast("Categoria eliminada.");
      } catch (_) {
        showToast("No se pudo eliminar la categoria.", true);
      }
    }

    function readModelBaseOverridesFromTable() {
      const inputs = tableBody.querySelectorAll("input[data-model-base]");
      const patch = [];
      inputs.forEach((input) => {
        const modelId = input.getAttribute("data-model-base");
        const v = Number(input.value);
        if (!modelId || !Number.isFinite(v)) return;
        const current = modelRows.find((m) => m.id === modelId);
        if (!current) return;
        current.base = v;
        patch.push({ modelId, base: v });
      });
      return patch;
    }

    function calculateEstimate(modelId, capacity) {
      const model = modelRows.find((m) => m.id === modelId);
      if (!model) return null;
      const base = currentBase(model);
      const increment = Number(incrementInput.value) || DEFAULT_INCREMENT;
      const deduction = Number(deductionInput.value) || DEFAULT_DEDUCTION;
      const floor = Number(floorInput.value) || DEFAULT_FLOOR;
      let extra = 0;
      if (model.capacities.length && Number(capacity) > 0) {
        const idx = model.capacities.indexOf(Number(capacity));
        if (idx >= 0) extra = idx * increment;
      }
      const raw = base + extra - deduction;
      const min = Math.round(base * floor);
      return Math.max(raw, min);
    }

    search.addEventListener("input", renderTradeInRows);
    catFilter.addEventListener("change", renderTradeInRows);
    previewModel.addEventListener("change", renderPreviewCapacities);
    addModelBtn.addEventListener("click", () => {
      modelModalTitle.textContent = "Agregar modelo";
      modelForm.reset();
      modelEditOriginalId.value = "";
      modelRemoveImg.checked = false;
      editingModelImageUrl = "";
      renderImagePreview(modelImgPreview, modelImgFile, editingModelImageUrl, modelRemoveImg.checked);
      modelModal.hidden = false;
      modelName.focus();
    });
    addCategoryBtn.addEventListener("click", () => {
      categoryForm.reset();
      categoryEditOriginalId.value = "";
      categoryIdInput.readOnly = false;
      categoryRemoveImg.checked = false;
      editingCategoryImageUrl = "";
      renderImagePreview(categoryImgPreview, categoryImgFile, editingCategoryImageUrl, categoryRemoveImg.checked);
      categoryModal.hidden = false;
      categoryNameInput.focus();
    });
    modelCancelBtn.addEventListener("click", closeModelModal);
    categoryCancelBtn.addEventListener("click", closeCategoryModal);
    previewCloseBtn.addEventListener("click", closePreviewModal);
    modelModal.addEventListener("click", (e) => {
      if (e.target && e.target.hasAttribute("data-close-tradein-model-modal")) closeModelModal();
    });
    categoryModal.addEventListener("click", (e) => {
      if (e.target && e.target.hasAttribute("data-close-tradein-category-modal")) closeCategoryModal();
    });
    previewModal.addEventListener("click", (e) => {
      if (e.target && e.target.hasAttribute("data-close-tradein-preview-modal")) closePreviewModal();
    });
    modelImgFile.addEventListener("change", () => {
      modelRemoveImg.checked = false;
      renderImagePreview(modelImgPreview, modelImgFile, editingModelImageUrl, false);
    });
    categoryImgFile.addEventListener("change", () => {
      categoryRemoveImg.checked = false;
      renderImagePreview(categoryImgPreview, categoryImgFile, editingCategoryImageUrl, false);
    });
    modelRemoveImg.addEventListener("change", () => {
      renderImagePreview(modelImgPreview, modelImgFile, editingModelImageUrl, modelRemoveImg.checked);
    });
    categoryRemoveImg.addEventListener("change", () => {
      renderImagePreview(categoryImgPreview, categoryImgFile, editingCategoryImageUrl, categoryRemoveImg.checked);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modelModal.hidden) closeModelModal();
      if (e.key === "Escape" && !categoryModal.hidden) closeCategoryModal();
      if (e.key === "Escape" && !previewModal.hidden) closePreviewModal();
    });

    categoryTags.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action][data-id]");
      if (!btn) return;
      const action = btn.getAttribute("data-action");
      const categoryId = btn.getAttribute("data-id");
      if (!categoryId) return;
      const cat = categories.find((c) => c.id === categoryId);
      if (!cat) return;
      if (action === "edit-category") {
        categoryEditOriginalId.value = cat.id;
        categoryIdInput.value = cat.id;
        categoryIdInput.readOnly = true;
        categoryNameInput.value = cat.name || "";
        categoryImgFile.value = "";
        categoryRemoveImg.checked = false;
        editingCategoryImageUrl = cat.img || "";
        renderImagePreview(categoryImgPreview, categoryImgFile, editingCategoryImageUrl, false);
        categoryModal.hidden = false;
        categoryNameInput.focus();
        return;
      }
      if (action === "delete-category") deleteCategory(categoryId);
    });

    modelForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const isEdit = Boolean(modelEditOriginalId.value);
      const originalId = modelEditOriginalId.value;
      const catId = modelCategory.value;
      const cat = categories.find((c) => c.id === catId);
      const name = modelName.value.trim();
      const id = slugify(modelId.value) || slugify(name);
      const base = Number(modelBase.value);
      const year = Number(modelYear.value) || null;
      const capacities = modelCaps.value
        .split(",")
        .map((v) => Number(String(v).trim()))
        .filter((v) => Number.isFinite(v) && v >= 0);
      const imgFile = modelImgFile.files && modelImgFile.files[0];
      const removeImage = Boolean(modelRemoveImg.checked);
      if (!catId || !cat || !name || !id || !Number.isFinite(base)) {
        showToast("Completa los campos requeridos del modelo.", true);
        return;
      }
      if (modelRows.some((m) => m.id === id && (!isEdit || m.id !== originalId))) {
        showToast("Ya existe un modelo con ese ID.", true);
        return;
      }
      try {
        let nextImgUrl = editingModelImageUrl || null;
        if (imgFile && window.BP_SUPABASE) {
          nextImgUrl = await window.BP_SUPABASE.uploadTradeInImage(imgFile, "models");
        } else if (removeImage) {
          nextImgUrl = null;
        }
        if (window.BP_SUPABASE) {
          const payload = {
            category_id: catId,
            name,
            year,
            base: Math.max(0, base),
            img_url: nextImgUrl,
            capacities,
            active: true,
          };
          let error = null;
          if (isEdit) {
            if (id !== originalId) {
              const { error: createErr } = await window.BP_SUPABASE.createTradeInModel({
                id,
                ...payload,
              });
              if (createErr) throw createErr;
              const { error: delErr } = await window.BP_SUPABASE.deleteTradeInModel(originalId);
              if (delErr) throw delErr;
            } else {
              ({ error } = await window.BP_SUPABASE.updateTradeInModel(id, payload));
            }
          } else {
            ({ error } = await window.BP_SUPABASE.createTradeInModel({
              id,
              ...payload,
            }));
          }
          if (error) throw error;
        } else {
          if (!data.models[catId]) data.models[catId] = [];
          if (isEdit) {
            Object.keys(data.models).forEach((k) => {
              data.models[k] = (data.models[k] || []).filter((m) => m.id !== originalId);
            });
          }
          data.models[catId].push({
            id,
            name,
            year,
            base: Math.max(0, base),
            img: nextImgUrl,
            capacities,
          });
        }
        await refreshTradeInData();
        closeModelModal();
        showToast(isEdit ? "Modelo actualizado correctamente." : "Modelo agregado correctamente.");
      } catch (_) {
        showToast(isEdit ? "No se pudo actualizar el modelo." : "No se pudo agregar el modelo.", true);
      }
    });

    categoryForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const isEdit = Boolean(categoryEditOriginalId.value);
      const originalId = categoryEditOriginalId.value;
      const id = slugify(categoryIdInput.value) || slugify(categoryNameInput.value);
      const name = categoryNameInput.value.trim();
      const imgFile = categoryImgFile.files && categoryImgFile.files[0];
      const removeImage = Boolean(categoryRemoveImg.checked);
      if (!id || !name) {
        showToast("Completa ID y nombre de categoría.", true);
        return;
      }
      if (categories.some((c) => c.id === id && (!isEdit || c.id !== originalId))) {
        showToast("Ya existe una categoría con ese ID.", true);
        return;
      }
      try {
        let nextImgUrl = editingCategoryImageUrl || null;
        if (imgFile && window.BP_SUPABASE) {
          nextImgUrl = await window.BP_SUPABASE.uploadTradeInImage(imgFile, "categories");
        } else if (removeImage) {
          nextImgUrl = null;
        }
        if (window.BP_SUPABASE) {
          let error = null;
          if (isEdit) {
            ({ error } = await window.BP_SUPABASE.updateTradeInCategory(originalId, {
              name,
              img_url: nextImgUrl,
              active: true,
            }));
          } else {
            ({ error } = await window.BP_SUPABASE.createTradeInCategory({
              id,
              name,
              img_url: nextImgUrl,
              active: true,
            }));
          }
          if (error) throw error;
        } else {
          if (isEdit) {
            data.categories = data.categories.map((c) =>
              c.id === originalId ? { ...c, name, img: nextImgUrl } : c
            );
          } else {
            data.categories.push({ id, name, img: nextImgUrl });
            data.models[id] = data.models[id] || [];
          }
        }
        await refreshTradeInData();
        closeCategoryModal();
        showToast(isEdit ? "Categoría actualizada correctamente." : "Categoría agregada correctamente.");
      } catch (_) {
        showToast(isEdit ? "No se pudo actualizar la categoría." : "No se pudo agregar la categoría.", true);
      }
    });

    tableBody.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action][data-id]");
      if (!btn) return;
      const action = btn.getAttribute("data-action");
      const id = btn.getAttribute("data-id");
      const row = modelRows.find((m) => m.id === id);
      if (!row) return;
      if (action === "edit-model") {
        openEditModelModal(row);
        return;
      }
      if (action === "preview-model") {
        openModelPreview(row);
        return;
      }
      if (action === "delete-model") {
        (async () => {
          const ok = window.confirm(`¿Eliminar modelo "${row.name}"?`);
          if (!ok) return;
          try {
            if (window.BP_SUPABASE) {
              const { error } = await window.BP_SUPABASE.deleteTradeInModel(row.id);
              if (error) throw error;
            } else {
              data.models[row.categoryId] = (data.models[row.categoryId] || []).filter((m) => m.id !== row.id);
            }
            await refreshTradeInData();
            showToast("Modelo eliminado.");
          } catch (_) {
            showToast("No se pudo eliminar el modelo.", true);
          }
        })();
      }
    });

    previewBtn.addEventListener("click", () => {
      readModelBaseOverridesFromTable();
      const value = calculateEstimate(previewModel.value, previewCap.value);
      if (value == null) {
        previewResult.textContent = "No se pudo calcular la tasación.";
        return;
      }
      previewResult.textContent = `Estimación de recepción: ${formatClp(value)}.`;
    });

    saveBtn.addEventListener("click", async () => {
      const modelUpdates = readModelBaseOverridesFromTable();
      settings.incrementPerTier = Math.max(0, Number(incrementInput.value) || DEFAULT_INCREMENT);
      settings.fixedDeduction = Math.max(0, Number(deductionInput.value) || DEFAULT_DEDUCTION);
      const floor = Number(floorInput.value);
      settings.minPercentFloor = Number.isFinite(floor)
        ? Math.min(1, Math.max(0.1, floor))
        : DEFAULT_FLOOR;
      try {
        if (window.BP_SUPABASE) {
          const settingsPayload = {
            increment_per_tier: settings.incrementPerTier,
            fixed_deduction: settings.fixedDeduction,
            min_percent_floor: settings.minPercentFloor,
          };
          const { error: settingsErr } = await window.BP_SUPABASE.saveTradeInSettings(settingsPayload);
          if (settingsErr) throw settingsErr;
          await Promise.all(modelUpdates.map((u) => window.BP_SUPABASE.saveTradeInModelBase(u.modelId, u.base)));
        } else {
          writeTradeInSettings(settings);
        }
        showToast("Precios de recepcion guardados. Se aplican en Vende tu equipo.");
      } catch (_) {
        showToast("No se pudo guardar la configuracion de trade-in.", true);
      }
    });

    resetBtn.addEventListener("click", async () => {
      settings.incrementPerTier = DEFAULT_INCREMENT;
      settings.fixedDeduction = DEFAULT_DEDUCTION;
      settings.minPercentFloor = DEFAULT_FLOOR;
      modelRows.forEach((m) => {
        const source = (((window.TRADE_IN_DATA || {}).models || {})[m.categoryId] || []).find(
          (x) => x.id === m.id
        );
        if (source) m.base = source.base;
      });
      incrementInput.value = String(DEFAULT_INCREMENT);
      deductionInput.value = String(DEFAULT_DEDUCTION);
      floorInput.value = String(DEFAULT_FLOOR);
      try {
        if (window.BP_SUPABASE) {
          await window.BP_SUPABASE.saveTradeInSettings({
            increment_per_tier: DEFAULT_INCREMENT,
            fixed_deduction: DEFAULT_DEDUCTION,
            min_percent_floor: DEFAULT_FLOOR,
          });
          await Promise.all(
            modelRows.map((m) => window.BP_SUPABASE.saveTradeInModelBase(m.id, Number(m.base) || 0))
          );
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (_) {}
      renderTradeInRows();
      showToast("Configuración restablecida a valores por defecto.");
    });

    try {
      if (window.BP_SUPABASE) {
        await refreshTradeInData();
      } else {
        const localSettings = readTradeInSettings();
        if (localSettings) {
          settings.incrementPerTier = localSettings.incrementPerTier ?? DEFAULT_INCREMENT;
          settings.fixedDeduction = localSettings.fixedDeduction ?? DEFAULT_DEDUCTION;
          settings.minPercentFloor = localSettings.minPercentFloor ?? DEFAULT_FLOOR;
        }
        if (!data) return;
        categories = (data.categories || []).map((c) => ({ id: c.id, name: c.name, img: c.img || "" }));
        modelRows = flattenTradeInModels(data);
        renderCategorySelects();
        renderCategoryTags();
        renderTradeInRows();
      }
    } catch (_) {
      showToast("No se pudo cargar el módulo de Vende tu equipo.", true);
    }
  }

  function initWebAssetsModule() {
    const gallery = document.getElementById("assetsGallery");
    const emptyState = document.getElementById("assetsEmpty");
    const addBtn = document.getElementById("assetAddBtn");
    const refreshBtn = document.getElementById("assetRefreshBtn");
    const form = document.getElementById("assetUploadForm");
    const modal = document.getElementById("assetUploadModal");
    const cancelBtn = document.getElementById("assetCancelBtn");
    const adjustModal = document.getElementById("assetAdjustModal");
    const adjustCloseBtn = document.getElementById("assetAdjustCloseBtn");
    const adjustSaveBtn = document.getElementById("assetAdjustSaveBtn");
    const adjustStage = document.getElementById("assetAdjustStage");
    const adjustScaleRange = document.getElementById("assetScaleRange");
    const adjustScaleValue = document.getElementById("assetScaleValue");
    const adjustTitle = document.getElementById("assetAdjustTitle");
    const filterTabs = Array.from(document.querySelectorAll(".asset-filter-tab"));
    if (!gallery || !emptyState || !addBtn || !form || !cancelBtn || !modal || !window.BP_SUPABASE) return;

    const fields = {
      type: document.getElementById("assetType"),
      title: document.getElementById("assetTitle"),
      key: document.getElementById("assetKey"),
      files: document.getElementById("assetFiles"),
      active: document.getElementById("assetActive"),
    };
    const queueList = document.getElementById("assetQueueList");
    if (Object.values(fields).some((el) => !el)) return;

    let assets = [];
    let queue = [];
    let activeFilter = "all";
    let editingAsset = null;
    let editingScale = 100;

    function clearQueue() {
      queue.forEach((q) => {
        if (q.previewUrl) URL.revokeObjectURL(q.previewUrl);
      });
      queue = [];
    }

    function clearForm() {
      clearQueue();
      form.reset();
      fields.active.checked = true;
      renderQueue();
    }

    function openForm() {
      clearForm();
      modal.hidden = false;
      fields.type.focus();
    }

    function closeForm() {
      modal.hidden = true;
      clearForm();
    }

    function currentRows() {
      return assets.filter((a) => activeFilter === "all" || a.asset_type === activeFilter);
    }

    function closeAdjustModal() {
      if (!adjustModal) return;
      adjustModal.hidden = true;
      editingAsset = null;
      editingScale = 100;
      if (adjustScaleRange) adjustScaleRange.value = "100";
      if (adjustScaleValue) adjustScaleValue.textContent = "100%";
    }

    function renderAdjustPreview() {
      if (!adjustStage || !editingAsset) return;
      adjustStage.setAttribute("data-type", editingAsset.asset_type || "banner");
      adjustStage.style.backgroundImage = `url("${String(editingAsset.image_url || "").replace(/"/g, '\\"')}")`;
      if ((editingAsset.asset_type || "") === "logo") {
        const normalized = Math.max(40, Math.round(editingScale * 0.8));
        adjustStage.style.backgroundSize = `${normalized}% auto`;
      } else {
        adjustStage.style.backgroundSize = `${editingScale}%`;
      }
      if (adjustScaleValue) adjustScaleValue.textContent = `${editingScale}%`;
      if (adjustTitle) {
        adjustTitle.textContent = `Ajusta el zoom de "${editingAsset.title || "Imagen"}" para ver como se mostrara en la web.`;
      }
    }

    function openAdjustModal(asset) {
      if (!asset || !adjustModal) return;
      editingAsset = asset;
      editingScale = 100;
      if (adjustScaleRange) adjustScaleRange.value = "100";
      renderAdjustPreview();
      adjustModal.hidden = false;
    }

    function loadImageElement(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("image_load_failed"));
        img.src = src;
      });
    }

    async function renderScaledImageBlob(imageUrl, type, scalePercent) {
      const img = await loadImageElement(imageUrl);
      const sizeMap = {
        banner: { w: 1600, h: 700 },
        logo: { w: 900, h: 320 },
        icon: { w: 512, h: 512 },
      };
      const target = sizeMap[type] || sizeMap.banner;
      const canvas = document.createElement("canvas");
      canvas.width = target.w;
      canvas.height = target.h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas_unavailable");
      const scale = Math.max(target.w / img.width, target.h / img.height) * (Number(scalePercent) / 100);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const x = (target.w - drawW) / 2;
      const y = (target.h - drawH) / 2;
      ctx.clearRect(0, 0, target.w, target.h);
      ctx.drawImage(img, x, y, drawW, drawH);
      const mime = type === "logo" ? "image/png" : "image/jpeg";
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, mime, 0.92));
      if (!blob) throw new Error("blob_failed");
      return blob;
    }

    function renderQueue() {
      if (!queueList) return;
      if (!queue.length) {
        queueList.innerHTML = '<p class="admin-form-help">No hay imagenes en cola.</p>';
        return;
      }
      queueList.innerHTML = queue
        .map(
          (item, idx) => `
          <div class="asset-queue-item" data-idx="${idx}">
            <span class="asset-order-badge">#${idx + 1}</span>
            <img src="${escapeHtml(item.previewUrl)}" alt="" />
            <div class="asset-queue-meta">
              <strong>${escapeHtml(item.file.name)}</strong>
              <span>${Math.round(item.file.size / 1024)} KB</span>
            </div>
            <div class="asset-queue-actions">
              <button type="button" class="btn btn-outline btn-sm" data-action="up">↑</button>
              <button type="button" class="btn btn-outline btn-sm" data-action="down">↓</button>
              <button type="button" class="btn btn-outline btn-sm" data-action="remove">Quitar</button>
            </div>
          </div>`
        )
        .join("");
    }

    function renderGallery() {
      const rows = currentRows();
      if (!rows.length) {
        gallery.innerHTML = "";
        emptyState.hidden = false;
        return;
      }
      emptyState.hidden = true;
      gallery.innerHTML = rows
        .map(
          (a) => `
          <article class="asset-card">
            <div class="asset-card-image-wrap">
              <img src="${escapeHtml(a.image_url)}" alt="" class="asset-card-image" />
            </div>
            <div class="asset-card-body">
              <p class="asset-card-title">${escapeHtml(a.title || "Sin titulo")}</p>
              <p class="asset-card-meta">${escapeHtml(a.asset_type)}${a.asset_key ? ` · ${escapeHtml(a.asset_key)}` : ""}</p>
              <div class="asset-card-foot">
                <span class="asset-order-badge">#${Number(a.sort_order) || 0}</span>
                <span class="pill ${a.is_active ? "pill--ok" : "pill--warn"}">${a.is_active ? "Activo" : "Inactivo"}</span>
              </div>
              <div class="asset-card-actions">
                <button type="button" class="btn btn-outline btn-sm" data-action="adjust" data-id="${a.id}">Vista</button>
                <button type="button" class="btn btn-outline btn-sm" data-action="up" data-id="${a.id}">↑</button>
                <button type="button" class="btn btn-outline btn-sm" data-action="down" data-id="${a.id}">↓</button>
                <button type="button" class="btn btn-outline btn-sm" data-action="toggle" data-id="${a.id}">${a.is_active ? "Desactivar" : "Activar"}</button>
                <button type="button" class="btn btn-outline btn-sm" data-action="delete" data-id="${a.id}">Eliminar</button>
              </div>
            </div>
          </article>`
        )
        .join("");
    }

    async function loadAssets() {
      const list = await window.BP_SUPABASE.fetchAdminSiteAssets();
      assets = (list || []).slice().sort((a, b) => {
        if (a.asset_type !== b.asset_type) return String(a.asset_type).localeCompare(String(b.asset_type));
        return Number(a.sort_order || 0) - Number(b.sort_order || 0);
      });
      renderGallery();
    }

    async function reorderAsset(asset, direction) {
      const sameType = assets
        .filter((a) => a.asset_type === asset.asset_type)
        .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
      const idx = sameType.findIndex((a) => a.id === asset.id);
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (idx < 0 || swapIdx < 0 || swapIdx >= sameType.length) return;
      const target = sameType[swapIdx];
      const currentOrder = Number(asset.sort_order) || 0;
      const targetOrder = Number(target.sort_order) || 0;
      const [r1, r2] = await Promise.all([
        window.BP_SUPABASE.updateSiteAsset(asset.id, { sort_order: targetOrder }),
        window.BP_SUPABASE.updateSiteAsset(target.id, { sort_order: currentOrder }),
      ]);
      if (r1.error || r2.error) throw new Error("reorder_failed");
    }

    addBtn.addEventListener("click", openForm);
    if (refreshBtn) refreshBtn.addEventListener("click", () => loadAssets().catch(() => {}));
    cancelBtn.addEventListener("click", closeForm);
    modal.addEventListener("click", (e) => {
      if (e.target && e.target.hasAttribute("data-close-asset-modal")) closeForm();
    });
    if (adjustModal) {
      adjustModal.addEventListener("click", (e) => {
        if (e.target && e.target.hasAttribute("data-close-asset-adjust")) closeAdjustModal();
      });
    }
    if (adjustCloseBtn) adjustCloseBtn.addEventListener("click", closeAdjustModal);
    if (adjustScaleRange) {
      adjustScaleRange.addEventListener("input", () => {
        editingScale = Number(adjustScaleRange.value) || 100;
        renderAdjustPreview();
      });
    }
    if (adjustSaveBtn) {
      adjustSaveBtn.addEventListener("click", async () => {
        if (!editingAsset) return;
        try {
          const blob = await renderScaledImageBlob(editingAsset.image_url, editingAsset.asset_type, editingScale);
          const ext = editingAsset.asset_type === "logo" ? "png" : "jpg";
          const file = new File([blob], `asset-adjust-${Date.now()}.${ext}`, { type: blob.type });
          const newUrl = await window.BP_SUPABASE.uploadSiteAsset(file, editingAsset.asset_type);
          const { error } = await window.BP_SUPABASE.updateSiteAsset(editingAsset.id, { image_url: newUrl });
          if (error) throw error;
          await loadAssets();
          closeAdjustModal();
          showToast("Ajuste aplicado correctamente.");
        } catch (_) {
          showToast("No se pudo aplicar el ajuste de imagen.", true);
        }
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeForm();
      if (e.key === "Escape" && adjustModal && !adjustModal.hidden) closeAdjustModal();
    });
    filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        activeFilter = tab.getAttribute("data-asset-filter") || "all";
        filterTabs.forEach((t) => t.classList.toggle("is-active", t === tab));
        renderGallery();
      });
    });

    fields.files.addEventListener("change", () => {
      const files = Array.from(fields.files.files || []);
      if (!files.length) return;
      const items = files.map((file, i) => ({
        id: `${Date.now()}-${i}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      queue = queue.concat(items);
      fields.files.value = "";
      renderQueue();
    });

    if (queueList) {
      queueList.addEventListener("click", (e) => {
        const row = e.target.closest(".asset-queue-item");
        const btn = e.target.closest("button[data-action]");
        if (!row || !btn) return;
        const idx = Number(row.getAttribute("data-idx"));
        if (!Number.isFinite(idx) || !queue[idx]) return;
        const action = btn.getAttribute("data-action");
        if (action === "remove") {
          if (queue[idx].previewUrl) URL.revokeObjectURL(queue[idx].previewUrl);
          queue = queue.filter((_, i) => i !== idx);
        } else if (action === "up" && idx > 0) {
          [queue[idx - 1], queue[idx]] = [queue[idx], queue[idx - 1]];
        } else if (action === "down" && idx < queue.length - 1) {
          [queue[idx + 1], queue[idx]] = [queue[idx], queue[idx + 1]];
        }
        renderQueue();
      });
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const type = fields.type.value;
      const title = fields.title.value.trim();
      const key = fields.key.value.trim() || null;
      const isActive = Boolean(fields.active.checked);
      if (!type || !title) {
        showToast("Completa tipo y titulo.", true);
        return;
      }
      if (type === "icon" && !key) {
        showToast("Para icono debes indicar una clave.", true);
        return;
      }
      if (!queue.length) {
        showToast("Debes agregar al menos una imagen.", true);
        return;
      }
      if (type === "icon" && queue.length > 1) {
        showToast("Para iconos, sube una imagen por vez.", true);
        return;
      }
      try {
        const sameType = assets.filter((a) => a.asset_type === type);
        let nextOrder = sameType.length
          ? Math.max(...sameType.map((a) => Number(a.sort_order) || 0)) + 1
          : 0;
        for (let i = 0; i < queue.length; i += 1) {
          const item = queue[i];
          const imageUrl = await window.BP_SUPABASE.uploadSiteAsset(item.file, type);
          const payload = {
            asset_type: type,
            asset_key: type === "icon" ? key : null,
            title: queue.length > 1 ? `${title} ${i + 1}` : title,
            image_url: imageUrl,
            sort_order: nextOrder,
            is_active: isActive,
          };
          const { error } = await window.BP_SUPABASE.createSiteAsset(payload);
          if (error) throw error;
          nextOrder += 1;
        }
        await loadAssets();
        closeForm();
        showToast("Imagenes guardadas correctamente.");
      } catch (_) {
        showToast("No se pudieron guardar las imagenes.", true);
      }
    });

    gallery.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action][data-id]");
      if (!btn) return;
      const action = btn.getAttribute("data-action");
      const id = btn.getAttribute("data-id");
      const asset = assets.find((a) => a.id === id);
      if (!asset) return;
      if (action === "adjust") {
        openAdjustModal(asset);
        return;
      }
      if (action === "up" || action === "down") {
        (async () => {
          try {
            await reorderAsset(asset, action);
            await loadAssets();
            showToast("Orden actualizado.");
          } catch (_) {
            showToast("No se pudo cambiar el orden.", true);
          }
        })();
        return;
      }
      if (action === "toggle") {
        (async () => {
          const { error } = await window.BP_SUPABASE.updateSiteAsset(asset.id, {
            is_active: !asset.is_active,
          });
          if (error) {
            showToast("No se pudo cambiar estado.", true);
            return;
          }
          await loadAssets();
          showToast("Estado actualizado.");
        })();
        return;
      }
      if (action === "delete") {
        (async () => {
          const ok = window.confirm(`Eliminar asset "${asset.title}"?`);
          if (!ok) return;
          const { error } = await window.BP_SUPABASE.deleteSiteAsset(asset.id);
          if (error) {
            showToast("No se pudo eliminar asset.", true);
            return;
          }
          await loadAssets();
          showToast("Imagen eliminada.");
        })();
      }
    });

    loadAssets().catch(() => {
      gallery.innerHTML = "";
      emptyState.hidden = false;
      emptyState.textContent = "No se pudo cargar imagenes (revisa tabla site_assets).";
    });
  }

  function initAssistantModule() {
    const chat = document.getElementById("adminAiChat");
    const form = document.getElementById("adminAiForm");
    const input = document.getElementById("adminAiInput");
    const suggestions = document.getElementById("adminAiSuggestions");
    if (!chat || !form || !input) return;

    function appendMsg(role, text) {
      const div = document.createElement("div");
      div.className = `admin-ai-msg admin-ai-msg--${role}`;
      div.textContent = text;
      chat.appendChild(div);
      chat.scrollTop = chat.scrollHeight;
    }

    function extractImei(text) {
      const m = String(text).match(/\b\d{15}\b/);
      return m ? m[0] : null;
    }

    function stripImei(text) {
      return String(text).replace(/\b\d{15}\b/g, " ").trim();
    }

    async function assistantSummary(supa) {
      const { data, error } = await supa.client.from("products").select("title, stock, price, published");
      if (error) return "No se pudo leer el inventario.";
      const rows = data || [];
      const n = rows.length;
      const units = rows.reduce((s, r) => s + (Number(r.stock) || 0), 0);
      const value = rows.reduce((s, r) => s + (Number(r.stock) || 0) * (Number(r.price) || 0), 0);
      const pub = rows.filter((r) => r.published).length;
      return `Resumen de inventario:\n• Productos (filas): ${n}\n• Unidades en stock (suma): ${units}\n• Publicados: ${pub}\n• Valor aproximado (precio × stock): ${formatClp(value)}`;
    }

    async function assistantSalesMonth(supa) {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      const { data, error } = await supa.client
        .from("orders")
        .select("id, status, total_amount, created_at, customer_email")
        .gte("created_at", start.toISOString())
        .order("created_at", { ascending: false })
        .limit(80);
      if (error) return "No se pudieron cargar pedidos (¿migración SQL de RLS?).";
      const rows = data || [];
      const sum = rows.reduce((s, o) => s + (Number(o.total_amount) || 0), 0);
      return `Pedidos creados en ${start.toLocaleDateString("es-CL", { month: "long", year: "numeric" })}: ${rows.length}.\nSuma de total_amount (todos los estados listados): ${formatClp(sum)}\n\nÚltimos 5:\n${rows
        .slice(0, 5)
        .map(
          (o) =>
            `• ${formatDateTime(o.created_at)} · ${orderStatusLabel(o.status)} · ${formatClp(
              Number(o.total_amount) || 0
            )} · ${o.customer_email || "—"}`
        )
        .join("\n")}`;
    }

    async function assistantRecentOrders(supa) {
      const { data, error } = await supa.client
        .from("orders")
        .select("id, status, total_amount, created_at, customer_email")
        .order("created_at", { ascending: false })
        .limit(12);
      if (error) return "No se pudieron cargar pedidos.";
      const rows = data || [];
      if (!rows.length) return "No hay pedidos registrados todavía.";
      return `Últimos pedidos:\n${rows
        .map(
          (o) =>
            `• ${formatDateTime(o.created_at)} · ${orderStatusLabel(o.status)} · ${formatClp(
              Number(o.total_amount) || 0
            )} · ${o.customer_email || "sin email"}`
        )
        .join("\n")}`;
    }

    async function assistantLowStock(supa) {
      const th = readPanelSettings().lowStockThreshold;
      const { data, error } = await supa.client.from("products").select("title, stock, published").eq("published", true);
      if (error) return "No se pudo leer inventario.";
      const rows = (data || []).filter((r) => {
        const st = Number(r.stock) || 0;
        return st === 0 || st <= th;
      });
      if (!rows.length) return `No hay productos publicados con stock 0 o ≤ ${th} (umbral).`;
      return `Productos publicados con stock bajo (≤ ${th}) o 0:\n${rows
        .slice(0, 15)
        .map((r) => `• ${r.title} — stock ${Number(r.stock) || 0}`)
        .join("\n")}${rows.length > 15 ? `\n… y ${rows.length - 15} más` : ""}`;
    }

    async function assistantImeiProduct(supa, row) {
      const p = supa.mapProductRow(row);
      const bits = [
        `${p.title}`,
        `IMEI: ${p.imei || "—"}`,
        `Stock actual: ${Number(p.stock) || 0}`,
        `${p.published ? "Publicado en tienda" : "No publicado"}`,
        `Precio desde lista: ${formatClp(Number(p.price) || 0)}`,
      ];
      return bits.join("\n");
    }

    async function assistantImeiSales(supa, row) {
      const { data: lines, error } = await supa.client
        .from("order_items")
        .select("quantity, unit_price, order_id")
        .eq("product_id", row.id);
      if (error) return "No se pudieron leer líneas de pedido para este producto.";
      const items = lines || [];
      if (!items.length) {
        const p = supa.mapProductRow(row);
        return `${await assistantImeiProduct(supa, row)}\n\nNo hay líneas en order_items para este producto; si el stock es > 0, aún no se registró venta por ese canal.`;
      }
      const orderIds = [...new Set(items.map((i) => i.order_id))];
      const { data: ords } = await supa.client.from("orders").select("*").in("id", orderIds);
      const omap = Object.fromEntries((ords || []).map((o) => [o.id, o]));
      const merged = items
        .map((it) => ({ ...it, order: omap[it.order_id] }))
        .filter((x) => x.order);
      const paid = merged.filter(
        (x) => x.order && ["paid", "shipped"].includes(x.order.status)
      );
      paid.sort((a, b) => new Date(b.order.created_at) - new Date(a.order.created_at));
      const p = supa.mapProductRow(row);
      if (!paid.length) {
        return `${await assistantImeiProduct(supa, row)}\n\nHay pedidos con líneas a este producto, pero ninguno en estado pagado o enviado todavía.`;
      }
      const last = paid[0];
      const o = last.order;
      return `Venta registrada para «${p.title}» (IMEI ${p.imei || "—"}):\n• Precio unitario en línea: ${formatClp(
        Number(last.unit_price) || 0
      )}\n• Cantidad: ${last.quantity}\n• Estado pedido: ${orderStatusLabel(o.status)}\n• Cliente: ${o.customer_email || "—"}\n• Fecha pedido: ${formatDateTime(o.created_at)}${
        o.paid_at ? `\n• Pagado: ${formatDateTime(o.paid_at)}` : ""
      }\n\nStock actual del producto: ${Number(p.stock) || 0}.`;
    }

    async function assistantSearchProducts(supa, term) {
      const { data, error } = await supa.client
        .from("products")
        .select("title, stock, price, imei, published")
        .ilike("title", `%${term}%`)
        .limit(10);
      if (error) return "Error al buscar por nombre.";
      const rows = data || [];
      if (!rows.length) return `No encontré productos cuyo título contenga "${term}".`;
      return `Coincidencias:\n${rows
        .map(
          (r) =>
            `• ${r.title}\n  stock ${Number(r.stock) || 0} · ${formatClp(Number(r.price) || 0)} · ${
              r.published ? "publicado" : "no publicado"
            }${r.imei ? ` · IMEI ${r.imei}` : ""}`
        )
        .join("\n\n")}`;
    }

    async function runAssistantQuery(q) {
      const raw = q.trim();
      if (!raw) return "Escribí una pregunta.";
      const supa = window.BP_SUPABASE;
      if (!supa) return "Supabase no está disponible en esta página.";

      const n = raw.toLowerCase();
      const imei = extractImei(raw);

      if (imei) {
        const { data: row, error } = await supa.client.from("products").select("*").eq("imei", imei).maybeSingle();
        if (error) return "Error al consultar por IMEI.";
        if (!row) {
          return `No hay producto con IMEI ${imei}. Verificá los 15 dígitos o que el equipo esté cargado en inventario.`;
        }
        const saleIntent = /vend|venta|precio|pagad|orden|pedido|compr|factur/.test(n);
        if (saleIntent) return assistantImeiSales(supa, row);
        return assistantImeiProduct(supa, row);
      }

      if (/resumen|cuántos productos|inventario total|stock total|cuántas unidades/i.test(raw)) {
        return assistantSummary(supa);
      }
      if (/ventas.*mes|este mes|mes actual|ventas del mes/i.test(raw)) {
        return assistantSalesMonth(supa);
      }
      if (/últimos pedidos|pedidos recientes|lista de pedidos/i.test(raw)) {
        return assistantRecentOrders(supa);
      }
      if (/poco stock|stock bajo|alerta|umbral/i.test(raw)) {
        return assistantLowStock(supa);
      }

      const cleaned = stripImei(raw);
      const words = cleaned
        .replace(/[^a-zA-Z0-9áéíóúñüÁÉÍÓÚÑÜ\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2);
      if (words.length) {
        const term = words.slice(0, 5).join(" ");
        return assistantSearchProducts(supa, term);
      }

      return "Podés:\n• Pegar un IMEI de 15 dígitos (y opcionalmente preguntar si se vendió).\n• Pedir resumen de inventario, ventas del mes, últimos pedidos o stock bajo.\n• Escribir parte del nombre del producto (ej. iPhone 14).";
    }

    async function callAssistantEdge(q) {
      const supa = window.BP_SUPABASE;
      if (!supa?.SUPABASE_URL || !supa?.SUPABASE_ANON_KEY || !supa.client) {
        const err = new Error("no_supabase_config");
        err.code = "no_config";
        throw err;
      }
      await supa.client.auth.refreshSession().catch(() => {});
      const {
        data: { session },
      } = await supa.client.auth.getSession();
      if (!session?.access_token) {
        const err = new Error("no_session");
        err.code = "no_session";
        throw err;
      }
      const res = await fetch(`${supa.SUPABASE_URL}/functions/v1/assistant-query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          apikey: supa.SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ message: q }),
      });
      const rawText = await res.text();
      let json = {};
      try {
        json = rawText ? JSON.parse(rawText) : {};
      } catch (_) {
        json = { _raw: rawText.slice(0, 280) };
      }
      if (!res.ok) {
        const hint =
          json.error ||
          json.msg ||
          json.message ||
          json.hint ||
          (json._raw ? `respuesta_no_json: ${json._raw}` : null) ||
          rawText.slice(0, 200) ||
          res.statusText;
        const err = new Error(hint || `HTTP ${res.status}`);
        err.code = json.error || json.code;
        err.detail = json.detail;
        err.status = res.status;
        if (json.count != null) err.count = json.count;
        if (json.max != null) err.max = json.max;
        throw err;
      }
      const ans = json.answer;
      if (typeof ans !== "string" || !ans.trim()) {
        const err = new Error("empty_answer");
        err.code = "empty_answer";
        throw err;
      }
      return { answer: ans.trim(), assistant_usage: json.assistant_usage || null };
    }

    async function refreshAssistantUsageFromDb() {
      const hintEl = document.getElementById("adminAiUsageHint");
      if (!hintEl || window.__adminUserRole !== "admin" || !window.BP_SUPABASE) return;
      const day = new Date().toISOString().slice(0, 10);
      try {
        const { data, error } = await window.BP_SUPABASE.client
          .from("assistant_usage_daily")
          .select("request_count")
          .eq("day", day)
          .maybeSingle();
        if (error) return;
        const n = Number(data?.request_count) || 0;
        hintEl.hidden = false;
        hintEl.textContent = `Consultas IA registradas hoy (UTC): ${n}. Tope diario: secret OPENAI_DAILY_MAX_REQUESTS en la Edge Function (default 200).`;
      } catch (_) {}
    }

    async function handleSend(text) {
      const q = text.trim();
      if (!q) return;
      appendMsg("user", q);
      input.value = "";
      appendMsg("assistant", "…");
      const last = chat.lastChild;
      const useOpenAI = document.getElementById("adminAiUseOpenAI")?.checked !== false;

      try {
        let answer = "";
        if (useOpenAI) {
          try {
            const edgeResult = await callAssistantEdge(q);
            answer = edgeResult.answer;
            const usage = edgeResult.assistant_usage;
            const hintEl = document.getElementById("adminAiUsageHint");
            if (hintEl && usage && usage.count != null && usage.max != null) {
              hintEl.hidden = false;
              hintEl.textContent = `Consultas registradas hoy (UTC): ${usage.count} de ${usage.max} (OPENAI_DAILY_MAX_REQUESTS).`;
            }
          } catch (edgeErr) {
            const code = edgeErr && edgeErr.code;
            if (code === "openai_not_configured") {
              answer = await runAssistantQuery(q);
              answer +=
                "\n\n— Nota: configurá el secret OPENAI_API_KEY en Supabase para activar respuestas con lenguaje natural.";
            } else if (code === "staff_only") {
              answer =
                "Tu usuario no tiene un rol de panel válido (admin, seller, catalog o sales). Un admin puede asignar rol en Supabase: update public.profiles set role = 'admin' where id = 'TU_UUID';";
            } else if (code === "openai_daily_limit_reached") {
              answer = `Se alcanzó el límite diario del asistente (${edgeErr.count ?? "?"}/${edgeErr.max ?? "?"} en UTC). Configurá OPENAI_DAILY_MAX_REQUESTS o esperá al día siguiente.`;
            } else if (code === "invalid_session" || code === "missing_authorization") {
              answer =
                "Sesión inválida o token vencido. Cerrá sesión en el panel, volvé a entrar en admin-login e intentá de nuevo.";
            } else {
              answer = await runAssistantQuery(q);
              const st = edgeErr && edgeErr.status ? ` [HTTP ${edgeErr.status}]` : "";
              const detail = edgeErr && edgeErr.detail ? ` · ${edgeErr.detail}` : "";
              answer += `\n\n— IA avanzada no disponible${st}: ${String(
                edgeErr.message || code || "error"
              )}${detail}\n\nSi abrís el admin desde un archivo (file://), probá abrirlo por http://localhost (servidor local).`;
            }
          }
        } else {
          answer = await runAssistantQuery(q);
        }
        if (last && last.classList.contains("admin-ai-msg--assistant")) {
          last.textContent = answer;
        }
      } catch (_) {
        if (last && last.classList.contains("admin-ai-msg--assistant")) {
          last.textContent = "Ocurrió un error al consultar. Revisá la consola o los permisos de Supabase.";
        }
      }
      chat.scrollTop = chat.scrollHeight;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSend(input.value);
    });

    if (suggestions) {
      suggestions.addEventListener("click", (e) => {
        const btn = e.target.closest(".admin-ai-card[data-ai-q]");
        if (!btn) return;
        const preset = btn.getAttribute("data-ai-q");
        if (preset) handleSend(preset);
      });
    }

    refreshAssistantUsageFromDb();
  }

  async function init() {
    initSectionNavigation();
    initDocTabs();
    await initAuth();
    if (document.body.classList.contains("admin-auth-loading")) return;
    await initAdminBrandLogo();
    initAdminPanelFeatures();
    initInventoryModule();
    await initTradeInModule();
    initWebAssetsModule();
    initAssistantModule();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
