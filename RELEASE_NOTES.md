# Release Notes

## Next

### Summary

- Prepare Docfresh for the next public release.

### Verification

- `npm run release:check`
- `npm run package:smoke`

### Upgrade Notes

- No breaking changes are planned for this readiness update.

### Maintainer Notes

- Confirm the package smoke installs the generated tarball, invokes
  `docfresh --help`, and includes README, license, security, support, and
  runtime assets before publishing.
- Keep registry-based npm and npx install instructions out of user
  documentation until the package is published.
