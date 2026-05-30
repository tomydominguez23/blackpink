#!/usr/bin/env bash
set -eu

for var in CPANEL_FTP_SERVER CPANEL_FTP_USERNAME CPANEL_FTP_PASSWORD; do
  if [ -z "${!var:-}" ]; then
    echo "Sin credenciales FTP; omitiendo limpieza de estado."
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
PRIMARY="$(normalize_remote_dir "${CPANEL_FTP_SERVER_DIR:-./}")"

if ! command -v lftp >/dev/null 2>&1; then
  sudo apt-get update -qq && sudo apt-get install -y -qq lftp
fi

delete_state_in_dir() {
  local dir="$1"
  local tmp_script
  tmp_script="$(mktemp)"
  cat > "$tmp_script" <<LFTP_EOF
set cmd:fail-exit no
set ftp:ssl-force true
set ssl:verify-certificate no
open -p ${PORT} ftps://${CPANEL_FTP_SERVER}
user "${CPANEL_FTP_USERNAME}"
cd ${dir}
rm -f .ftp-deploy-sync-state.json
rm -f .ftp-deploy-sync-bpphones-v5.json
rm -f .ftp-deploy-sync-bpphones-v6.json
rm -f .ftp-deploy-sync-bpphones-v7.json
rm -f .ftp-deploy-sync-bpphones-v8.json
bye
LFTP_EOF
  export LFTP_PASSWORD="${CPANEL_FTP_PASSWORD}"
  lftp -f "$tmp_script" || true
  rm -f "$tmp_script"
}

for REMOTE_DIR in "${PRIMARY}" "." "bpphones.cl" "public_html/bpphones.cl"; do
  delete_state_in_dir "${REMOTE_DIR}" || true
done

echo "Estado FTP limpiado (directorio principal: ${PRIMARY})."
