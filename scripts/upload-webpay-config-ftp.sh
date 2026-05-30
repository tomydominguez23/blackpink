#!/usr/bin/env bash
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f "${ROOT}/api/webpay/config.php" ]; then
  echo "No hay config.php generado; omitiendo subida FTP."
  exit 0
fi

for var in CPANEL_FTP_SERVER CPANEL_FTP_USERNAME CPANEL_FTP_PASSWORD; do
  if [ -z "${!var:-}" ]; then
    echo "Faltan credenciales FTP para subir config.php."
    exit 0
  fi
done

npm install --no-save basic-ftp@5.0.5 --silent
node scripts/upload-webpay-config-ftp.mjs
