#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

rm -rf demo/output
mkdir -p demo/output

npm run build >/dev/null

node dist/cli.js check --root fixtures/valid-docs --format text > demo/output/valid-docs.txt
node dist/cli.js check --root fixtures/valid-docs --format json > demo/output/valid-docs.json

if node dist/cli.js check --root fixtures/stale-docs --format text > demo/output/stale-docs.txt; then
  echo "Expected fixtures/stale-docs to report documentation drift." >&2
  exit 1
fi

node dist/cli.js check --root fixtures/valid-docs --smoke > demo/output/smoke.txt

grep -q "DocFresh passed" demo/output/valid-docs.txt
grep -q '"ok": true' demo/output/valid-docs.json
grep -q "README.md" demo/output/stale-docs.txt
grep -q "Smoke commands: 1" demo/output/smoke.txt

printf 'Wrote demo/output/valid-docs.txt, valid-docs.json, stale-docs.txt, and smoke.txt\n'
