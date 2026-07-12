# Package Script Reference Social Hooks

Grounded source files:

- `fixtures/stale-docs/README.md`
- `demo/package-script-reference-sweep.sh`
- `docs/tutorials/package-script-reference-sweep.md`

## Short hooks

- "The README said `npm run missing`. DocFresh caught it before a person copied it."
- "Docs drift is not abstract: one stale package script can break every release checklist that copied it."
- "A failing docs check can still be a good demo when the failure is the evidence."

## Demo angle

Run `bash demo/package-script-reference-sweep.sh`, then open the text report and
show the `missing-package-script` finding beside the stale fixture README.

## Limitations to say out loud

- DocFresh only runs fenced smoke commands when they are explicitly marked.
- It checks local repository references and package scripts; it is not a hosted
  link crawler.
- Findings still need maintainer judgment before docs are rewritten.
