/**
 * Metadatos SEO compartidos (canonical, Open Graph, Twitter).
 * Las páginas públicas incluyen las etiquetas en el HTML; este script
 * permite actualizarlas en fichas de producto cargadas por JS.
 */
(function (global) {
  var SITE_URL = "https://bpphones.cl";
  var SITE_NAME = "Blackpink Store";
  var DEFAULT_OG_IMAGE =
    SITE_URL + "/iPhone_15_Pro_Titanio_Natural_128GB16947847993.png";

  function upsertMeta(attr, key, content) {
    if (!content) return;
    var sel = "meta[" + attr + '="' + key + '"]';
    var el = document.querySelector(sel);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function upsertLink(rel, href) {
    if (!href) return;
    var el = document.querySelector('link[rel="' + rel + '"]');
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", rel);
      document.head.appendChild(el);
    }
    el.setAttribute("href", href);
  }

  function applyPageMeta(opts) {
    opts = opts || {};
    var path = opts.path || "/";
    if (path.charAt(0) !== "/") path = "/" + path;
    var base = SITE_URL.replace(/\/$/, "");
    var url = base + path;
    if (opts.title) document.title = opts.title;
    if (opts.description) upsertMeta("name", "description", opts.description);
    upsertLink("canonical", url);
    upsertMeta("name", "robots", opts.robots || "index, follow");
    upsertMeta("property", "og:title", opts.title || document.title);
    if (opts.description) upsertMeta("property", "og:description", opts.description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:type", opts.ogType || "website");
    upsertMeta("property", "og:locale", "es_CL");
    var image = opts.image || DEFAULT_OG_IMAGE;
    if (image) {
      if (image.indexOf("http") !== 0) image = base + (image.charAt(0) === "/" ? "" : "/") + image;
      upsertMeta("property", "og:image", image);
      upsertMeta("name", "twitter:image", image);
    }
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", opts.title || document.title);
    if (opts.description) upsertMeta("name", "twitter:description", opts.description);
  }

  global.BP_SEO = {
    SITE_URL: SITE_URL,
    SITE_NAME: SITE_NAME,
    DEFAULT_OG_IMAGE: DEFAULT_OG_IMAGE,
    applyPageMeta: applyPageMeta,
  };
})(typeof window !== "undefined" ? window : globalThis);
