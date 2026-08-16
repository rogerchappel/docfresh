import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

test('CLI prints package version', async () => {
  const pkg = JSON.parse(await readFile('package.json', 'utf8')) as { version: string };
  const { stdout } = await execFileAsync(process.execPath, ['dist/cli.js', '--version']);
  assert.equal(stdout, `${pkg.version}\n`);
});

test('CLI returns JSON reports', async () => {
  const { stdout } = await execFileAsync(process.execPath, [
    'dist/cli.js',
    'check',
    '--root',
    'fixtures/valid-docs',
    '--format',
    'json'
  ]);

  const report = JSON.parse(stdout) as { ok: boolean; summary: { markdownFiles: number } };
  assert.equal(report.ok, true);
  assert.equal(report.summary.markdownFiles, 2);
});

test('CLI accepts repository-root links with URL query and fragment components', async () => {
  const { stdout } = await execFileAsync(process.execPath, [
    'dist/cli.js',
    'check',
    '--root',
    'fixtures/local-link-url-forms',
    '--format',
    'json'
  ]);

  const report = JSON.parse(stdout) as { ok: boolean; findings: unknown[] };
  assert.equal(report.ok, true);
  assert.deepEqual(report.findings, []);
});

test('CLI exits non-zero when drift is found', async () => {
  await assert.rejects(
    execFileAsync(process.execPath, ['dist/cli.js', 'check', '--root', 'fixtures/stale-docs']),
    (error: unknown) => {
      assert.equal(typeof error, 'object');
      assert.match(String((error as { stdout?: string }).stdout), /documentation drift/);
      return true;
    }
  );
});

test('CLI reports malformed local link encoding in text and JSON formats', async () => {
  for (const format of ['text', 'json']) {
    await assert.rejects(
      execFileAsync(process.execPath, [
        'dist/cli.js',
        'check',
        '--root',
        'fixtures/percent-encoded-links',
        '--format',
        format
      ]),
      (error: unknown) => {
        const stdout = String((error as { stdout?: string }).stdout);
        assert.match(stdout, /invalid-local-link/);
        assert.match(stdout, /README\.md/);
        assert.match(stdout, /docs\/inline%ZZ\.md/);
        assert.match(stdout, /docs\/reference%E0%A4%A\.md/);
        return true;
      }
    );
  }
});
