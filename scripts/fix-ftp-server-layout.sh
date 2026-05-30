#!/usr/bin/env bash
# Repara layout roto por FTP manual (api como ZIP, PHP sueltos, sin .htaccess).
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

for var in CPANEL_FTP_SERVER CPANEL_FTP_USERNAME CPANEL_FTP_PASSWORD; do
  if [ -z "${!var:-}" ]; then
    echo "Sin credenciales FTP; omitiendo reparación del servidor."
    exit 0
  fi
done

npm install --no-save basic-ftp@5.0.5 --silent
node scripts/fix-ftp-server-layout.mjs
