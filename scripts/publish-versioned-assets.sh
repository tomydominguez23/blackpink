#!/usr/bin/env bash
# Copia CSS/JS con nombre que incluye el commit → bust de caché real (URL distinta cada deploy).
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SHA="${GITHUB_SHA:-$(git -C "$ROOT" rev-parse HEAD 2>/dev/null || echo "dev")}"
SHORT="${SHA:0:7}"

publish() {
  local base="$1"
  if [ ! -f "$ROOT/$base" ]; then
    return
  fi
  local ext="${base##*.}"
  local name="${base%.*}"
  cp "$ROOT/$base" "$ROOT/${name}.${SHORT}.${ext}"
  echo "Publicado: ${name}.${SHORT}.${ext}"
}

publish "app.js"
publish "productos-page.js"
publish "producto-page.js"
publish "carrito-page.js"
publish "cart.js"
publish "bp-catalog-client.js"
publish "styles.css"
publish "theme-neon.css"
publish "checkout-customer.js"
publish "webpay-checkout.js"
publish "vende-page.js"
publish "seo-meta.js"

echo "Listo: assets con sufijo .${SHORT}"
