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

export function stripUrlSearchAndFragment(value: string): string {
  const searchIndex = value.indexOf('?');
  const hashIndex = value.indexOf('#');
  const componentIndexes = [searchIndex, hashIndex].filter((index) => index !== -1);
  return componentIndexes.length === 0 ? value : value.slice(0, Math.min(...componentIndexes));
}

export function isExternalTarget(value: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('mailto:') || value.startsWith('#');
}
