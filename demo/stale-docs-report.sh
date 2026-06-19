#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${TMPDIR:-/tmp}/docfresh-stale-docs-demo"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

cd "$ROOT_DIR"
npm run build

set +e
node dist/cli.js check --root fixtures/stale-docs --format text | tee "$OUT_DIR/stale-docs.txt"
text_status=$?
node dist/cli.js check --root fixtures/stale-docs --format json > "$OUT_DIR/stale-docs.json"
json_status=$?
set -e

if [ "$text_status" -ne 1 ] || [ "$json_status" -ne 1 ]; then
  echo "Expected stale-docs fixture to exit 1; got text=$text_status json=$json_status" >&2
  exit 1
fi

test -s "$OUT_DIR/stale-docs.txt"
test -s "$OUT_DIR/stale-docs.json"
grep -Eq "ERROR|missing|script|link|file" "$OUT_DIR/stale-docs.txt"
node -e "const fs=require('node:fs'); const data=JSON.parse(fs.readFileSync(process.argv[1], 'utf8')); if (!Array.isArray(data.findings) || data.findings.length === 0) process.exit(1);" "$OUT_DIR/stale-docs.json"

printf 'DocFresh stale-docs demo wrote reports to %s\n' "$OUT_DIR"
