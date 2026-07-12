# DocFresh

DocFresh is a local-first CLI that checks whether README and docs examples still match the repository they describe.

It scans markdown files for local links, file references, package script commands, README package metadata, and explicitly marked smoke examples. It does not call hosted services, phone home, or run arbitrary commands by default.

## Install

Install the CLI from npm:

```sh
npm install -g @rogerchappel/docfresh
docfresh --help
```

Or run it without a global install:

```sh
npx @rogerchappel/docfresh --help
```

For local development:

```sh
npm install
npm run build
node dist/cli.js --help
```

## Use

Check the current repository:

```sh
docfresh check
```

Check another local repository and print JSON:

```sh
docfresh check --root fixtures/valid-docs --format json
```

Run opted-in smoke examples:

```sh
docfresh check --root fixtures/valid-docs --smoke
```

Run a copy-pasteable fixture demo that builds the CLI and captures both text and
JSON reports:

```sh
bash examples/check-valid-docs-demo.sh
```

Smoke commands only run when the fenced block is explicitly marked:

````md
```sh docfresh: smoke
node --version
```
````

## What It Checks

- Broken local markdown links such as `[Guide](docs/missing.md)`.
- Backticked file references such as `src/index.ts`.
- Documented package commands such as `npm run build` or `pnpm check`.
- Basic README install and usage coverage for package repositories.
- Failing commands in fenced blocks marked with `docfresh: smoke` when `--smoke` is enabled.

## Output

Text output is optimized for terminal review:

```sh
docfresh check --root fixtures/stale-docs
```

JSON output is stable enough for scripts and agents:

```sh
docfresh check --root fixtures/stale-docs --format json
```

DocFresh exits with `0` when no error findings are present and `1` when documentation drift is found.

## Demo

Generate pass/fail JSON reports from the checked-in fixtures:

```sh
bash demo/run-json-drift-demo.sh
```

The script writes `.docfresh-demo/valid-docs.json` and
`.docfresh-demo/stale-docs.json` so reviewers can inspect both sides of the
drift signal. See [JSON Drift Report Demo](docs/tutorials/json-drift-report.md)
for the walkthrough.

## Verify

```sh
npm run check
npm test
npm run build
npm run smoke
npm run package:smoke
bash scripts/validate.sh
```

## Examples

- `examples/basic` passes.
- `examples/stale` intentionally fails.
- `fixtures/valid-docs`, `fixtures/stale-docs`, and `fixtures/smoke-fail` back the automated tests.
- `demo/run-docfresh-basic.sh` runs a short README freshness demo and verifies
  the JSON report for the passing fixture.
- `bash examples/run-docfresh-demo.sh` runs a fixture-backed freshness demo and checks a JSON report.

## Demo and Promotion

- [Local docs freshness demo](docs/tutorials/local-docs-freshness.md)
- [README Freshness Demo](docs/tutorials/readme-freshness-demo.md)
- [Video brief](docs/promo/video-brief.md)
- [Social hooks](docs/promo/social-hooks.md)

## Demo

Run the fixture-backed demo to capture passing, stale, JSON, and smoke-check outputs:

```sh
bash demo/readme-smoke-check.sh
```

See [docs/tutorials/readme-smoke-gate.md](docs/tutorials/readme-smoke-gate.md) for a pull request workflow that starts with regular docs drift checks and adds opted-in smoke commands.

For a fixture-backed demo that writes both a clean JSON report and a stale text
report, run:

```sh
bash demo/readme-drift-smoke.sh
```

See [the README drift demo](docs/tutorials/readme-drift-demo.md) for a
walkthrough script and promotion-safe talking points.

## Demo Recipes

Run a passing fixture and capture text and JSON reports:

```sh
bash examples/check-valid-docs-demo.sh
```

Run the stale-docs fixture and confirm DocFresh reports review-worthy drift:

```sh
bash demo/stale-docs-report.sh
```

Compare a clean README fixture with a thin README that needs install and usage
metadata:

```sh
bash demo/readme-readiness-gate.sh
```

See [docs/tutorials/readme-readiness-gate.md](docs/tutorials/readme-readiness-gate.md)
for a pre-release docs review workflow.

Capture the expected failure path for a stale package script and broken local
references:

```sh
bash demo/package-script-reference-sweep.sh
```

See [docs/tutorials/package-script-reference-sweep.md](docs/tutorials/package-script-reference-sweep.md)
for the walkthrough and
[docs/promo/package-script-reference-social-hooks.md](docs/promo/package-script-reference-social-hooks.md)
for promotion-safe hooks.

For promotion or screencast prep, see
[`docs/promo/stale-docs-video-brief.md`](docs/promo/stale-docs-video-brief.md).

For a runnable CI-style drift check, see
[CI Docs Drift Check](docs/tutorials/ci-docs-drift-check.md):

```sh
bash demo/ci-docs-drift.sh
```

Promotion-ready hooks for that CI demo live in
[`docs/promo/ci-docs-drift-social-hooks.md`](docs/promo/ci-docs-drift-social-hooks.md).

For a pre-PR demo that writes both passing and stale-docs reports to a temporary directory:

```sh
npm run build
bash demo/run-docs-sweep.sh
```

See [`docs/tutorials/pre-pr-docs-sweep.md`](docs/tutorials/pre-pr-docs-sweep.md) for the walkthrough and [`docs/promo/social-hooks.md`](docs/promo/social-hooks.md) for grounded promotion copy.
For a short screencast outline of the same flow, see
[`docs/promo/pre-pr-docs-sweep-video-brief.md`](docs/promo/pre-pr-docs-sweep-video-brief.md).

## Source Attribution

Inspired by markdown link checkers, README smoke tests, and docs-as-tests practices. Reframed for local developer-tool repos and agent-generated documentation.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep changes local-first, fixture-backed, and free of telemetry.

## Security

See [SECURITY.md](SECURITY.md). Do not include secrets in fixtures, examples, tests, or issue reports.
## Release readiness

Run the same checks expected before opening or cutting a release:

```sh
npm run check
npm run test
npm run build
npm run smoke
npm run package:smoke
npm run release:check
```

Use `npm run package:smoke` to confirm the published package contains the CLI/runtime files, checked-in demo assets, fixtures, docs, README, license, security, support, and release notes.

## Development

Use Node.js 20 or newer. Run these checks before opening a PR:

```sh
npm run build
npm run check
npm test
npm run smoke
npm run package:smoke
npm run release:check
```

## License
MIT

## Limitations

docfresh is a local-first helper for preparing reviewable evidence. It does not replace human review, live system validation, or project-specific policy checks, and generated output should be inspected before use in release or operational decisions.
