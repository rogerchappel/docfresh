#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

npm run build
node dist/cli.js check --root examples/marked-smoke --smoke --format text
node dist/cli.js check --root examples/marked-smoke --smoke --format json >"${TMPDIR:-/tmp}/docfresh-marked-smoke.json"

node -e "const fs=require('node:fs'); const report=JSON.parse(fs.readFileSync(process.argv[1], 'utf8')); if (!report.ok || report.summary.smokeCommands !== 1) process.exit(1);" "${TMPDIR:-/tmp}/docfresh-marked-smoke.json"

echo "JSON report: ${TMPDIR:-/tmp}/docfresh-marked-smoke.json"
