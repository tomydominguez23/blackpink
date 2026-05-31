#!/usr/bin/env bash
# Genera deploy-ftp-check.json (marcador de ruta FTP usada en el deploy).
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${ROOT}/deploy-ftp-check.json"
ABS="${DEPLOY_ABS_DOCROOT:-/home/ditecnoc/public_html/bpphones.cl}"
REMOTE="${DEPLOY_FTP_REMOTE_DIR:-./}"
USER_HINT="${DEPLOY_FTP_USER_HINT:-admin@bpphones.cl}"
NOW="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

cat > "$OUT" <<JSON
{
  "site": "https://bpphones.cl",
  "absolute_docroot": "${ABS}",
  "ftp_remote_dir": "${REMOTE}",
  "ftp_account_hint": "${USER_HINT}",
  "check_url": "https://bpphones.cl/deploy-ftp-check.json",
  "written_at": "${NOW}",
  "note": "Si absolute_docroot coincide con cPanel y ves este JSON en el navegador, el FTP apunta a la carpeta correcta del dominio."
}
JSON

echo "deploy-ftp-check.json → ftp_remote_dir=${REMOTE} → ${ABS}"
