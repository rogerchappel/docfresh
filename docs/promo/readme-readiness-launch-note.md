# README Readiness Launch Note

DocFresh now includes a small readiness demo that compares a clean docs fixture
with a README that is valid Markdown but missing copy-pasteable install and
usage guidance.

## What changed

- `demo/readme-readiness-gate.sh` writes JSON for `fixtures/valid-docs` and a
  text report for `fixtures/minimal-readme`.
- `docs/tutorials/readme-readiness-gate.md` explains why the minimal README
  produces warnings rather than errors.
- `README.md` links the demo from the demo recipes section.

## Suggested post

README checks do not have to wait for broken links. The new DocFresh readiness
demo shows a clean fixture next to a thin README that needs install and usage
metadata, then writes local reports you can use in a pre-release docs review.

Run it:

```sh
bash demo/readme-readiness-gate.sh
```

## Do not claim

- hosted scanning
- automatic docs repair
- that warnings should block every PR
