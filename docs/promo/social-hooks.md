# DocFresh Social Hooks

## Positioning

DocFresh is a local-first README and docs freshness checker for small developer
tool repos. It checks local markdown links, backticked file references, package
script mentions, package metadata coverage, and explicit smoke examples without
calling hosted services by default.

## Additional hooks

1. DocFresh makes README drift visible before release: local links, backticked file references, package commands, and opt-in smoke examples are checked from the repo itself.

2. New DocFresh demo: one fixture passes, one stale fixture fails, and the JSON report is ready for agents or CI wrappers.

3. README examples are easy to trust and easy to let rot. DocFresh gives small CLI repos a local, deterministic freshness check.

## Demo CTA

```sh
npm run build
bash examples/run-docfresh-demo.sh
```

## Grounding facts

- The demo uses `fixtures/valid-docs` and `fixtures/stale-docs`.
- JSON output is produced with `--format json`.
- Smoke commands run only with explicit `docfresh: smoke` fences and the `--smoke` flag.

## Short posts

1. DocFresh checks whether README examples still match the local repo: links, backticked files, package scripts, package metadata, and opt-in smoke blocks.

2. Agent-written docs need receipts. DocFresh gives a local `check` command that can fail stale README examples before review.

3. The useful default is conservative: scan docs without running arbitrary commands, then opt in to smoke blocks only when the docs mark them explicitly.

4. Docs drift often starts small: one renamed file, one deleted npm script, one
   stale README example. DocFresh catches those local-first before review.

5. I built DocFresh for the boring checks that keep agent-written docs honest:
   local links, file references, package scripts, README metadata, and opted-in
   smoke commands.

6. `node dist/cli.js check --root fixtures/valid-docs --format json` gives
   agents and scripts a stable report they can inspect without uploading repo
   contents anywhere.

7. Smoke examples should be explicit. DocFresh only runs fenced commands marked
   with `docfresh: smoke`, so docs checks stay reviewable instead of surprising.

8. Demo: `bash demo/readme-smoke-check.sh` creates passing text and JSON reports,
   then proves the stale fixture fails.

9. CI pattern: run `node dist/cli.js check --root .` on every pull request, then
   add `--smoke` for deterministic examples.

## Demo angle

Run `bash demo/run-docs-sweep.sh`, then show the passing fixture and the stale
fixture side by side. The story is simple: one command produces a human-readable
report and stable JSON, and stale docs exit non-zero.

## Demo CTA

Run:

```sh
bash examples/check-valid-docs-demo.sh
```

Then open the temporary text and JSON reports to show the same fixture through
human-readable and script-readable outputs.
