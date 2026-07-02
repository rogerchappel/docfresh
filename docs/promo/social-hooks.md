# DocFresh Social Hooks

Grounded copy for public promotion. Pair these hooks with the checked-in demo
script or a terminal capture of the commands in the README.

## Short hooks

- DocFresh checks README and docs examples against the repository they describe.
- Local docs drift check: links, backticked file refs, package commands, and
  opted-in smoke blocks.
- Demo arc: scan `examples/basic`, show a clean report, then point at
  `examples/stale` as the failing fixture.
- Agent-friendly output is built in with `--format json`.

## Video prompt

Open `examples/basic/README.md`, run `bash demo/run-docfresh-basic.sh`, then
show `/tmp/docfresh-valid-docs.json`. Close by showing that smoke commands
only run with both an explicit `docfresh: smoke` marker and `--smoke`.
