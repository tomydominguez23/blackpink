/** HTML del megamenú iPhone (mismo contenido que app.js → initIphoneMegamenu). */
export const IPHONE_MEGA_GENERATIONS = [
  {
    label: "iPhone 12",
    variants: ["iPhone 12 mini", "iPhone 12", "iPhone 12 Pro", "iPhone 12 Pro Max"],
  },
  {
    label: "iPhone 13",
    variants: ["iPhone 13 mini", "iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max"],
  },
  {
    label: "iPhone 14",
    variants: ["iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max"],
  },
  {
    label: "iPhone 15",
    variants: ["iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max"],
  },
  {
    label: "iPhone 16",
    variants: ["iPhone 16e", "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max"],
  },
  {
    label: "iPhone 17",
    variants: ["iPhone 17", "iPhone 17 Pro", "iPhone 17 Pro Max"],
  },
];

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function iphoneCatalogHref(query) {
  return `productos.html?cat=iphone&q=${encodeURIComponent(query)}`;
}

export function renderIphoneMegamenuHtml() {
  return IPHONE_MEGA_GENERATIONS.map((gen) => {
    const variantsHtml = gen.variants
      .map((variant) => `<a href="${iphoneCatalogHref(variant)}">${escapeHtml(variant)}</a>`)
      .join("");
    return `<details class="megamenu-iphone-gen">
      <summary class="megamenu-iphone-gen-summary">
        <span class="megamenu-iphone-gen-title">${escapeHtml(gen.label)}</span>
        <span class="megamenu-iphone-gen-hint" aria-hidden="true">Variantes</span>
      </summary>
      <div class="megamenu-iphone-variants">
        <a class="megamenu-iphone-gen-all" href="${iphoneCatalogHref(gen.label)}">Ver todos ${escapeHtml(gen.label)}</a>
        ${variantsHtml}
      </div>
    </details>`;
  }).join("");
}
