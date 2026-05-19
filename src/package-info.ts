import { readFile } from 'node:fs/promises';
import path from 'node:path';

export type PackageInfo = {
  exists: boolean;
  name?: string;
  description?: string;
  scripts: Map<string, string>;
};

type RawPackageJson = {
  name?: unknown;
  description?: unknown;
  scripts?: unknown;
};

export async function loadPackageInfo(root: string): Promise<PackageInfo> {
  try {
    const raw = await readFile(path.join(root, 'package.json'), 'utf8');
    const parsed = JSON.parse(raw) as RawPackageJson;
    const info: PackageInfo = {
      exists: true,
      scripts: new Map(Object.entries(isRecord(parsed.scripts) ? parsed.scripts : {}).filter(isStringEntry))
    };
    if (typeof parsed.name === 'string') {
      info.name = parsed.name;
    }
    if (typeof parsed.description === 'string') {
      info.description = parsed.description;
    }
    return info;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('package.json is not valid JSON.');
    }

    return {
      exists: false,
      scripts: new Map()
    };
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringEntry(entry: [string, unknown]): entry is [string, string] {
  return typeof entry[1] === 'string';
}
