#!/usr/bin/env bash
set -eu

SITE="${DEPLOY_VERIFY_URL:-https://bpphones.cl/deploy-version.json}"
EXPECTED_SHA="${GITHUB_SHA:-}"
MAX_ATTEMPTS="${DEPLOY_VERIFY_ATTEMPTS:-8}"
SLEEP_SEC="${DEPLOY_VERIFY_SLEEP:-10}"
FAIL=0

if [ -z "$EXPECTED_SHA" ]; then
  echo "Sin GITHUB_SHA; omitiendo verificación post-deploy."
  exit 0
fi

echo "Verificando deploy en ${SITE} (commit ${EXPECTED_SHA:0:7})…"

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
      echo "OK: api/webpay/health.php con Supabase configurado."
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
      echo "OK: deploy-version.json = commit ${EXPECTED_SHA:0:7} (theme=${THEME})."
      check_homepage
      check_webpay
      if [ "$FAIL" -eq 0 ]; then
        exit 0
      fi
      echo "Intento ${attempt}/${MAX_ATTEMPTS}: archivos HTML actualizados pero Webpay roto."
    else
      echo "Intento ${attempt}/${MAX_ATTEMPTS}: commit en vivo=${LIVE_SHA:-desconocido}, esperado=${EXPECTED_SHA:0:7}"
    fi
  else
    echo "Intento ${attempt}/${MAX_ATTEMPTS}: no se pudo leer ${SITE}"
  fi
  sleep "$SLEEP_SEC"
done

echo "::error::Deploy incompleto. Revisá CPANEL_FTP_SERVER_DIR (./ para admin@bpphones.cl) y NO reemplaces la carpeta api/ manualmente."
exit 1
