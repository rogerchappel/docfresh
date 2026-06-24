#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${TMPDIR:-/tmp}/docfresh-ci-docs-drift"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

cd "$ROOT"
npm run build >/dev/null

node dist/cli.js check --root fixtures/valid-docs --format json >"$OUT_DIR/valid-docs.json"

if node dist/cli.js check --root fixtures/stale-docs --format json >"$OUT_DIR/stale-docs.json"; then
  echo "expected fixtures/stale-docs to report drift" >&2
  exit 1
fi

grep -q '"ok": true' "$OUT_DIR/valid-docs.json"
grep -q '"ok": false' "$OUT_DIR/stale-docs.json"
grep -q '"severity": "error"' "$OUT_DIR/stale-docs.json"

echo "docfresh demo wrote $OUT_DIR"
