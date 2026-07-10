# CI Docs Drift Social Hooks

## Short posts

1. Docs drift is easiest to fix when CI can point to a specific stale README
   example. DocFresh writes JSON evidence for both clean and stale fixture
   checks.

2. A good docs gate needs two proofs: a clean fixture passes, and a stale
   fixture fails for the right reason. `bash demo/ci-docs-drift.sh` captures
   both.

3. DocFresh does not run arbitrary Markdown commands. Smoke commands have to be
   explicitly marked with `docfresh: smoke`, which keeps the CI story boring in
   the best way.

## Demo angle

Run:

```sh
bash demo/ci-docs-drift.sh
```

Then open the temporary report directory and show `valid-docs.json` with
`"ok": true` beside `stale-docs.json` with `"ok": false`.

## Best clip

Show the stale fixture, run the script, and zoom in on the JSON error finding
that makes the failing docs gate reviewable.
