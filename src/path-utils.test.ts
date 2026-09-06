import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isExternalTarget } from './path-utils.js';

test('distinguishes protocol-relative URLs from repository-root paths', () => {
  assert.equal(isExternalTarget('//cdn.example.com/library.js'), true);
  assert.equal(isExternalTarget('/docs/guide.md'), false);
});
