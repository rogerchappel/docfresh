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
