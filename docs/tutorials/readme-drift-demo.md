# README Drift Demo

This demo uses DocFresh's checked-in fixtures to show both sides of a docs
freshness review: a clean package README and an intentionally stale one.

## Run it

```sh
npm install
bash demo/readme-drift-smoke.sh
```

The script builds the CLI, writes a JSON report for `fixtures/valid-docs`, then
runs `fixtures/stale-docs` and confirms that drift exits non-zero.

## What to show in a walkthrough

- `fixtures/valid-docs/README.md` includes local links and package command
  references that match the fixture package.
- `fixtures/stale-docs/README.md` keeps broken or outdated references for a
  deterministic failure example.
- The stale text report is readable enough for a PR comment, while the valid
  JSON report is easier for release scripts to archive.
