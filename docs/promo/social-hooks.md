# Social Hooks

## Short posts

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
