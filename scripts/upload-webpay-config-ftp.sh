#!/usr/bin/env bash
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG="${ROOT}/api/webpay/config.php"

if [ ! -f "$CONFIG" ]; then
  echo "No hay config.php generado; omitiendo subida FTP."
  exit 0
fi

for var in CPANEL_FTP_SERVER CPANEL_FTP_USERNAME CPANEL_FTP_PASSWORD; do
  if [ -z "${!var:-}" ]; then
    echo "Faltan credenciales FTP para subir config.php."
    exit 0
  fi
done

normalize_remote_dir() {
  local raw="${1:-./}"
  raw="$(printf '%s' "$raw" | tr -d '\r\n')"
  raw="${raw#/home/ditecnoc/}"
  raw="${raw#/home/ditecnoc}"
  case "$raw" in
    "" | "." | "./" | "/")
      printf '.'
      ;;
    ./*)
      printf '%s' "${raw#./}"
      ;;
    *)
      printf '%s' "$raw"
      ;;
  esac
}

PORT="${CPANEL_FTP_PORT:-21}"
REMOTE_DIR="$(normalize_remote_dir "${CPANEL_FTP_SERVER_DIR:-./}")"

if ! command -v lftp >/dev/null 2>&1; then
  sudo apt-get update -qq && sudo apt-get install -y -qq lftp
fi

TMP_SCRIPT="$(mktemp)"
trap 'rm -f "$TMP_SCRIPT"' EXIT

# user/pass separados: el usuario admin@bpphones.cl rompe `open -u` si lleva @ sin comillas.
cat > "$TMP_SCRIPT" <<LFTP_SCRIPT
set cmd:fail-exit yes
set ftp:ssl-force true
set ssl:verify-certificate no
open -p ${PORT} ftps://${CPANEL_FTP_SERVER}
user "${CPANEL_FTP_USERNAME}"
cd ${REMOTE_DIR}
mkdir -p api/webpay
cd api/webpay
put ${CONFIG} -o config.php
bye
LFTP_SCRIPT

echo "Subiendo config.php → ${REMOTE_DIR}/api/webpay/config.php (FTPS ${CPANEL_FTP_SERVER}:${PORT})"

export LFTP_PASSWORD="${CPANEL_FTP_PASSWORD}"
lftp -f "$TMP_SCRIPT"

echo "config.php subido correctamente."
