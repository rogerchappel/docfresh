import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { relativePath, shouldIgnoreDirectory } from './path-utils.js';
import type { MarkdownDocument } from './types.js';

export async function findMarkdownFiles(root: string, explicitFiles: string[] = []): Promise<string[]> {
  if (explicitFiles.length > 0) {
    return explicitFiles.map((file) => path.resolve(root, file));
  }

  const files: string[] = [];
  await walk(root, files);
  return files.sort();
}

async function walk(directory: string, files: string[]): Promise<void> {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!shouldIgnoreDirectory(entry.name)) {
        await walk(path.join(directory, entry.name), files);
      }
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      files.push(path.join(directory, entry.name));
    }
  }
}

export async function readMarkdownDocuments(root: string, files: string[]): Promise<MarkdownDocument[]> {
  const documents: MarkdownDocument[] = [];

  for (const file of files) {
    const content = await readFile(file, 'utf8');
    documents.push({
      path: relativePath(root, file),
      content,
      lines: content.split(/\r?\n/)
    });
  }

  return documents;
}

export async function pathExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}
