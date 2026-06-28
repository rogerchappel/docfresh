#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

rm -rf .docfresh-demo
mkdir -p .docfresh-demo

node dist/cli.js check --root fixtures/valid-docs --format json > .docfresh-demo/valid-docs.json

set +e
node dist/cli.js check --root fixtures/stale-docs --format json > .docfresh-demo/stale-docs.json
stale_status=$?
set -e

if [ "$stale_status" -ne 1 ]; then
  echo "expected stale fixture to exit 1, got $stale_status" >&2
  exit 1
fi

grep -q '"ok": true' .docfresh-demo/valid-docs.json
grep -q '"ok": false' .docfresh-demo/stale-docs.json
grep -q '"findings"' .docfresh-demo/stale-docs.json

echo "docfresh demo ok: wrote .docfresh-demo/valid-docs.json and .docfresh-demo/stale-docs.json"
