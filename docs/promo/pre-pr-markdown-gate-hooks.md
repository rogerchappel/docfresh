# Pre-PR Markdown Gate Hooks

Grounded demo: `bash examples/pre-pr-markdown-gate.sh`

## Short hooks

- `docfresh` can check one README before review, then return JSON that a script
  can gate on.
- The fastest docs check is often the narrow one: scan the Markdown file that
  changed and fail when local links or references drift.
- This demo shows the same `docfresh` command shape against a fresh fixture and
  a stale fixture, with the stale path expected to exit `1`.

## Video beat

1. Show the fresh fixture README with local links and file references.
2. Run `bash examples/pre-pr-markdown-gate.sh`.
3. Open the stale JSON report and point at the `findings` array.
4. Mention that smoke commands still require explicit `docfresh: smoke` opt-in.
