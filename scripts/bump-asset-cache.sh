#!/usr/bin/env bash
# Antes del FTP: versiona CSS/JS en HTML con el commit del deploy (caché móvil).
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SHA="${GITHUB_SHA:-$(git -C "$ROOT" rev-parse HEAD 2>/dev/null || echo "dev")}"
SHORT="${SHA:0:7}"

echo "Versionando assets en HTML → ?v=${SHORT}"

shopt -s nullglob
for f in "$ROOT"/*.html; do
  [ -f "$f" ] || continue
  sed -i \
    -e "s|styles\\.css?v=[^\"'&]*|styles.css?v=${SHORT}|g" \
    -e "s|\\.\\./styles\\.css?v=[^\"'&]*|./styles.css?v=${SHORT}|g" \
    -e "s|theme-neon\\.css?v=[^\"'&]*|theme-neon.css?v=${SHORT}|g" \
    -e "s|\\.\\./theme-neon\\.css?v=[^\"'&]*|./theme-neon.css?v=${SHORT}|g" \
    -e "s|cart\\.js?v=[^\"'&]*|cart.js?v=${SHORT}|g" \
    -e "s|\\.\\./cart\\.js?v=[^\"'&]*|./cart.js?v=${SHORT}|g" \
    -e "s|app\\.js?v=[^\"'&]*|app.js?v=${SHORT}|g" \
    -e "s|bp-catalog-client\\.js?v=[^\"'&]*|bp-catalog-client.js?v=${SHORT}|g" \
    -e "s|productos-page\\.js?v=[^\"'&]*|productos-page.js?v=${SHORT}|g" \
    -e "s|producto-page\\.js?v=[^\"'&]*|producto-page.js?v=${SHORT}|g" \
    -e "s|carrito-page\\.js?v=[^\"'&]*|carrito-page.js?v=${SHORT}|g" \
    -e "s|vende-page\\.js?v=[^\"'&]*|vende-page.js?v=${SHORT}|g" \
    -e "s|seo-meta\\.js?v=[^\"'&]*|seo-meta.js?v=${SHORT}|g" \
    -e "s|checkout-customer\\.js?v=[^\"'&]*|checkout-customer.js?v=${SHORT}|g" \
    -e "s|webpay-checkout\\.js?v=[^\"'&]*|webpay-checkout.js?v=${SHORT}|g" \
    -e "s|trade-in-data\\.js?v=[^\"'&]*|trade-in-data.js?v=${SHORT}|g" \
    -e "s|admin\\.js?v=[^\"'&]*|admin.js?v=${SHORT}|g" \
    -e "s|admin-login\\.js?v=[^\"'&]*|admin-login.js?v=${SHORT}|g" \
    -e "s|products-data\\.js?v=[^\"'&]*|products-data.js?v=${SHORT}|g" \
    -e "s|\"styles\\.css\"|\"styles.css?v=${SHORT}\"|g" \
    -e "s|'styles\\.css'|'styles.css?v=${SHORT}'|g" \
    -e "s|href=\"styles\\.css\"|href=\"styles.css?v=${SHORT}\"|g" \
    -e "s|href=\"\\.\\./styles\\.css\"|href=\"./styles.css?v=${SHORT}\"|g" \
    -e "s|href=\"theme-neon\\.css\"|href=\"theme-neon.css?v=${SHORT}\"|g" \
    -e "s|href=\"\\.\\./theme-neon\\.css\"|href=\"./theme-neon.css?v=${SHORT}\"|g" \
    -e "s|\"app\\.js\"|\"app.js?v=${SHORT}\"|g" \
    -e "s|'app\\.js'|'app.js?v=${SHORT}'|g" \
    -e "s|\"bp-catalog-client\\.js\"|\"bp-catalog-client.js?v=${SHORT}\"|g" \
    -e "s|\"productos-page\\.js\"|\"productos-page.js?v=${SHORT}\"|g" \
    -e "s|\"producto-page\\.js\"|\"producto-page.js?v=${SHORT}\"|g" \
    -e "s|\"carrito-page\\.js\"|\"carrito-page.js?v=${SHORT}\"|g" \
    -e "s|\"vende-page\\.js\"|\"vende-page.js?v=${SHORT}\"|g" \
    -e "s|\"seo-meta\\.js\"|\"seo-meta.js?v=${SHORT}\"|g" \
    -e "s|\"checkout-customer\\.js\"|\"checkout-customer.js?v=${SHORT}\"|g" \
    -e "s|\"webpay-checkout\\.js\"|\"webpay-checkout.js?v=${SHORT}\"|g" \
    -e "s|\"trade-in-data\\.js\"|\"trade-in-data.js?v=${SHORT}\"|g" \
    -e "s|\"admin\\.js\"|\"admin.js?v=${SHORT}\"|g" \
    -e "s|\"admin-login\\.js\"|\"admin-login.js?v=${SHORT}\"|g" \
    -e "s|\"products-data\\.js\"|\"products-data.js?v=${SHORT}\"|g" \
    -e "s|\"cart\\.js\"|\"cart.js?v=${SHORT}\"|g" \
    "$f"
done

echo "Listo: cada deploy fuerza descarga nueva de CSS/JS en el teléfono."
