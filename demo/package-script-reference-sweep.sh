#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${TMPDIR:-/tmp}/docfresh-package-script-sweep"
TEXT_OUT="$OUT_DIR/stale-docs.txt"
JSON_OUT="$OUT_DIR/stale-docs.json"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

cd "$ROOT_DIR"
npm run build >/dev/null

set +e
node dist/cli.js check --root fixtures/stale-docs --format text > "$TEXT_OUT"
text_status=$?
node dist/cli.js check --root fixtures/stale-docs --format json > "$JSON_OUT"
json_status=$?
set -e

if [ "$text_status" -ne 1 ] || [ "$json_status" -ne 1 ]; then
  printf 'expected drift exit 1, got text=%s json=%s\n' "$text_status" "$json_status" >&2
  exit 1
fi

test -s "$TEXT_OUT"
test -s "$JSON_OUT"
grep -Fq "missing-package-script" "$TEXT_OUT"
grep -Fq "broken-local-link" "$TEXT_OUT"
grep -Fq '"kind": "missing-package-script"' "$JSON_OUT"
grep -Fq '"ok": false' "$JSON_OUT"

printf 'Text drift report: %s\n' "$TEXT_OUT"
printf 'JSON drift report: %s\n' "$JSON_OUT"
