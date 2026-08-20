import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

async function checkTag(tag: string) {
  return execFileAsync(process.execPath, ['scripts/check-release-tag.mjs', tag]);
}

test('release tag preflight accepts the package version tag', async () => {
  const { stdout } = await checkTag('v0.1.0');
  assert.match(stdout, /v0\.1\.0 matches package version 0\.1\.0/);
});

test('release tag preflight rejects missing, malformed, prerelease, and mismatched tags', async () => {
  const invalidTags = [undefined, '0.1.0', 'v0.1', 'v0.1.0-rc.1', 'v9.9.9'];

  for (const tag of invalidTags) {
    await assert.rejects(
      execFileAsync(process.execPath, [
        'scripts/check-release-tag.mjs',
        ...(tag === undefined ? [] : [tag])
      ]),
      (error: unknown) => {
        assert.match(String((error as { stderr?: string }).stderr), /release tag/i);
        return true;
      }
    );
  }
});

test('release workflow validates the tag before package and release creation', async () => {
  const workflow = await readFile('.github/workflows/release.yml', 'utf8');
  const preflight = workflow.indexOf('npm run release:tag-check -- "$GITHUB_REF_NAME"');
  const pack = workflow.indexOf('npm pack');
  const release = workflow.indexOf('gh release create');

  assert.ok(preflight >= 0, 'release workflow must invoke the tag preflight');
  assert.ok(preflight < pack, 'tag preflight must run before npm pack');
  assert.ok(preflight < release, 'tag preflight must run before gh release create');
  assert.doesNotMatch(workflow, /id-token:\s*write/);
});
