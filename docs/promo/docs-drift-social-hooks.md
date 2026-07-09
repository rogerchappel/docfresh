# DocFresh Social Hooks

## Positioning

DocFresh is a local-first CLI for checking whether README and docs examples still match the repository they describe.

## Hooks

- Your README can pass CI too. DocFresh checks local links, file references, documented package commands, and opted-in smoke examples without calling a hosted service.
- The docs drift demo is deliberately tiny: one example repo passes, one stale fixture fails, and both produce JSON reports you can inspect in `/tmp`.
- For agent-authored docs, DocFresh gives reviewers a concrete artifact: did the generated README still point at real files and package scripts?
- It does not run arbitrary Markdown commands by default. Smoke commands only run when a fenced block is explicitly marked with `docfresh: smoke`.
- Good first demo: `bash demo/run-docs-drift-demo.sh`, then compare `/tmp/docfresh-demo/basic.json` with `/tmp/docfresh-demo/stale.json`.

## Video Seed

Show a stale docs fixture failing, then the passing basic fixture. Keep the message narrow: local docs checks, explicit smoke opt-in, JSON output for automation.
