#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${TMPDIR:-/tmp}/docfresh-valid-docs-demo"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

cd "$ROOT_DIR"
npm run build

node dist/cli.js check --root fixtures/valid-docs --format text | tee "$OUT_DIR/report.txt"
node dist/cli.js check --root fixtures/valid-docs --format json > "$OUT_DIR/report.json"

test -s "$OUT_DIR/report.txt"
test -s "$OUT_DIR/report.json"
grep -q "DocFresh" "$OUT_DIR/report.txt"
node -e "const fs=require('node:fs'); const data=JSON.parse(fs.readFileSync(process.argv[1], 'utf8')); if (!Array.isArray(data.findings)) process.exit(1);" "$OUT_DIR/report.json"

printf 'DocFresh demo wrote reports to %s\n' "$OUT_DIR"
