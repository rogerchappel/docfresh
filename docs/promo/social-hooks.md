# DocFresh Social Hooks

## Short posts

1. DocFresh checks whether README examples still match the local repo: links, backticked files, package scripts, package metadata, and opt-in smoke blocks.
2. Agent-written docs need receipts. DocFresh gives a local `check` command that can fail stale README examples before review.
3. The useful default is conservative: scan docs without running arbitrary commands, then opt in to smoke blocks only when the docs mark them explicitly.

## Demo angle

Run `bash demo/run-docs-sweep.sh`, then show the passing fixture and the stale fixture side by side. The story is simple: one command produces a human-readable report and stable JSON, and stale docs exit non-zero.

## CTA

Try the fixture-backed sweep first:

```sh
npm run build
bash demo/run-docs-sweep.sh
```
