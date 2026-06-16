# DocFresh Social Hooks

## Positioning

DocFresh is a local-first README and docs freshness checker for small developer
tool repos. It checks local markdown links, backticked file references, package
script mentions, package metadata coverage, and explicit smoke examples without
calling hosted services by default.

## Short posts

1. Docs drift often starts small: one renamed file, one deleted npm script, one
   stale README example. DocFresh catches those local-first before review.

2. I built DocFresh for the boring checks that keep agent-written docs honest:
   local links, file references, package scripts, README metadata, and opted-in
   smoke commands.

3. `node dist/cli.js check --root fixtures/valid-docs --format json` gives
   agents and scripts a stable report they can inspect without uploading repo
   contents anywhere.

4. Smoke examples should be explicit. DocFresh only runs fenced commands marked
   with `docfresh: smoke`, so docs checks stay reviewable instead of surprising.

## Demo CTA

Run:

```sh
bash examples/check-valid-docs-demo.sh
```

Then open the temporary text and JSON reports to show the same fixture through
human-readable and script-readable outputs.
