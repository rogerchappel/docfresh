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
    message: 'Documented command "npm run missing-script" references missing package script "missing-script".',
    suggestion: 'Add the package script or update the documented command.'
  });
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
