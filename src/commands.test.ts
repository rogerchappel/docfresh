import assert from 'node:assert/strict';
import { test } from 'node:test';
import { extractDocumentedScriptCommands } from './commands.js';

test('extracts explicit run commands for every supported package manager', () => {
  const commands = extractDocumentedScriptCommands([
    'npm run build',
    'pnpm run check -- --watch',
    'yarn run lint --fix',
    'bun run test:unit -- --coverage'
  ].join('\n'));

  assert.deepEqual(commands.map(({ name }) => name), ['build', 'check', 'lint', 'test:unit']);
});

test('extracts supported shorthand commands and their arguments', () => {
  const commands = extractDocumentedScriptCommands([
    'pnpm check --watch',
    'yarn lint --fix',
    'bun test:unit -- --coverage'
  ].join('\n'));

  assert.deepEqual(commands.map(({ name }) => name), ['check', 'lint', 'test:unit']);
});

test('extracts every package script from chained shell commands', () => {
  const commands = extractDocumentedScriptCommands([
    'npm run build && npm run missing',
    'pnpm check || yarn run fallback; bun run finish',
    'npm run quoted -- "one && two"'
  ].join('\n'));

  assert.deepEqual(commands, [
    { name: 'build', raw: 'npm run build' },
    { name: 'missing', raw: 'npm run missing' },
    { name: 'check', raw: 'pnpm check' },
    { name: 'fallback', raw: 'yarn run fallback' },
    { name: 'finish', raw: 'bun run finish' },
    { name: 'quoted', raw: 'npm run quoted -- "one && two"' }
  ]);
});

test('ignores builtins, options, incomplete run commands, and comments', () => {
  const commands = extractDocumentedScriptCommands([
    'npm install',
    'npm test',
    'pnpm --version',
    'pnpm run',
    'yarn run --',
    'yarn add example',
    'bun test',
    '# pnpm missing-script'
  ].join('\n'));

  assert.deepEqual(commands, []);
});
