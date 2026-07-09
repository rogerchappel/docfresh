#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="/tmp/docfresh-demo"
PASS_JSON="$OUT_DIR/basic.json"
STALE_JSON="$OUT_DIR/stale.json"

cd "$ROOT"
mkdir -p "$OUT_DIR"

npm run build
node dist/cli.js check --root examples/basic --format json > "$PASS_JSON"

set +e
node dist/cli.js check --root examples/stale --format json > "$STALE_JSON"
status=$?
set -e

if [ "$status" -eq 0 ]; then
  echo "Expected examples/stale to report documentation drift." >&2
  exit 1
fi

node -e "const fs=require('node:fs'); for (const file of process.argv.slice(1)) { const report=JSON.parse(fs.readFileSync(file,'utf8')); if (!Array.isArray(report.findings)) process.exit(1); }" "$PASS_JSON" "$STALE_JSON"

echo "Passing report: $PASS_JSON"
echo "Drift report: $STALE_JSON"
