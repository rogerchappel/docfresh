#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

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

const output = execFileSync('npm', ['pack', '--dry-run', '--json'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'inherit']
});

const [pack] = JSON.parse(output);
const packedFiles = new Set(pack.files.map((file) => file.path));
const missingPackedPaths = requiredPaths.filter((path) => !packedFiles.has(path));

if (missingPackedPaths.length > 0) {
  console.error('Missing files from npm pack dry-run:');
  for (const path of missingPackedPaths) {
    console.error(`- ${path}`);
  }
  process.exit(1);
}

console.log(`Verified ${requiredPaths.length} required release files in ${pack.filename}.`);
