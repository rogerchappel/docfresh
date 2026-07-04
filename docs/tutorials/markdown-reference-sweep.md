# Markdown Reference Sweep

Use this recipe when a README or tutorial changed and you want a quick local
check before running a broader documentation gate.

DocFresh can narrow a run to a specific Markdown file while still resolving
local links, backticked file paths, package scripts, and opted-in smoke blocks
against the repository root.

## Run The Demo

```sh
npm install
bash examples/markdown-reference-demo.sh
```

The script builds the CLI, checks `fixtures/valid-docs/README.md`, and then
checks `fixtures/stale-docs/README.md` as an expected failing case. The stale
run writes JSON to a temporary directory so reviewers can see the machine
readable finding shape without changing the repository.

## Manual Commands

```sh
npm run build
node dist/cli.js check --root fixtures/valid-docs --markdown README.md --format text
node dist/cli.js check --root fixtures/stale-docs --markdown README.md --format json
```

Expected behavior:

- the valid fixture exits `0`
- the stale fixture exits `1`
- the JSON output includes `"ok": false` and at least one error finding

## Where This Fits

This is a useful pre-PR sweep for docs-only edits. Run the targeted Markdown
check first, then run a full repository check before publishing or cutting a
release:

```sh
npm run smoke
bash scripts/validate.sh
```
