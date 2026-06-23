# Video Brief: README Examples as a Release Gate

## Viewer

Maintainers of small CLI and developer-tool repositories who want a cheap way to catch stale README examples before release.

## Demo arc

1. Open with a README command that looks fine but can drift from `package.json` and local files.
2. Run `npm run build`.
3. Run `bash examples/run-docfresh-demo.sh`.
4. Show the passing fixture, then the stale fixture failing with actionable findings.
5. Show the JSON report path for agents and CI wrappers.

## On-screen commands

```sh
npm run build
bash examples/run-docfresh-demo.sh
node dist/cli.js check --root fixtures/valid-docs --smoke
```

## Honest limitations

- DocFresh is local-first and only checks local Markdown, package metadata, file references, and opted-in smoke fences.
- Smoke commands are never run unless the fenced block is explicitly marked `docfresh: smoke`.
- The tool reports drift; it does not rewrite documentation.

## Angle

Show how DocFresh catches stale README examples with a local CLI before a reviewer or user copies a broken command.

## Demo Beats

1. Open `fixtures/valid-docs/README.md` and show that it has local links and safe opted-in smoke commands.
2. Run `bash demo/readme-smoke-check.sh`.
3. Show `demo/output/valid-docs.txt` for the passing check.
4. Show `demo/output/stale-docs.txt` to demonstrate broken references in `fixtures/stale-docs`.
5. Show `demo/output/valid-docs.json` as the machine-readable output for automation.

## Commands

```sh
npm install
bash demo/readme-smoke-check.sh
node dist/cli.js check --root fixtures/valid-docs --smoke
```

## Boundaries To Mention

- DocFresh does not run arbitrary fenced commands by default.
- Smoke commands run only when fenced with `docfresh: smoke` and `--smoke` is provided.
- The CLI is local-first and checks files in the repository.
