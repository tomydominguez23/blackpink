#!/usr/bin/env bash
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${ROOT}/deploy-version.json"

SHA="${GITHUB_SHA:-$(git -C "$ROOT" rev-parse HEAD 2>/dev/null || echo unknown)}"
SHORT="${SHA:0:7}"
REF="${GITHUB_REF_NAME:-$(git -C "$ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)}"
NOW="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
ABS="${DEPLOY_ABS_DOCROOT:-/home/ditecnoc/public_html/bpphones.cl}"
FTP_DIR="${DEPLOY_FTP_REMOTE_DIR:-./}"

cat > "$OUT" <<JSON
{
  "site": "https://bpphones.cl",
  "server_path": "${ABS}",
  "ftp_remote_dir": "${FTP_DIR}",
  "commit": "${SHA}",
  "commit_short": "${SHORT}",
  "branch": "${REF}",
  "deployed_at": "${NOW}",
  "theme": "neon-dark-v2",
  "verify_url": "https://bpphones.cl/deploy-version.json",
  "ftp_check_url": "https://bpphones.cl/deploy-ftp-check.json"
}
JSON

echo "deploy-version.json → commit ${SHORT} (${NOW})"
