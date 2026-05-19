# DocFresh Orchestration

DocFresh is owned by one factory worker and one repository: `/Users/roger/Developer/my-opensource/docfresh`.

## Source Inputs

- PRD: `/Users/roger/Developer/my-opensource/oss-ideas/ideas/in-progress/docfresh/PRD.md`
- Scaffold: `/Users/roger/Developer/my-opensource/stackforge`
- Template: `oss-cli`

## Build Contract

Run these checks before publishing or handing off:

```sh
npm run check
npm test
npm run build
npm run smoke
bash scripts/validate.sh
node dist/cli.js check --root fixtures/valid-docs --format text --smoke
```

## Release Contract

- GitHub repository: `rogerchappel/docfresh`
- Default branch: `main`
- Visibility: public
- Required local-first behavior: no telemetry, no secrets, no network checks by default.
- Branch protection is applied best-effort after the first push.

