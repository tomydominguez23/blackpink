#!/usr/bin/env bash
# Borra el estado de sincronización en el servidor para forzar subida completa.
set -eu
for var in CPANEL_FTP_SERVER CPANEL_FTP_USERNAME CPANEL_FTP_PASSWORD; do
  if [[ -z "${!var:-}" ]]; then
    echo "Sin credenciales FTP; omitiendo limpieza de estado."
    exit 0
  fi
done
PORT="${CPANEL_FTP_PORT:-21}"
REMOTE_DIR="${CPANEL_FTP_SERVER_DIR:-./public_html/bpphones.cl/}"
REMOTE_DIR="${REMOTE_DIR%/}"
STATE_FILE="${REMOTE_DIR}/.ftp-deploy-sync-state.json"
if ! command -v lftp >/dev/null 2>&1; then
  sudo apt-get update -qq && sudo apt-get install -y -qq lftp
fi
lftp -u "${CPANEL_FTP_USERNAME}","${CPANEL_FTP_PASSWORD}" -e "\
set ftp:ssl-force true; \
set ssl:verify-certificate no; \
open -p ${PORT} ftps://${CPANEL_FTP_SERVER}; \
rm -f ${STATE_FILE}; \
bye" || true
echo "Estado FTP limpiado (si existía): ${STATE_FILE}"
