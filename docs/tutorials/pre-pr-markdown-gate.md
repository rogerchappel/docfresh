# Pre-PR Markdown Gate

This recipe shows a narrow `docfresh` check for one Markdown file before a PR is
opened. It uses the checked-in `fixtures/valid-docs` and `fixtures/stale-docs`
directories, so the pass and fail paths are repeatable.

## Run it

```sh
bash examples/pre-pr-markdown-gate.sh
```

The script:

- builds the CLI
- scans only `README.md` in the fresh fixture
- scans only `README.md` in the stale fixture
- confirms the stale fixture exits with status `1`
- checks that the JSON reports include `ok` and `findings` fields

## Where it fits

Use this demo when a maintainer wants a small documentation gate before review,
without running every smoke example in the repository.
