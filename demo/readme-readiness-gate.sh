#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${TMPDIR:-/tmp}/docfresh-readme-readiness"
VALID_JSON="$OUT_DIR/valid-docs.json"
MINIMAL_TEXT="$OUT_DIR/minimal-readme.txt"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

cd "$ROOT_DIR"
npm run build

node dist/cli.js check --root fixtures/valid-docs --format json >"$VALID_JSON"
node dist/cli.js check --root fixtures/minimal-readme --format text >"$MINIMAL_TEXT"

test -s "$VALID_JSON"
test -s "$MINIMAL_TEXT"
node -e "const fs=require('node:fs'); const data=JSON.parse(fs.readFileSync(process.argv[1], 'utf8')); if (!Array.isArray(data.findings) || data.findings.length !== 0) process.exit(1);" "$VALID_JSON"
grep -q "missing-package-metadata" "$MINIMAL_TEXT"
grep -q "README does not document an install command" "$MINIMAL_TEXT"

printf 'Valid JSON report: %s\n' "$VALID_JSON"
printf 'Minimal README readiness report: %s\n' "$MINIMAL_TEXT"
