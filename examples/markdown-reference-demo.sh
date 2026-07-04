#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${TMPDIR:-/tmp}/docfresh-markdown-reference-demo"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

cd "$ROOT_DIR"
npm run build

node dist/cli.js check \
  --root fixtures/valid-docs \
  --markdown README.md \
  --format text | tee "$OUT_DIR/valid-readme.txt"

set +e
node dist/cli.js check \
  --root fixtures/stale-docs \
  --markdown README.md \
  --format json >"$OUT_DIR/stale-readme.json"
STALE_STATUS=$?
set -e

test "$STALE_STATUS" -eq 1
test -s "$OUT_DIR/valid-readme.txt"
test -s "$OUT_DIR/stale-readme.json"
grep -q '"ok": false' "$OUT_DIR/stale-readme.json"
grep -q '"severity": "error"' "$OUT_DIR/stale-readme.json"

printf 'Markdown-only DocFresh reports written to %s\n' "$OUT_DIR"
