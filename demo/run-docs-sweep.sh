#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${TMPDIR:-/tmp}/docfresh-docs-sweep"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"
cd "$ROOT_DIR"

npm run build
node dist/cli.js check --root fixtures/valid-docs --format text > "$OUT_DIR/valid.txt"
node dist/cli.js check --root fixtures/valid-docs --format json > "$OUT_DIR/valid.json"

set +e
node dist/cli.js check --root fixtures/stale-docs --format text > "$OUT_DIR/stale.txt"
STALE_STATUS=$?
set -e

test "$STALE_STATUS" -eq 1
test -s "$OUT_DIR/valid.txt"
test -s "$OUT_DIR/valid.json"
test -s "$OUT_DIR/stale.txt"
grep -qi "passed" "$OUT_DIR/valid.txt"
grep -qi "missing" "$OUT_DIR/stale.txt"

echo "Passing report: $OUT_DIR/valid.txt"
echo "Passing JSON: $OUT_DIR/valid.json"
echo "Stale-docs report: $OUT_DIR/stale.txt"
echo "Stale-docs exit: $STALE_STATUS"
