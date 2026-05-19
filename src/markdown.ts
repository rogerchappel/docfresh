import type { CommandBlock, MarkdownDocument } from './types.js';

export type MarkdownLink = {
  file: string;
  line: number;
  label: string;
  target: string;
};

export type FileReference = {
  file: string;
  line: number;
  target: string;
};

export function extractCommandBlocks(document: MarkdownDocument): CommandBlock[] {
  const blocks: CommandBlock[] = [];
  let active: { line: number; language: string; content: string[]; smoke: boolean } | undefined;

  document.lines.forEach((line, index) => {
    const fence = line.match(/^```\s*([\w-]+)?\s*(.*)$/);
    if (!fence) {
      active?.content.push(line);
      return;
    }

    if (!active) {
      active = {
        line: index + 1,
        language: fence[1] ?? '',
        content: [],
        smoke: /docfresh:\s*smoke/i.test(fence[2] ?? '')
      };
      return;
    }

    blocks.push({
      file: document.path,
      line: active.line,
      language: active.language,
      content: active.content.join('\\n').trim(),
      smoke: active.smoke
    });
    active = undefined;
  });

  return blocks;
}

export function extractMarkdownLinks(document: MarkdownDocument): MarkdownLink[] {
  const links: MarkdownLink[] = [];
  const pattern = /(?<!!)\[([^\]]+)\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)/g;

  document.lines.forEach((line, index) => {
    for (const match of line.matchAll(pattern)) {
      links.push({
        file: document.path,
        line: index + 1,
        label: match[1] ?? '',
        target: match[2] ?? ''
      });
    }
  });

  return links;
}

export function extractFileReferences(document: MarkdownDocument): FileReference[] {
  const references: FileReference[] = [];
  const pattern = /`((?:\.\/|\.\.\/|[A-Za-z0-9_.-]+\/)[A-Za-z0-9_./-]+)`/g;

  document.lines.forEach((line, index) => {
    for (const match of line.matchAll(pattern)) {
      const target = match[1] ?? '';
      if (!target.endsWith('/')) {
        references.push({
          file: document.path,
          line: index + 1,
          target
        });
      }
    }
  });

  return references;
}
