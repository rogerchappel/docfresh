# Video Brief: Catch Stale README Examples Locally

## Angle

Show DocFresh finding documentation drift in the checked-in stale fixture, then
show the same findings as JSON for agent or CI review.

## Grounded product facts

- DocFresh checks local Markdown links, backticked file references, package
  script mentions, README package metadata, and opted-in smoke examples.
- It does not call hosted services by default.
- It exits non-zero when error findings are present.
- The `fixtures/stale-docs` fixture intentionally contains drift for demo and
  test coverage.

## Demo flow

1. Open `fixtures/stale-docs/README.md`.
2. Run `bash demo/stale-docs-report.sh`.
3. Show `${TMPDIR:-/tmp}/docfresh-stale-docs-demo/stale-docs.txt`.
4. Show `${TMPDIR:-/tmp}/docfresh-stale-docs-demo/stale-docs.json`.
5. Close by noting that smoke commands only run when a fenced block opts in with
   `docfresh: smoke`.

## Short hooks

- "Docs drift is easier to fix when the report points at the stale local file."
- "DocFresh turns README freshness into a local check, not a hosted upload."
- "Human-readable report for review, JSON report for agents and CI."
