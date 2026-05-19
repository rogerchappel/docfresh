# Security Policy

DocFresh is designed to run locally against repositories you already have on disk. It does not collect telemetry, send reports to hosted services, or perform network checks by default.

## Supported Versions

The `main` branch is the only supported development line before the first stable release.

## Reporting a Vulnerability

Please do not open a public issue with exploit details. Use GitHub private vulnerability reporting for `rogerchappel/docfresh` when available, or contact the maintainer for a private disclosure path.

Include:

- The affected version or commit.
- Minimal reproduction steps.
- Whether a crafted markdown file, package metadata file, or smoke command is required.
- Any observed impact.

## Scope

In scope:

- Unsafe default command execution.
- Path traversal or repository-boundary mistakes.
- Incorrect handling of untrusted markdown content.
- CI, release, or dependency security issues in this repository.

Out of scope:

- Stale documentation findings in third-party repositories.
- Commands a user explicitly opted into with `--smoke` and `docfresh: smoke`, unless DocFresh executes something other than the marked command.

## Secrets

Do not put secrets in fixtures, examples, screenshots, or issue reports. DocFresh test data should remain synthetic.

