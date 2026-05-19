# DocFresh Docs

DocFresh validates docs against local repository state.

## Commands

```sh
node dist/cli.js check --root .
node dist/cli.js check --root . --format json
node dist/cli.js check --root . --smoke
```

## Policies

- Local-first: all checks run against files in the checkout.
- Safe by default: smoke commands require both a `docfresh: smoke` marker and the `--smoke` flag.
- Actionable reports: every finding includes a file, line, message, and suggested fix.

## Planning

- [PRD](PRD.md)
- [Tasks](TASKS.md)
- [Orchestration](ORCHESTRATION.md)

