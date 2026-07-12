# Pre-PR Docs Sweep Video Brief

Grounded in `demo/run-docs-sweep.sh` and
`docs/tutorials/pre-pr-docs-sweep.md`.

## Goal

Show how DocFresh gives a maintainer a quick pre-PR check for README and docs
drift by comparing a passing fixture with an intentionally stale fixture.

## Shots

1. Start in the repository and run `npm run build`.
2. Run `bash demo/run-docs-sweep.sh`.
3. Show the temporary output directory containing the passing and stale reports.
4. Open the passing report to show the clean fixture path.
5. Open the stale report to show review-worthy docs drift without presenting it
   as a production benchmark.

## Voiceover beats

- "DocFresh checks local docs against the files and package scripts they refer
  to."
- "The pre-PR demo runs both sides: one fixture should pass, one fixture should
  produce drift."
- "That makes the artifact easy to paste into a review note without claiming
  anything about adoption, performance, or customer usage."

## Verification to show

Use the script's own checks as the receipt:

```bash
npm run build
bash demo/run-docs-sweep.sh
```
