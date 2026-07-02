#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

npm run build

echo "== DocFresh text scan against the passing example =="
node dist/cli.js check --root examples/basic --format text

echo
echo "== DocFresh JSON scan against the passing fixture =="
node dist/cli.js check --root fixtures/valid-docs --format json > /tmp/docfresh-valid-docs.json
node -e "const fs=require('node:fs'); const report=JSON.parse(fs.readFileSync('/tmp/docfresh-valid-docs.json','utf8')); if (!report.ok) process.exit(1); console.log(JSON.stringify({ok: report.ok, findings: report.findings.length}, null, 2));"

echo
echo "Wrote /tmp/docfresh-valid-docs.json"
