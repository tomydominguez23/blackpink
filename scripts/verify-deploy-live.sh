#!/usr/bin/env bash
set -eu

SITE="${DEPLOY_VERIFY_URL:-https://bpphones.cl/deploy-version.json}"
EXPECTED_SHA="${GITHUB_SHA:-}"
MAX_ATTEMPTS="${DEPLOY_VERIFY_ATTEMPTS:-6}"
SLEEP_SEC="${DEPLOY_VERIFY_SLEEP:-10}"

if [ -z "$EXPECTED_SHA" ]; then
  echo "Sin GITHUB_SHA; omitiendo verificación post-deploy."
  exit 0
fi

echo "Verificando deploy en ${SITE} (commit ${EXPECTED_SHA:0:7})…"

for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
  if BODY="$(curl -fsSL "$SITE" 2>/dev/null)"; then
    LIVE_SHA="$(printf '%s' "$BODY" | python3 -c "import json,sys; print(json.load(sys.stdin).get('commit',''))" 2>/dev/null || true)"
    THEME="$(printf '%s' "$BODY" | python3 -c "import json,sys; print(json.load(sys.stdin).get('theme',''))" 2>/dev/null || true)"
    if [ "$LIVE_SHA" = "$EXPECTED_SHA" ]; then
      echo "OK: el sitio público refleja el commit ${EXPECTED_SHA:0:7} (theme=${THEME})."
      exit 0
    fi
    echo "Intento ${attempt}/${MAX_ATTEMPTS}: commit en vivo=${LIVE_SHA:-desconocido}, esperado=${EXPECTED_SHA:0:7}"
  else
    echo "Intento ${attempt}/${MAX_ATTEMPTS}: no se pudo leer ${SITE}"
  fi
  sleep "$SLEEP_SEC"
done

echo "::warning::El sitio aún no muestra deploy-version.json con el commit actual. Revisá CPANEL_FTP_SERVER_DIR (debe ser ./ para admin@bpphones.cl) y la carpeta /home/ditecnoc/public_html/bpphones.cl en cPanel."
exit 0
