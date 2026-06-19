# DocFresh Video Brief

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
