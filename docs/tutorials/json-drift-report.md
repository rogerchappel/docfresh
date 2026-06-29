# JSON Drift Report Demo

DocFresh can emit deterministic JSON for agent workflows and CI jobs that need
to route documentation drift findings.

## Build the CLI

```sh
npm run build
```

## Capture a passing report

```sh
node dist/cli.js check --root fixtures/valid-docs --format json
```

The valid fixture includes README links, documented package scripts, and local
file references that line up with the repository.

## Capture an intentional drift report

```sh
node dist/cli.js check --root fixtures/stale-docs --format json
```

The stale fixture is expected to exit `1`. Its JSON report is useful for demos
because it shows DocFresh finding documentation drift without touching hosted
services or running arbitrary commands.

## One-command demo

```sh
bash demo/run-json-drift-demo.sh
```

The script writes `.docfresh-demo/valid-docs.json` and
`.docfresh-demo/stale-docs.json`, then checks that the reports contain the
expected pass/fail shape.
