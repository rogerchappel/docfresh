# DocFresh

DocFresh is a local-first CLI that checks whether README and docs examples still match the repository they describe.

It scans markdown files for local links, file references, package script commands, README package metadata, and explicitly marked smoke examples. It does not call hosted services, phone home, or run arbitrary commands by default.

## Install

```sh
npm install
npm run build
```

## Use

Check the current repository:

```sh
node dist/cli.js check
```

Check another local repository and print JSON:

```sh
node dist/cli.js check --root fixtures/valid-docs --format json
```

Run opted-in smoke examples:

```sh
node dist/cli.js check --root fixtures/valid-docs --smoke
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
node dist/cli.js check --root fixtures/stale-docs
```

JSON output is stable enough for scripts and agents:

```sh
node dist/cli.js check --root fixtures/stale-docs --format json
```

DocFresh exits with `0` when no error findings are present and `1` when documentation drift is found.

## Verify

```sh
npm run check
npm test
npm run build
npm run smoke
bash scripts/validate.sh
```

## Examples

- `examples/basic` passes.
- `examples/stale` intentionally fails.
- `fixtures/valid-docs`, `fixtures/stale-docs`, and `fixtures/smoke-fail` back the automated tests.

## Source Attribution

Inspired by markdown link checkers, README smoke tests, and docs-as-tests practices. Reframed for local developer-tool repos and agent-generated documentation.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep changes local-first, fixture-backed, and free of telemetry.

## Security

See [SECURITY.md](SECURITY.md). Do not include secrets in fixtures, examples, tests, or issue reports.

## License

MIT

