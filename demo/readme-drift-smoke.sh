#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
out_dir="${TMPDIR:-/tmp}/docfresh-demo"

cd "$repo_root"
rm -rf "$out_dir"
mkdir -p "$out_dir"

npm run build

node dist/cli.js check --root fixtures/valid-docs --format json > "$out_dir/valid.json"

set +e
node dist/cli.js check --root fixtures/stale-docs --format text > "$out_dir/stale.txt"
stale_status=$?
set -e

test "$stale_status" -ne 0
test -s "$out_dir/valid.json"
test -s "$out_dir/stale.txt"
grep -q '"findings"' "$out_dir/valid.json"
grep -qi "missing" "$out_dir/stale.txt"

echo "Valid docs report: $out_dir/valid.json"
echo "Stale docs report: $out_dir/stale.txt"
echo "Expected stale docs exit: $stale_status"
