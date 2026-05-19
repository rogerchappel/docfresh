import path from 'node:path';

const ignoredDirectories = new Set([
  '.git',
  'dist',
  'node_modules',
  'coverage',
  '.turbo',
  '.next',
  '.cache'
]);

export function shouldIgnoreDirectory(name: string): boolean {
  return ignoredDirectories.has(name);
}

export function toPosixPath(value: string): string {
  return value.split(path.sep).join('/');
}

export function relativePath(root: string, filePath: string): string {
  return toPosixPath(path.relative(root, filePath)) || '.';
}

export function stripFragment(value: string): string {
  const hashIndex = value.indexOf('#');
  return hashIndex === -1 ? value : value.slice(0, hashIndex);
}

export function isExternalTarget(value: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('mailto:') || value.startsWith('#');
}
