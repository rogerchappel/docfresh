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

type Fence = { marker: '`' | '~'; length: number };

function parseOpeningFence(line: string): { fence: Fence; info: string } | undefined {
  const match = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
  if (!match) return undefined;
  const run = match[1] ?? '';
  const info = (match[2] ?? '').trim();
  if (run[0] === '`' && info.includes('`')) return undefined;
  return { fence: { marker: run[0] as '`' | '~', length: run.length }, info };
}

function isClosingFence(line: string, fence: Fence): boolean {
  const match = line.match(/^ {0,3}([`~]{3,})[ \t]*$/);
  const run = match?.[1] ?? '';
  return run[0] === fence.marker && run.length >= fence.length;
}

function markdownContentLines(document: MarkdownDocument): Array<{ line: string; index: number }> {
  const content: Array<{ line: string; index: number }> = [];
  let active: Fence | undefined;
  document.lines.forEach((line, index) => {
    if (active) {
      if (isClosingFence(line, active)) active = undefined;
      return;
    }
    const opening = parseOpeningFence(line);
    if (opening) {
      active = opening.fence;
      return;
    }
    content.push({ line, index });
  });
  return content;
}

export function extractCommandBlocks(document: MarkdownDocument): CommandBlock[] {
  const blocks: CommandBlock[] = [];
  let active: {
    line: number;
    language: string;
    content: string[];
    smoke: boolean;
    marker: '`' | '~';
    length: number;
  } | undefined;

  document.lines.forEach((line, index) => {
    if (active) {
      const closesActive = isClosingFence(line, { marker: active.marker, length: active.length });

      if (!closesActive) {
        active.content.push(line);
        return;
      }

      blocks.push({
        file: document.path,
        line: active.line,
        language: active.language,
        content: active.content.join('\n').trim(),
        smoke: active.smoke
      });
      active = undefined;
      return;
    }

    const openingFence = parseOpeningFence(line);
    if (!openingFence) {
      return;
    }

    const info = openingFence.info;

    const infoParts = info.match(/^([\w-]+)?\s*(.*)$/);
    active = {
      line: index + 1,
      language: infoParts?.[1] ?? '',
      content: [],
      smoke: /docfresh:\s*smoke/i.test(infoParts?.[2] ?? ''),
      marker: openingFence.fence.marker,
      length: openingFence.fence.length
    };
  });

  return blocks;
}

export function extractMarkdownLinks(document: MarkdownDocument): MarkdownLink[] {
  const links: MarkdownLink[] = [];
  const labelPattern = /\[([^\]]+)\]\(/g;
  const contentLines = markdownContentLines(document);
  const definitions = extractLinkDefinitions(contentLines.map(({ line }) => line));

  contentLines.forEach(({ line, index }) => {
    for (const match of line.matchAll(labelPattern)) {
      const start = (match.index ?? 0) + match[0].length;
      const target = parseInlineLinkDestination(line, start);
      if (target === undefined) {
        continue;
      }

      links.push({
        file: document.path,
        line: index + 1,
        label: match[1] ?? '',
        target
      });
    }

    const referencePattern = /\[([^\]]+)\]\[([^\]]*)\]/g;
    for (const match of line.matchAll(referencePattern)) {
      const label = match[1] ?? '';
      const identifier = normalizeReferenceLabel(match[2] || label);
      const target = definitions.get(identifier);
      if (target === undefined) {
        continue;
      }

      links.push({
        file: document.path,
        line: index + 1,
        label,
        target
      });
    }
  });

  return links;
}

function parseInlineLinkDestination(line: string, start: number): string | undefined {
  if (line[start] === '<') {
    for (let index = start + 1; index < line.length; index += 1) {
      if (line[index] === '\\') {
        index += 1;
        continue;
      }
      if (line[index] === '>') {
        return line.slice(start + 1, index);
      }
    }
    return undefined;
  }

  let depth = 0;

  for (let index = start; index < line.length; index += 1) {
    const character = line[index];
    if (character === '\\') {
      index += 1;
      continue;
    }
    if (/\s/.test(character ?? '')) {
      return depth === 0 ? line.slice(start, index) : undefined;
    }
    if (character === '(') {
      depth += 1;
      continue;
    }
    if (character === ')') {
      if (depth === 0) {
        return line.slice(start, index);
      }
      depth -= 1;
    }
  }

  return undefined;
}

function extractLinkDefinitions(lines: string[]): Map<string, string> {
  const definitions = new Map<string, string>();
  const definitionPattern = /^ {0,3}\[([^\]]+)\]:\s*/;

  for (const line of lines) {
    const match = line.match(definitionPattern);
    if (!match) {
      continue;
    }
    const start = match[0].length;
    const target = parseReferenceDestination(line, start);
    if (target !== undefined) {
      const identifier = normalizeReferenceLabel(match[1] ?? '');
      if (!definitions.has(identifier)) {
        definitions.set(identifier, target);
      }
    }
  }

  return definitions;
}

function parseReferenceDestination(line: string, start: number): string | undefined {
  if (line[start] === '<') {
    const end = line.indexOf('>', start + 1);
    return end === -1 ? undefined : line.slice(start + 1, end);
  }

  const match = line.slice(start).match(/^(?:\\.|[^\s])+/);
  return match?.[0];
}

function normalizeReferenceLabel(label: string): string {
  return label.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function extractFileReferences(document: MarkdownDocument): FileReference[] {
  const references: FileReference[] = [];
  const pattern = /`((?:\.\/|\.\.\/|[A-Za-z0-9_.-]+\/)[A-Za-z0-9_./-]+)`/g;

  markdownContentLines(document).forEach(({ line, index }) => {
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
