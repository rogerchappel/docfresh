# Launch Note Draft: CI Docs Drift Check

DocFresh now has a small CI-oriented demo for README and docs drift checks.

Run:

```sh
bash demo/ci-docs-drift.sh
```

The demo builds the CLI, scans a valid fixture, scans an intentionally stale
fixture, and writes JSON reports under `${TMPDIR:-/tmp}/docfresh-ci-docs-drift`.
It asserts that the valid fixture reports `"ok": true` and the stale fixture
reports `"ok": false` with an error finding.

This is a useful promotion path because it shows the behavior a maintainer
cares about in CI: clean docs pass, stale docs fail, and machine-readable output
can be saved for review.

Important limitation: smoke commands still require explicit `docfresh: smoke`
fenced blocks and are only run when `--smoke` is passed.
