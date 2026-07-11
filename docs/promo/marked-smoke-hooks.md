# DocFresh Marked-Smoke Hooks

## Short Posts

- Your README can be checked like code without letting every fenced command
  execute. DocFresh only runs blocks marked `docfresh: smoke`.
- Tiny docs drift demo: one README, one opted-in smoke command, one local JSON
  report. No hosted service required.
- `docfresh check --smoke` is for examples you meant to execute, not every
  command a maintainer wrote for humans.

## Demo Angle

Run `bash examples/marked-smoke-demo.sh`, open
`examples/marked-smoke/README.md`, then show the JSON report with
`"smokeChecks": 1` and `"ok": true`.

## Grounded Claims

- DocFresh scans local markdown and README/package metadata.
- Smoke commands require the `docfresh: smoke` fence marker.
- The marked-smoke demo verifies both text and JSON output locally.
