# Marked Smoke Checks

DocFresh does not run arbitrary fenced commands by default. A command only
runs during `--smoke` when the code fence is explicitly marked with
`docfresh: smoke`.

## Run the Demo

```sh
npm install
bash examples/marked-smoke-demo.sh
```

The fixture in `examples/marked-smoke/README.md` contains this opted-in block:

````md
```sh docfresh: smoke
node scripts/hello.js
```
````

The demo builds the CLI, scans the fixture with `--smoke`, writes a JSON report
to `${TMPDIR:-/tmp}/docfresh-marked-smoke.json`, and checks that exactly one
smoke command ran successfully.

## Safety Notes

Keep smoke examples short and deterministic. Prefer commands that read local
fixtures or print version/help output, and avoid network calls, publishing
steps, destructive cleanup, or commands that depend on private credentials.
