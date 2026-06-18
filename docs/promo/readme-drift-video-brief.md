# DocFresh README Drift Video Brief

## Hook

"Docs rot fastest where they look most useful: install snippets, local links,
and package scripts. DocFresh checks those examples locally."

## Grounded demo beats

1. Open `fixtures/valid-docs/README.md` and show the matching package scripts.
2. Run `bash demo/readme-drift-smoke.sh`.
3. Show the generated valid JSON report.
4. Show the stale text report and the expected non-zero exit.
5. Close with the opt-in smoke model: DocFresh only runs fenced commands marked
   with `docfresh: smoke`.

## Avoid claims

- Do not say DocFresh executes arbitrary README commands by default.
- Do not claim full semantic documentation validation.
- Do not invent adoption or package-download metrics.
