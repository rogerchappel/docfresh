# Contributing

DocFresh is a local-first documentation freshness checker. Contributions should keep that contract simple and predictable.

## Development

```sh
npm install
npm run check
npm test
npm run smoke
bash scripts/validate.sh
```

## Expectations

- Add or update fixtures for scanner behavior changes.
- Keep command execution opt-in; do not run undocumented commands by default.
- Avoid telemetry, remote calls, and secret-bearing fixtures.
- Prefer small, reviewable changes with clear failure output.
- Keep JSON output stable unless the change is intentional and documented.

## Pull Requests

Include the problem, the behavior change, and the verification commands you ran. For new checks, include at least one passing and one failing fixture where practical.

