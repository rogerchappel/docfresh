# README Smoke Gate

DocFresh can turn examples in Markdown into a lightweight pull request gate. This tutorial uses the repository fixtures so the behavior is reproducible.

## Run the Demo

```sh
bash demo/readme-smoke-check.sh
```

The script builds the CLI, checks a valid fixture, captures JSON output, confirms that `fixtures/stale-docs` fails, and runs opted-in smoke examples from `fixtures/valid-docs`.

Generated files:

- `demo/output/valid-docs.txt`
- `demo/output/valid-docs.json`
- `demo/output/stale-docs.txt`
- `demo/output/smoke.txt`

## Mark a Smoke Example

DocFresh does not run every fenced command. A command must opt in with `docfresh: smoke`:

````md
```sh docfresh: smoke
node --version
```
````

Then run:

```sh
node dist/cli.js check --root . --smoke
```

## CI Pattern

Use a regular documentation drift check for every pull request:

```yaml
- run: npm ci
- run: npm run build
- run: node dist/cli.js check --root .
```

Add `--smoke` when the repository has stable, safe commands marked with `docfresh: smoke`:

```yaml
- run: node dist/cli.js check --root . --smoke
```

## Rollout Notes

Start by checking links, file references, and package scripts. Add smoke blocks only for commands that are deterministic and do not require credentials, network access, or destructive side effects.
