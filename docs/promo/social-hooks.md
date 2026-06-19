# DocFresh Social Hooks

1. README examples age fast. DocFresh checks local links, backticked file references, package scripts, and opted-in smoke commands before stale docs reach users.
2. Demo: `bash demo/readme-smoke-check.sh` creates passing text and JSON reports, then proves the stale fixture fails.
3. DocFresh only runs fenced commands that explicitly opt in with `docfresh: smoke`; regular checks stay local and non-executing.
4. CI pattern: run `node dist/cli.js check --root .` on every pull request, then add `--smoke` for deterministic examples.
