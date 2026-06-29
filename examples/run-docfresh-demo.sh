#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

cd "$ROOT_DIR"

echo "== valid docs pass =="
node dist/cli.js check --root fixtures/valid-docs --format text

echo
echo "== stale docs fail with findings =="
if node dist/cli.js check --root fixtures/stale-docs --format text; then
  echo "expected stale docs fixture to fail" >&2
  exit 1
fi

echo
echo "== json report is scriptable =="
node dist/cli.js check --root fixtures/stale-docs --format json >"$TMP_DIR/stale-report.json" || true
grep -q '"ok": false' "$TMP_DIR/stale-report.json"
grep -q '"findings"' "$TMP_DIR/stale-report.json"
wc -c "$TMP_DIR/stale-report.json"
