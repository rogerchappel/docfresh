import assert from 'node:assert/strict';
import { test } from 'node:test';
import { scanRepository } from './scanner.js';

test('valid fixture has no freshness findings', async () => {
  const report = await scanRepository({
    root: 'fixtures/valid-docs',
    runSmoke: false
  });

  assert.equal(report.ok, true);
  assert.equal(report.summary.markdownFiles, 2);
  assert.deepEqual(report.findings, []);
});

test('stale fixture reports missing scripts, links, and files', async () => {
  const report = await scanRepository({
    root: 'fixtures/stale-docs',
    runSmoke: false
  });

  assert.equal(report.ok, false);
  assert.deepEqual(report.findings.map((finding) => finding.kind).sort(), [
    'broken-local-link',
    'missing-file',
    'missing-package-script'
  ]);
});

test('fenced code examples are excluded from link and file validation', async () => {
  const report = await scanRepository({ root: 'fixtures/fenced-links', runSmoke: false });
  assert.equal(report.ok, false);
  assert.deepEqual(report.findings.map((finding) => finding.message), [
    'Local link target "docs/missing-before.md" does not exist.',
    'Local link target "docs/missing-after.md" does not exist.'
  ]);
});

test('local links preserve balanced and escaped parentheses in destinations', async () => {
  const report = await scanRepository({
    root: 'fixtures/parenthesized-links',
    runSmoke: false
  });

  assert.equal(report.ok, false);
  assert.deepEqual(
    report.findings.filter((finding) => finding.kind === 'broken-local-link'),
    [{
      kind: 'broken-local-link',
      severity: 'error',
      file: 'README.md',
      line: 6,
      message: 'Local link target "docs/missing(2).md" does not exist.',
      suggestion: 'Fix the link target or add the referenced file.'
    }]
  );
});

test('local links support angle-bracket destinations and reference definitions', async () => {
  const report = await scanRepository({
    root: 'fixtures/commonmark-links',
    runSmoke: false
  });

  assert.equal(report.ok, false);
  assert.deepEqual(
    report.findings.filter((finding) => finding.kind === 'broken-local-link'),
    [
      {
        kind: 'broken-local-link',
        severity: 'error',
        file: 'README.md',
        line: 4,
        message: 'Local link target "docs/missing guide.md" does not exist.',
        suggestion: 'Fix the link target or add the referenced file.'
      },
      {
        kind: 'broken-local-link',
        severity: 'error',
        file: 'README.md',
        line: 7,
        message: 'Local link target "docs/missing-reference.md" does not exist.',
        suggestion: 'Fix the link target or add the referenced file.'
      }
    ]
  );
});

test('malformed percent-encoding produces findings without aborting local link checks', async () => {
  const report = await scanRepository({
    root: 'fixtures/percent-encoded-links',
    runSmoke: false
  });

  assert.equal(report.ok, false);
  assert.deepEqual(report.findings.filter((finding) => finding.kind === 'invalid-local-link'), [
    {
      kind: 'invalid-local-link',
      severity: 'error',
      file: 'README.md',
      line: 4,
      message: 'Local link target "docs/inline%ZZ.md" has malformed percent-encoding.',
      suggestion: 'Replace invalid percent escapes with valid percent-encoding or literal characters.'
    },
    {
      kind: 'invalid-local-link',
      severity: 'error',
      file: 'README.md',
      line: 6,
      message: 'Local link target "docs/reference%E0%A4%A.md" has malformed percent-encoding.',
      suggestion: 'Replace invalid percent escapes with valid percent-encoding or literal characters.'
    }
  ]);
});

test('local links support repository-root paths, URL components, and protocol-relative URLs', async () => {
  const report = await scanRepository({
    root: 'fixtures/local-link-url-forms',
    runSmoke: false
  });

  assert.equal(report.ok, true);
  assert.deepEqual(report.findings, []);
});

test('local image destinations use the same local-reference rules as links', async () => {
  const report = await scanRepository({
    root: 'fixtures/image-links',
    runSmoke: false
  });

  assert.equal(report.ok, false);
  assert.deepEqual(
    report.findings.filter((finding) => finding.kind === 'broken-local-link'),
    [
      {
        kind: 'broken-local-link',
        severity: 'error',
        file: 'README.md',
        line: 4,
        message: 'Local link target "assets/missing.png" does not exist.',
        suggestion: 'Fix the link target or add the referenced file.'
      },
      {
        kind: 'broken-local-link',
        severity: 'error',
        file: 'README.md',
        line: 13,
        message: 'Local link target "assets/missing-reference.png" does not exist.',
        suggestion: 'Fix the link target or add the referenced file.'
      }
    ]
  );
});

test('scanner can limit checks to explicit markdown files', async () => {
  const report = await scanRepository({
    root: 'fixtures/valid-docs',
    markdown: ['docs/guide.md'],
    runSmoke: false
  });

  assert.equal(report.ok, true);
  assert.equal(report.summary.markdownFiles, 1);
  assert.equal(report.findings.length, 0);
});

test('nested docs resolve bare paths from the repository root', async () => {
  const report = await scanRepository({
    root: 'fixtures/root-references',
    runSmoke: false
  });

  assert.equal(report.ok, false);
  assert.deepEqual(
    report.findings
      .filter((finding) => finding.kind === 'missing-file')
      .map((finding) => [finding.file, finding.message]),
    [
      ['docs/tutorials/guide.md', 'Referenced file "./missing.md" does not exist.'],
      ['docs/tutorials/guide.md', 'Referenced file "src/absent.js" does not exist.']
    ]
  );
});

test('multiline command fences check each package script independently', async () => {
  const report = await scanRepository({
    root: 'fixtures/multiline-commands',
    runSmoke: false
  });

  const missingScripts = report.findings.filter((finding) => finding.kind === 'missing-package-script');
  assert.equal(report.ok, false);
  assert.equal(missingScripts.length, 1);
  assert.deepEqual(missingScripts[0], {
    kind: 'missing-package-script',
    severity: 'error',
    file: 'README.md',
    line: 13,
    message: 'Documented command "yarn run missing-script" references missing package script "missing-script".',
    suggestion: 'Add the package script or update the documented command.'
  });
});

test('chained command fixtures report missing scripts from later segments', async () => {
  const report = await scanRepository({
    root: 'fixtures/chained-commands',
    runSmoke: false
  });

  assert.deepEqual(report.findings.filter((finding) => finding.kind === 'missing-package-script'), [{
    kind: 'missing-package-script',
    severity: 'error',
    file: 'README.md',
    line: 7,
    message: 'Documented command "npm run missing" references missing package script "missing".',
    suggestion: 'Add the package script or update the documented command.'
  }]);
});

test('CommonMark fences feed package-script and opted-in smoke checks', async () => {
  const skipped = await scanRepository({
    root: 'fixtures/commonmark-fences',
    runSmoke: false
  });

  assert.deepEqual(
    skipped.findings
      .filter((finding) => finding.kind === 'missing-package-script')
      .map((finding) => finding.message),
    [
      'Documented command "npm run missing-npm" references missing package script "missing-npm".',
      'Documented command "pnpm run missing-pnpm" references missing package script "missing-pnpm".',
      'Documented command "yarn missing-yarn" references missing package script "missing-yarn".',
      'Documented command "bun missing-bun" references missing package script "missing-bun".'
    ]
  );
  assert.equal(skipped.summary.smokeCommands, 0);

  const smoked = await scanRepository({
    root: 'fixtures/commonmark-fences',
    runSmoke: true
  });

  assert.equal(smoked.summary.smokeCommands, 1);
  assert.equal(smoked.findings.filter((finding) => finding.kind === 'smoke-failed').length, 1);
});

test('README metadata gaps are warnings', async () => {
  const report = await scanRepository({
    root: 'fixtures/minimal-readme',
    runSmoke: false
  });

  assert.equal(report.ok, true);
  assert.deepEqual(report.findings.map((finding) => finding.kind), [
    'missing-package-metadata',
    'missing-package-metadata'
  ]);
  assert.deepEqual(new Set(report.findings.map((finding) => finding.severity)), new Set(['warning']));
});

test('smoke commands run only when requested', async () => {
  const skipped = await scanRepository({
    root: 'fixtures/smoke-fail',
    runSmoke: false
  });
  assert.equal(skipped.ok, true);
  assert.equal(skipped.summary.smokeCommands, 0);

  const smoked = await scanRepository({
    root: 'fixtures/smoke-fail',
    runSmoke: true
  });
  assert.equal(smoked.ok, false);
  assert.equal(smoked.summary.smokeCommands, 1);
  assert.equal(smoked.findings[0]?.kind, 'smoke-failed');
});
