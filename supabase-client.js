(function () {
  var C = typeof window !== "undefined" ? window.__SUPABASE_CONFIG__ : null;
  var SUPABASE_URL =
    (C && typeof C.url === "string" && C.url) || "https://kodehyjdonripddobqgs.supabase.co";
  var SUPABASE_ANON_KEY =
    (C && typeof C.anonKey === "string" && C.anonKey) ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvZGVoeWpkb25yaXBkZG9icWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MTc0OTMsImV4cCI6MjA5MDE5MzQ5M30.eShvVaQZAKnKS5R6g2TASlsfHRqngStApnicumAve-Y";

  if (!window.supabase || !window.supabase.createClient) {
    console.error("Supabase CDN no esta cargado.");
    return;
  }

  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  function mapProductRow(row) {
    return {
      id: row.external_id || row.id,
      dbId: row.id,
      title: row.title || "",
      category: row.category || "otros",
      categoryLabel: row.category_label || "Otros",
      condition: row.condition || "seminuevo",
      price: Number(row.price) || 0,
      oldPrice: row.old_price == null ? null : Number(row.old_price),
      stock: Number(row.stock) || 0,
      image: row.cover_image_url || "",
      images: Array.isArray(row.images) ? row.images : [],
      description: row.description || "",
      longDescription: row.long_description || "",
      specs: row.specs || {},
      reviews: Array.isArray(row.reviews) ? row.reviews : [],
      colors: Array.isArray(row.colors) ? row.colors : [],
      capacities: Array.isArray(row.capacities) ? row.capacities : [],
      chargerPrice: row.charger_price == null ? null : Number(row.charger_price),
      published: Boolean(row.published),
      stockSourceProductId: row.stock_source_product_id || null,
      imei: "",
      updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : Date.now(),
    };
  }

  async function fetchPublicProducts() {
    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("published", true)
      .gt("stock", 0)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(mapProductRow);
  }

  async function signInAdmin(email, password) {
    return client.auth.signInWithPassword({ email, password });
  }

  async function signOutAdmin() {
    return client.auth.signOut();
  }

  async function getCurrentSession() {
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    return data.session || null;
  }

  async function getMyProfile() {
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();
    if (userError || !user) return null;
    const { data, error } = await client
      .from("profiles")
      .select("id, full_name, role")
      .eq("id", user.id)
      .single();
    if (error) return null;
    return data;
  }

  async function fetchTradeInData() {
    const [{ data: settings }, { data: categories }, { data: models }] = await Promise.all([
      client.from("tradein_settings").select("*").eq("id", 1).single(),
      client.from("tradein_categories").select("*").eq("active", true).order("name", { ascending: true }),
      client.from("tradein_models").select("*").eq("active", true).order("name", { ascending: true }),
    ]);

    const mappedCategories = (categories || []).map((c) => ({
      id: c.id,
      name: c.name,
      img: c.img_url || "",
    }));

    const groupedModels = {};
    (models || []).forEach((m) => {
      if (!groupedModels[m.category_id]) groupedModels[m.category_id] = [];
      groupedModels[m.category_id].push({
        id: m.id,
        name: m.name,
        year: m.year,
        base: Number(m.base) || 0,
        img: m.img_url || "",
        capacities: Array.isArray(m.capacities) ? m.capacities : [],
      });
    });

    return {
      categories: mappedCategories,
      models: groupedModels,
      settings: settings
        ? {
            incrementPerTier: Number(settings.increment_per_tier) || 12000,
            fixedDeduction: Number(settings.fixed_deduction) || 8000,
            minPercentFloor: Number(settings.min_percent_floor) || 0.35,
          }
        : null,
    };
  }

  async function saveTradeInSettings(payload) {
    return client.from("tradein_settings").update(payload).eq("id", 1);
  }

  async function saveTradeInModelBase(modelId, base) {
    return client.from("tradein_models").update({ base }).eq("id", modelId);
  }

  async function createTradeInCategory(payload) {
    return client.from("tradein_categories").insert(payload);
  }

  async function deleteTradeInCategory(categoryId) {
    return client.from("tradein_categories").delete().eq("id", categoryId);
  }

  async function createTradeInModel(payload) {
    return client.from("tradein_models").insert(payload);
  }

  async function deleteTradeInModel(modelId) {
    return client.from("tradein_models").delete().eq("id", modelId);
  }

  async function updateTradeInCategory(categoryId, payload) {
    return client.from("tradein_categories").update(payload).eq("id", categoryId);
  }

  async function updateTradeInModel(modelId, payload) {
    return client.from("tradein_models").update(payload).eq("id", modelId);
  }

  async function uploadTradeInImage(file, folder) {
    const cleanName = String(file.name || "tradein.jpg").replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `tradein/${folder}/${Date.now()}-${cleanName}`;
    const { error } = await client.storage
      .from("product-images")
      .upload(path, file, { upsert: false });
    if (error) throw error;
    const { data } = client.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function fetchPublicSiteAssets() {
    const { data, error } = await client
      .from("site_assets")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async function fetchAdminSiteAssets() {
    const { data, error } = await client
      .from("site_assets")
      .select("*")
      .order("asset_type", { ascending: true })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async function uploadSiteAsset(file, folder) {
    const cleanName = String(file.name || "asset.jpg").replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `web-assets/${folder}/${Date.now()}-${cleanName}`;
    const { error } = await client.storage
      .from("product-images")
      .upload(path, file, { upsert: false });
    if (error) throw error;
    const { data } = client.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function createSiteAsset(payload) {
    return client.from("site_assets").insert(payload);
  }

  async function updateSiteAsset(id, payload) {
    return client.from("site_assets").update(payload).eq("id", id);
  }

  async function deleteSiteAsset(id) {
    return client.from("site_assets").delete().eq("id", id);
  }

  async function fetchAdminOrders(opts) {
    const o = opts || {};
    const { status, dateFrom, dateTo, q } = o;
    let query = client
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(400);
    if (status && status !== "all") query = query.eq("status", status);
    if (dateFrom) query = query.gte("created_at", `${dateFrom}T00:00:00.000Z`);
    if (dateTo) query = query.lte("created_at", `${dateTo}T23:59:59.999Z`);
    const { data, error } = await query;
    if (error) throw error;
    let rows = data || [];
    const term = (q || "").trim().toLowerCase();
    if (term) {
      const uuidRe =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      rows = rows.filter((row) => {
        if (uuidRe.test(term) && row.id === term) return true;
        const email = row.customer_email ? String(row.customer_email).toLowerCase() : "";
        return email.includes(term);
      });
    }
    return rows;
  }

  async function fetchOrderItemsWithProducts(orderId) {
    const { data, error } = await client
      .from("order_items")
      .select("id, quantity, unit_price, product_id, product_external_id, products (title, external_id)")
      .eq("order_id", orderId);
    if (error) throw error;
    return data || [];
  }

  async function updateOrderStatus(orderId, nextStatus) {
    const payload = { status: nextStatus };
    if (nextStatus === "shipped") {
      payload.shipped_at = new Date().toISOString();
    }
    return client.from("orders").update(payload).eq("id", orderId);
  }

  window.BP_SUPABASE = {
    client,
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    mapProductRow,
    fetchPublicProducts,
    signInAdmin,
    signOutAdmin,
    getCurrentSession,
    getMyProfile,
    fetchTradeInData,
    saveTradeInSettings,
    saveTradeInModelBase,
    createTradeInCategory,
    deleteTradeInCategory,
    createTradeInModel,
    deleteTradeInModel,
    updateTradeInCategory,
    updateTradeInModel,
    uploadTradeInImage,
    fetchPublicSiteAssets,
    fetchAdminSiteAssets,
    uploadSiteAsset,
    createSiteAsset,
    updateSiteAsset,
    deleteSiteAsset,
    fetchAdminOrders,
    fetchOrderItemsWithProducts,
    updateOrderStatus,
  };
})();

