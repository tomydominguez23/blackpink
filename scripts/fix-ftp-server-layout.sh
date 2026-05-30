#!/usr/bin/env bash
# Repara el layout del servidor cuando alguien subió FTP manual (api como .zip, PHP sueltos, sin .htaccess).
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

for var in CPANEL_FTP_SERVER CPANEL_FTP_USERNAME CPANEL_FTP_PASSWORD; do
  if [ -z "${!var:-}" ]; then
    echo "Sin credenciales FTP; omitiendo reparación del servidor."
    exit 0
  fi
done

normalize_remote_dir() {
  local raw="${1:-./}"
  raw="$(printf '%s' "$raw" | tr -d '\r\n')"
  raw="${raw#/home/ditecnoc/}"
  raw="${raw#/home/ditecnoc}"
  case "$raw" in
    "" | "." | "./" | "/") printf '.' ;;
    ./*) printf '%s' "${raw#./}" ;;
    *) printf '%s' "$raw" ;;
  esac
}

PORT="${CPANEL_FTP_PORT:-21}"
REMOTE_DIR="$(normalize_remote_dir "${CPANEL_FTP_SERVER_DIR:-./}")"

if ! command -v lftp >/dev/null 2>&1; then
  sudo apt-get update -qq && sudo apt-get install -y -qq lftp
fi

TMP_SCRIPT="$(mktemp)"
trap 'rm -f "$TMP_SCRIPT"' EXIT

cat > "$TMP_SCRIPT" <<LFTP_SCRIPT
set cmd:fail-exit no
set ftp:ssl-force true
set ssl:verify-certificate no
open -p ${PORT} ftps://${CPANEL_FTP_SERVER}
user "${CPANEL_FTP_USERNAME}"
cd ${REMOTE_DIR}
# api suele ser un ZIP subido a mano — impide crear api/webpay/
rm -f api
rm -rf __MACOSX
rm -f common.php
rm -f create.php
rm -f health.php
rm -f ping.php
rm -f return.php
rm -f status.php
rm -f debug-products.php
rm -f config.example.php
rm -f generate-webpay-config.php
rm -f clear-ftp-sync-state.sh
rm -rf scripts
rm -f cli-latest
rm -f gotrue-version
rm -f pooler-url
rm -f postgres-version
rm -f project-ref
rm -f rest-version
rm -f storage-migration
rm -f storage-version
rm -f package.json
rm -f config.toml
rm -f index.ts
mkdir api
mkdir api/webpay
put ${ROOT}/.htaccess -o .htaccess
bye
LFTP_SCRIPT

echo "Reparando layout FTP en ${REMOTE_DIR} (eliminar api.zip, PHP sueltos, subir .htaccess)…"

export LFTP_PASSWORD="${CPANEL_FTP_PASSWORD}"
lftp -f "$TMP_SCRIPT"

echo "Layout FTP reparado."
