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
