# Markdown Reference Sweep Hooks

Grounding: `examples/markdown-reference-demo.sh` demonstrates the targeted
`--markdown README.md` mode against the checked-in `fixtures/valid-docs` and
`fixtures/stale-docs` fixture repositories.

## Short Posts

1. Docs-only PR? Run DocFresh against just the README first. The new Markdown
   reference demo checks a valid fixture, captures a stale JSON report, and
   keeps the whole flow local.

2. Small docs changes still deserve evidence. DocFresh can target one Markdown
   file, resolve links and file references against the repo root, and return
   JSON a CI job or reviewer can inspect.

3. The fastest docs drift check is the one scoped to the file you changed.
   `docfresh check --markdown README.md` is now backed by a runnable fixture
   demo that shows both passing and failing cases.

## Video Angle

Show a README edit in one terminal pane and the targeted DocFresh command in
the other. Cut from the passing valid fixture to the stale fixture JSON so the
viewer sees the local-first feedback loop without any service signup or hosted
dashboard.

## Limits To Mention

- DocFresh is deterministic and local-first.
- Smoke commands run only when fenced blocks opt in with `docfresh: smoke`.
- It is not an LLM judge and does not claim semantic documentation coverage.
