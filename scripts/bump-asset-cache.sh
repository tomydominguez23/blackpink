#!/usr/bin/env bash
# Antes del FTP: publica app.{commit}.js, styles.{commit}.css y actualiza referencias en HTML.
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SHA="${GITHUB_SHA:-$(git -C "$ROOT" rev-parse HEAD 2>/dev/null || echo "dev")}"
SHORT="${SHA:0:7}"

echo "Publicando assets con sufijo .${SHORT}…"
bash "$ROOT/scripts/publish-versioned-assets.sh"

echo "Incrustando megamenú iPhone en HTML…"
node "$ROOT/scripts/embed-iphone-megamenu.mjs"

echo "Actualizando referencias en HTML…"

shopt -s nullglob
for f in "$ROOT"/*.html; do
  [ -f "$f" ] || continue
  sed -i \
    -e "s|href=\"styles\\.css\\?v=[^\"]*\"|href=\"styles.${SHORT}.css\"|g" \
    -e "s|href=\"\\.\\./styles\\.css\\?v=[^\"]*\"|href=\"./styles.${SHORT}.css\"|g" \
    -e "s|href=\"styles\\.css\"|href=\"styles.${SHORT}.css\"|g" \
    -e "s|href=\"\\.\\./styles\\.css\"|href=\"./styles.${SHORT}.css\"|g" \
    -e "s|href=\"theme-neon\\.css\\?v=[^\"]*\"|href=\"theme-neon.${SHORT}.css\"|g" \
    -e "s|href=\"theme-neon\\.css\"|href=\"theme-neon.${SHORT}.css\"|g" \
    -e "s|src=\"cart\\.js\\?v=[^\"]*\"|src=\"cart.${SHORT}.js\"|g" \
    -e "s|src=\"cart\\.js\"|src=\"cart.${SHORT}.js\"|g" \
    -e "s|src=\"app\\.js\\?v=[^\"]*\"|src=\"app.${SHORT}.js\"|g" \
    -e "s|src=\"app\\.js\"|src=\"app.${SHORT}.js\"|g" \
    -e "s|src=\"bp-catalog-client\\.js\\?v=[^\"]*\"|src=\"bp-catalog-client.${SHORT}.js\"|g" \
    -e "s|src=\"bp-catalog-client\\.js\"|src=\"bp-catalog-client.${SHORT}.js\"|g" \
    -e "s|src=\"productos-page\\.js\\?v=[^\"]*\"|src=\"productos-page.${SHORT}.js\"|g" \
    -e "s|src=\"productos-page\\.js\"|src=\"productos-page.${SHORT}.js\"|g" \
    -e "s|src=\"producto-page\\.js\\?v=[^\"]*\"|src=\"producto-page.${SHORT}.js\"|g" \
    -e "s|src=\"producto-page\\.js\"|src=\"producto-page.${SHORT}.js\"|g" \
    -e "s|src=\"carrito-page\\.js\\?v=[^\"]*\"|src=\"carrito-page.${SHORT}.js\"|g" \
    -e "s|src=\"carrito-page\\.js\"|src=\"carrito-page.${SHORT}.js\"|g" \
    -e "s|src=\"vende-page\\.js\\?v=[^\"]*\"|src=\"vende-page.${SHORT}.js\"|g" \
    -e "s|src=\"vende-page\\.js\"|src=\"vende-page.${SHORT}.js\"|g" \
    -e "s|src=\"seo-meta\\.js\\?v=[^\"]*\"|src=\"seo-meta.${SHORT}.js\"|g" \
    -e "s|src=\"seo-meta\\.js\"|src=\"seo-meta.${SHORT}.js\"|g" \
    -e "s|src=\"checkout-customer\\.js\\?v=[^\"]*\"|src=\"checkout-customer.${SHORT}.js\"|g" \
    -e "s|src=\"checkout-customer\\.js\"|src=\"checkout-customer.${SHORT}.js\"|g" \
    -e "s|src=\"webpay-checkout\\.js\\?v=[^\"]*\"|src=\"webpay-checkout.${SHORT}.js\"|g" \
    -e "s|src=\"webpay-checkout\\.js\"|src=\"webpay-checkout.${SHORT}.js\"|g" \
    -e "s|src=\"trade-in-data\\.js\\?v=[^\"]*\"|src=\"trade-in-data.${SHORT}.js\"|g" \
  "$f"
done

echo "Listo: HTML apunta a *.${SHORT}.js / *.${SHORT}.css"
