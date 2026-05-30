#!/usr/bin/env bash
# Sube solo api/webpay/config.php por FTPS si existe (tras generate-webpay-config.php).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG="${ROOT}/api/webpay/config.php"
if [[ ! -f "$CONFIG" ]]; then
  echo "No hay config.php generado; omitiendo subida FTP."
  exit 0
fi
for var in CPANEL_FTP_SERVER CPANEL_FTP_USERNAME CPANEL_FTP_PASSWORD; do
  if [[ -z "${!var:-}" ]]; then
    echo "Faltan credenciales FTP para subir config.php."
    exit 0
  fi
done
PORT="${CPANEL_FTP_PORT:-21}"
REMOTE_DIR="${CPANEL_FTP_SERVER_DIR:-./public_html/bpphones.cl/}"
REMOTE_DIR="${REMOTE_DIR%/}"
REMOTE_PATH="${REMOTE_DIR}/api/webpay/config.php"
if ! command -v lftp >/dev/null 2>&1; then
  sudo apt-get update -qq && sudo apt-get install -y -qq lftp
fi
lftp -u "${CPANEL_FTP_USERNAME}","${CPANEL_FTP_PASSWORD}" -e "\
set ftp:ssl-force true; \
set ssl:verify-certificate no; \
open -p ${PORT} ftps://${CPANEL_FTP_SERVER}; \
put ${CONFIG} -o ${REMOTE_PATH}; \
bye"
echo "config.php subido a ${REMOTE_PATH}"
