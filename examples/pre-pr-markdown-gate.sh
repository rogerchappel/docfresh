#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
out_dir="${TMPDIR:-/tmp}/docfresh-pre-pr-gate"

cd "$repo_root"
rm -rf "$out_dir"
mkdir -p "$out_dir"

npm run build

node dist/cli.js check \
  --root fixtures/valid-docs \
  --markdown README.md \
  --format json > "$out_dir/valid-readme.json"

set +e
node dist/cli.js check \
  --root fixtures/stale-docs \
  --markdown README.md \
  --format json > "$out_dir/stale-readme.json"
stale_status=$?
set -e

test "$stale_status" -eq 1
grep -q '"ok": true' "$out_dir/valid-readme.json"
grep -q '"ok": false' "$out_dir/stale-readme.json"
grep -q '"findings"' "$out_dir/stale-readme.json"

echo "Fresh README report: $out_dir/valid-readme.json"
echo "Stale README report: $out_dir/stale-readme.json"
echo "Expected stale fixture exit: $stale_status"
