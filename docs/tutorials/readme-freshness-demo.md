# README Freshness Demo

This tutorial shows the shortest local demo for DocFresh: scan a checked-in
example, emit machine-readable output, and confirm the example is still clean.

## Run the demo

```sh
bash demo/run-docfresh-basic.sh
```

The script runs `npm run build`, checks `examples/basic`, writes a JSON report
for `fixtures/valid-docs`, and verifies that the report has `ok: true`.

## Manual commands

```sh
npm run build
node dist/cli.js check --root examples/basic --format text
node dist/cli.js check --root fixtures/valid-docs --format json
```

## What to show in a recording

- `examples/basic/README.md` as the clean target.
- `examples/stale/README.md` as the intentional drift example.
- The text report for terminal review.
- The JSON report for agent or CI consumers.

## Limits to mention

DocFresh stays local-first and does not run arbitrary fenced commands by
default. Smoke examples only run when the fence is explicitly marked with
`docfresh: smoke` and the CLI is called with `--smoke`.
