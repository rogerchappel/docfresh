# DocFresh Tasks

## Completed MVP Scope

- [x] Scaffold `docfresh` from StackForge `oss-cli`.
- [x] Preserve PRD source attribution in `docs/PRD.md`.
- [x] Build a local-first TypeScript CLI.
- [x] Scan markdown files for local links, file references, command blocks, and package script references.
- [x] Check package metadata coverage in README.
- [x] Run only commands explicitly marked with `docfresh: smoke`.
- [x] Emit actionable text and JSON reports.
- [x] Add fixture-backed tests for valid docs, stale docs, and failing smoke commands.
- [x] Add README, SECURITY, CONTRIBUTING, examples, package metadata, CI, and validation script.

## Follow-up Candidates

- [ ] Add hosted URL checking as an opt-in plugin after the local checker stabilizes.
- [ ] Add markdown heading-fragment validation for local anchors.
- [ ] Add configurable ignore rules for generated docs.
- [ ] Publish signed npm packages after release credentials and policy are configured.

