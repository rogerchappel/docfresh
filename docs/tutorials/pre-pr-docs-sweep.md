# Pre-PR Docs Sweep

This recipe uses DocFresh fixtures to show the two review outcomes maintainers need before a PR: a passing docs scan and a stale-docs failure.

## Run it

```sh
npm run build
bash demo/run-docs-sweep.sh
```

The script writes reports under a temporary directory and verifies both cases:

- `fixtures/valid-docs` exits `0` and produces text plus JSON reports.
- `fixtures/stale-docs` exits `1` and names the documentation drift.

## When to use it

Use this before opening a PR that changes README examples, package scripts, local links, or smoke-marked code blocks. The JSON output is useful for agents and automation; the text output is easier to paste into a human review.

## What not to claim

DocFresh does not run arbitrary README commands by default. Smoke commands run only when fenced code blocks opt in with `docfresh: smoke` and the CLI is called with `--smoke`.
