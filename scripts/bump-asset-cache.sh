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
    -e "s|\"app\\.js\"|\"app.js?v=${SHORT}\"|g" \
    -e "s|'app\\.js'|'app.js?v=${SHORT}'|g" \
    -e "s|bp-catalog-client\\.js?v=[^\"'&]*|bp-catalog-client.js?v=${SHORT}|g" \
    -e "s|\"bp-catalog-client\\.js\"|\"bp-catalog-client.js?v=${SHORT}\"|g" \
    -e "s|'bp-catalog-client\\.js'|'bp-catalog-client.js?v=${SHORT}'|g" \
    -e "s|\"styles\\.css\"|\"styles.css?v=${SHORT}\"|g" \
    -e "s|'styles\\.css'|'styles.css?v=${SHORT}'|g" \
    -e "s|href=\"styles\\.css\"|href=\"styles.css?v=${SHORT}\"|g" \
    -e "s|href=\"\\.\\./styles\\.css\"|href=\"./styles.css?v=${SHORT}\"|g" \
    "$f"
done

echo "Listo: cada deploy fuerza descarga nueva de CSS/JS en el teléfono."
