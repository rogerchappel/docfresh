import assert from 'node:assert/strict';
import { test } from 'node:test';
import { extractCommandBlocks } from './markdown.js';

test('extracts indented backtick and tilde fences with language and smoke metadata', () => {
  const blocks = extractCommandBlocks({
    path: 'README.md',
    content: '',
    lines: [
      '   ~~~~sh docfresh: smoke',
      'npm run check',
      '  ~~~~~',
      ' ```bash',
      'pnpm lint',
      ' ```'
    ]
  });

  assert.deepEqual(blocks, [
    {
      file: 'README.md',
      line: 1,
      language: 'sh',
      content: 'npm run check',
      smoke: true
    },
    {
      file: 'README.md',
      line: 4,
      language: 'bash',
      content: 'pnpm lint',
      smoke: false
    }
  ]);
});

test('mismatched and shorter fences remain content until a valid closing fence', () => {
  const blocks = extractCommandBlocks({
    path: 'README.md',
    content: '',
    lines: [
      '~~~~sh',
      'npm run first',
      '```',
      'npm run second',
      '~~~',
      'npm run third',
      '~~~~~'
    ]
  });

  assert.equal(blocks.length, 1);
  assert.equal(blocks[0]?.content, [
    'npm run first',
    '```',
    'npm run second',
    '~~~',
    'npm run third'
  ].join('\n'));
});
