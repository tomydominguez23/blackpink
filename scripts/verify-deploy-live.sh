#!/usr/bin/env bash
set -eu

SITE="${DEPLOY_VERIFY_URL:-https://bpphones.cl/deploy-version.json}"
EXPECTED_SHA="${GITHUB_SHA:-}"
SHORT="${EXPECTED_SHA:0:7}"
MAX_ATTEMPTS="${DEPLOY_VERIFY_ATTEMPTS:-8}"
SLEEP_SEC="${DEPLOY_VERIFY_SLEEP:-10}"
FAIL=0

if [ -z "$EXPECTED_SHA" ]; then
  echo "Sin GITHUB_SHA; omitiendo verificación post-deploy."
  exit 0
fi

echo "Verificando deploy en ${SITE} (commit ${SHORT})…"

check_homepage() {
  local home=""
  home="$(curl -fsSL "https://bpphones.cl/" 2>/dev/null || true)"
  if printf '%s' "$home" | grep -qi "Index of /"; then
    echo "::error::La home muestra listado de carpetas (falta .htaccess). No subas FTP manual; redeploy desde GitHub."
    FAIL=1
  elif printf '%s' "$home" | grep -qi "BLACKPINK\|Blackpink\|bp-cart\|Tu carro"; then
    echo "OK: la home carga la tienda (no listado de directorios)."
  fi
}

check_live_asset_versions() {
  local home=""
  local productos=""
  local app_js=""

  home="$(curl -fsSL "https://bpphones.cl/" 2>/dev/null || true)"
  productos="$(curl -fsSL "https://bpphones.cl/productos.html" 2>/dev/null || true)"
  app_js="$(curl -fsSL "https://bpphones.cl/app.js?v=${SHORT}" 2>/dev/null || true)"

  if printf '%s' "$home" | grep -q "app.js?v=${SHORT}"; then
    echo "OK: index.html en vivo referencia app.js?v=${SHORT}."
  else
    echo "::error::index.html en vivo NO referencia app.js?v=${SHORT} (HTML no se subió o quedó cacheado en CDN)."
    FAIL=1
  fi

  if printf '%s' "$home" | grep -q "styles.css?v=${SHORT}"; then
    echo "OK: index.html referencia styles.css?v=${SHORT}."
  else
    echo "::error::index.html sin styles.css?v=${SHORT}."
    FAIL=1
  fi

  if printf '%s' "$productos" | grep -q "productos-page.js?v=${SHORT}"; then
    echo "OK: productos.html referencia productos-page.js?v=${SHORT}."
  else
    echo "::error::productos.html sin productos-page.js?v=${SHORT}."
    FAIL=1
  fi

  if printf '%s' "$app_js" | grep -q "product-price--agotado"; then
    echo "OK: app.js en vivo incluye lógica Agotado."
  else
    echo "::error::app.js?v=${SHORT} no contiene lógica Agotado."
    FAIL=1
  fi

  if printf '%s' "$app_js" | grep -q "IPHONE_MEGA_GENERATIONS"; then
    echo "OK: app.js en vivo incluye megamenú iPhone por generación."
  else
    echo "::error::app.js?v=${SHORT} sin megamenú iPhone por generación."
    FAIL=1
  fi
}

check_webpay() {
  local ping_ok=0
  local health_ok=0
  local ping_body=""
  local health_body=""

  if ping_body="$(curl -fsSL "https://bpphones.cl/api/webpay/ping.php" 2>/dev/null)"; then
    if printf '%s' "$ping_body" | python3 -c "import json,sys; d=json.load(sys.stdin); sys.exit(0 if d.get('ok') else 1)" 2>/dev/null; then
      ping_ok=1
      echo "OK: api/webpay/ping.php responde."
    fi
  fi

  if health_body="$(curl -fsSL "https://bpphones.cl/api/webpay/health.php" 2>/dev/null)"; then
    if printf '%s' "$health_body" | python3 -c "import json,sys; d=json.load(sys.stdin); sys.exit(0 if d.get('supabase_configured') and d.get('config_php_present') else 1)" 2>/dev/null; then
      health_ok=1
      if printf '%s' "$health_body" | python3 -c "import json,sys; d=json.load(sys.stdin); sys.exit(0 if d.get('payments_live') else 1)" 2>/dev/null; then
        echo "OK: api/webpay/health.php con pagos reales (production)."
      else
        mode="$(printf '%s' "$health_body" | python3 -c "import json,sys; print(json.load(sys.stdin).get('mode',''))" 2>/dev/null || true)"
        echo "::warning::Webpay en modo ${mode:-desconocido} (sin cobro real). Configurá WEBPAY_MODE=production + credenciales Transbank en GitHub Secrets."
      fi
    fi
  fi

  if [ "$ping_ok" -eq 0 ]; then
    echo "::error::Falta api/webpay en el servidor (ping.php no responde). No subas archivos a mano por FTP: usá GitHub Actions."
    FAIL=1
  fi
  if [ "$health_ok" -eq 0 ]; then
    echo "::error::api/webpay/health.php no está OK (404 o sin config.php). Re-ejecutá Deploy a cPanel (FTP)."
    FAIL=1
  fi
}

for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
  if BODY="$(curl -fsSL "$SITE" 2>/dev/null)"; then
    LIVE_SHA="$(printf '%s' "$BODY" | python3 -c "import json,sys; print(json.load(sys.stdin).get('commit',''))" 2>/dev/null || true)"
    THEME="$(printf '%s' "$BODY" | python3 -c "import json,sys; print(json.load(sys.stdin).get('theme',''))" 2>/dev/null || true)"
    if [ "$LIVE_SHA" = "$EXPECTED_SHA" ]; then
      echo "OK: deploy-version.json = commit ${SHORT} (theme=${THEME})."
      check_homepage
      check_live_asset_versions
      check_webpay
      if [ "$FAIL" -eq 0 ]; then
        exit 0
      fi
      echo "Intento ${attempt}/${MAX_ATTEMPTS}: deploy-version OK pero faltan archivos o referencias en HTML."
    else
      echo "Intento ${attempt}/${MAX_ATTEMPTS}: commit en vivo=${LIVE_SHA:-desconocido}, esperado=${SHORT}"
    fi
  else
    echo "Intento ${attempt}/${MAX_ATTEMPTS}: no se pudo leer ${SITE}"
  fi
  sleep "$SLEEP_SEC"
done

echo "::error::Deploy incompleto. Revisá CPANEL_FTP_SERVER_DIR (./ para admin@bpphones.cl), estado FTP y que bump-asset-cache corrió antes del FTP."
exit 1
