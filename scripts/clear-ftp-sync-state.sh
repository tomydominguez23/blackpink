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
PRIMARY="${CPANEL_FTP_SERVER_DIR:-./public_html/bpphones.cl/}"
PRIMARY="${PRIMARY%/}"
if ! command -v lftp >/dev/null 2>&1; then
  sudo apt-get update -qq && sudo apt-get install -y -qq lftp
fi
for REMOTE_DIR in "${PRIMARY}" "./bpphones.cl" "./public_html/bpphones.cl"; do
  for STATE in ".ftp-deploy-sync-state.json" ".ftp-deploy-sync-bpphones-v4a.json" ".ftp-deploy-sync-bpphones-v4b.json"; do
    lftp -u "${CPANEL_FTP_USERNAME}","${CPANEL_FTP_PASSWORD}" -e "\
set ftp:ssl-force true; \
set ssl:verify-certificate no; \
open -p ${PORT} ftps://${CPANEL_FTP_SERVER}; \
rm -f ${REMOTE_DIR}/${STATE}; \
bye" || true
  done
done
echo "Estado FTP limpiado en ${PRIMARY} y ./bpphones.cl/"
