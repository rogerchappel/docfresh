#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
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

  if (missingPackedPaths.length > 0) {
    console.error('Missing files from npm package:');
    for (const path of missingPackedPaths) {
      console.error(`- ${path}`);
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

    console.log(
      `Verified ${requiredPaths.length} release files and installed ${pack.filename}; docfresh --help passed.`
    );
  }
} finally {
  rmSync(smokeRoot, { recursive: true, force: true });
}
