# Package Script Reference Sweep

This recipe demonstrates the failure path for a README that documents a package
script and local references that do not exist.

## Run it

```sh
npm install
bash demo/package-script-reference-sweep.sh
```

The script builds DocFresh, scans `fixtures/stale-docs` as text and JSON, and
expects both CLI calls to exit with status `1` because documentation drift is
present.

Reports are written under `${TMPDIR:-/tmp}/docfresh-package-script-sweep`.

## What the demo verifies

- A documented `npm run missing` command is reported as
  `missing-package-script`.
- A broken local link is reported as `broken-local-link`.
- The JSON report is machine-readable and contains `"ok": false`.
- The demo treats the non-zero DocFresh exit as expected evidence.

Use this when showing how DocFresh can catch README commands that become stale
before a maintainer or agent copies them into a release checklist.
