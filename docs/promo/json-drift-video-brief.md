# DocFresh JSON Drift Video Brief

## Angle

Show DocFresh as a local-first way to prove whether README and docs examples
still match a repository.

## Demo beats

1. Run `npm run build`.
2. Run `node dist/cli.js check --root fixtures/valid-docs --format json` and
   point out `"ok": true`.
3. Run `node dist/cli.js check --root fixtures/stale-docs --format json` and
   point out the non-zero exit plus `"ok": false`.
4. Run `bash demo/run-json-drift-demo.sh` to show the repeatable fixture-backed
   demo.

## Narration facts

- DocFresh scans local markdown links, file references, package script commands,
  README package metadata, and opted-in smoke examples.
- Smoke commands only run when fenced blocks are explicitly marked
  `docfresh: smoke`.
- The CLI exits `0` when no error findings are present and `1` when
  documentation drift is found.

## Limits to mention

- It does not call hosted services.
- It does not run arbitrary commands by default.
- The stale fixture is intentionally broken for demonstration.
