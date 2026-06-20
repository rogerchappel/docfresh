# README Readiness Gate

This recipe uses two committed fixtures to show how DocFresh separates clean
documentation from a README that is technically valid but thin.

## Run it

```sh
bash demo/readme-readiness-gate.sh
```

The script builds the local CLI, checks `fixtures/valid-docs` as JSON, checks
`fixtures/minimal-readme` as text, and writes both reports under:

```text
/tmp/docfresh-readme-readiness
```

## What to look for

- `valid-docs.json` should contain an empty findings list.
- `minimal-readme.txt` should include `missing-package-metadata` warnings for
  the missing install and usage examples.

The minimal README fixture exits successfully because these are warnings, not
errors. That makes the demo useful for a pre-release docs review where the goal
is to improve copy-paste readiness without blocking every PR.

## Promotion angle

DocFresh can be shown as a local README review gate: one fixture proves the
clean path, and the second fixture creates concrete reviewer notes without
calling a hosted service or executing arbitrary examples.
