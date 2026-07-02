# Local Docs Freshness Demo

This recipe shows how DocFresh turns README examples into a local release check. It uses checked-in fixtures, so it is safe to run without network access or private repositories.

## Prerequisites

```sh
npm install
npm run build
```

## Run the fixture demo

```sh
bash examples/run-docfresh-demo.sh
```

The demo runs three checks:

- `fixtures/valid-docs` passes with no findings.
- `fixtures/stale-docs` fails because the README points at stale or missing project facts.
- A JSON report is written to a temporary file and checked for `ok: false` plus findings.

## Use the same pattern in another repo

```sh
node dist/cli.js check --root /path/to/repo --format text
node dist/cli.js check --root /path/to/repo --format json > docfresh-report.json
```

Use `--smoke` only when the Markdown fences are explicitly marked with `docfresh: smoke`.
