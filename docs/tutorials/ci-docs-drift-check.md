# CI Docs Drift Check

This recipe demonstrates the smallest CI gate for README and docs drift:

- scan a known-good fixture and expect success
- scan a stale fixture and expect a nonzero exit
- save JSON reports that a CI job can upload as artifacts

The stale fixture is intentionally broken, so the demo treats that failure as a
passing assertion.

## Run It

```sh
npm install
bash demo/ci-docs-drift.sh
```

The script writes reports to:

```text
${TMPDIR:-/tmp}/docfresh-ci-docs-drift/
```

Expected files:

- `valid-docs.json` with `"ok": true`
- `stale-docs.json` with `"ok": false` and at least one error finding

## CI Shape

For a real repository, the CI command is usually just:

```sh
node dist/cli.js check --root . --format json
```

Use `--smoke` only when the repository has opted-in fenced blocks such as:

````md
```sh docfresh: smoke
node --version
```
````

DocFresh does not run arbitrary fenced commands by default.

## Why This Helps

The demo gives maintainers a quick way to see how DocFresh behaves in both
success and failure cases. That makes it easier to decide where to place the
tool in CI and how to explain a failing docs-drift job in a pull request.
