# Docs Drift Launch Notes

These notes are grounded in existing runnable demos:

- `bash demo/stale-docs-report.sh`
- `bash demo/package-script-reference-sweep.sh`
- `bash demo/ci-docs-drift.sh`
- `bash demo/run-json-drift-demo.sh`

## Positioning

DocFresh checks whether README and docs examples still match the repository.
It focuses on local markdown links, file references, package script commands,
package metadata, and opted-in smoke blocks.

Use it before release review or after agent-generated docs changes, where a
maintainer needs fast evidence that copy-paste commands and local references are
still true.

## What to show

1. Run `bash demo/stale-docs-report.sh` to show a review-worthy failure.
2. Run `bash demo/package-script-reference-sweep.sh` to show stale package
   scripts and broken local references.
3. Run `bash demo/run-json-drift-demo.sh` to capture both passing and stale JSON
   reports.
4. Show that smoke commands require an explicit `docfresh: smoke` marker.

## Safe claims

- Finds broken local markdown links and file references.
- Flags documented package commands that do not exist.
- Emits text or JSON reports for local review.
- Runs smoke blocks only when docs explicitly opt in.

## Avoid claiming

- Full website crawling.
- Hosted documentation monitoring.
- Automatic command repair.
- Secret-safe execution of arbitrary commands.

## Short posts

- Docs drift is easier to fix before release review. DocFresh checks local
  links, file references, package scripts, and opted-in smoke blocks.
- A README can look polished and still point at a deleted script. This demo
  makes that failure visible in text and JSON.
- Agent-generated docs need a local gate. DocFresh gives maintainers a small
  command for stale references before the PR gets noisy.
