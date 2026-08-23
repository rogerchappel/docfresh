#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const requiredPaths = [
  'dist/cli.js',
  'dist/index.js',
  'dist/index.d.ts',
  'demo/readme-smoke-check.sh',
  'docs/tutorials/readme-smoke-gate.md',
  'examples/check-valid-docs-demo.sh',
  'fixtures/valid-docs/README.md',
  'fixtures/stale-docs/README.md',
  'README.md',
  'LICENSE',
  'SECURITY.md',
  'SUPPORT.md',
  'CHANGELOG.md',
  'RELEASE_NOTES.md',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md'
];

const compiledTestPattern = /^dist\/.*\.test\.(?:js|js\.map|d\.ts)$/;

function listFiles(directory, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = join(prefix, entry.name).replaceAll('\\', '/');
    return entry.isDirectory()
      ? listFiles(join(directory, entry.name), relativePath)
      : [relativePath];
  });
}

const missingLocalPaths = requiredPaths.filter((path) => !existsSync(path));
if (missingLocalPaths.length > 0) {
  console.error('Missing release files before pack:');
  for (const path of missingLocalPaths) {
    console.error(`- ${path}`);
  }
  process.exit(1);
}

const smokeRoot = mkdtempSync(join(tmpdir(), 'docfresh-package-smoke-'));

try {
  const packOutput = execFileSync(
    'npm',
    ['pack', '--json', '--pack-destination', smokeRoot],
    {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'inherit']
    }
  );

  const [pack] = JSON.parse(packOutput);
  const packedFiles = new Set(pack.files.map((file) => file.path));
  const missingPackedPaths = requiredPaths.filter((path) => !packedFiles.has(path));
  const expectedRuntimePaths = listFiles('dist')
    .map((path) => `dist/${path}`)
    .filter((path) => !compiledTestPattern.test(path));
  const missingRuntimePaths = expectedRuntimePaths.filter((path) => !packedFiles.has(path));
  const packedTestArtifacts = [...packedFiles].filter((path) => compiledTestPattern.test(path));

  if (missingPackedPaths.length > 0 || missingRuntimePaths.length > 0 || packedTestArtifacts.length > 0) {
    console.error('Invalid npm package manifest:');
    for (const path of missingPackedPaths) {
      console.error(`- missing required file: ${path}`);
    }
    for (const path of missingRuntimePaths) {
      console.error(`- missing runtime file: ${path}`);
    }
    for (const path of packedTestArtifacts) {
      console.error(`- contains compiled test artifact: ${path}`);
    }
    process.exitCode = 1;
  } else {
    const installRoot = join(smokeRoot, 'install');
    execFileSync(
      'npm',
      [
        'install',
        '--ignore-scripts',
        '--no-audit',
        '--no-fund',
        '--prefix',
        installRoot,
        join(smokeRoot, pack.filename)
      ],
      { stdio: 'inherit' }
    );

    const executable = join(
      installRoot,
      'node_modules',
      '.bin',
      process.platform === 'win32' ? 'docfresh.cmd' : 'docfresh'
    );
    const helpOutput = execFileSync(executable, ['--help'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'inherit']
    });

    if (!helpOutput.includes('Usage:') || !helpOutput.includes('docfresh check')) {
      throw new Error('Installed docfresh --help output did not contain the expected usage.');
    }

    const packageRoot = join(installRoot, 'node_modules', '@rogerchappel', 'docfresh');
    const checkOutput = execFileSync(
      executable,
      ['check', '--root', join(packageRoot, 'fixtures', 'valid-docs'), '--format', 'json'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }
    );
    const report = JSON.parse(checkOutput);
    if (report.ok !== true || report.summary?.findings !== 0) {
      throw new Error('Installed docfresh check did not pass against the packaged valid fixture.');
    }

    execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '--eval',
        "const module = await import('@rogerchappel/docfresh'); if (typeof module.scanRepository !== 'function') process.exit(1);"
      ],
      { cwd: installRoot, stdio: 'inherit' }
    );

    console.log(
      `Verified ${pack.files.length} packed files, installed ${pack.filename}, and exercised CLI/import surfaces.`
    );
  }
} finally {
  rmSync(smokeRoot, { recursive: true, force: true });
}
