export type DocumentedCommand = {
  name: string;
  raw: string;
};

const packageManagerCommands = new Set(['npm', 'pnpm', 'yarn', 'bun']);

export function extractDocumentedScriptCommands(content: string): DocumentedCommand[] {
  const commands: DocumentedCommand[] = [];

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith('#')) {
      continue;
    }

    const tokens = line.split(/\s+/);
    const first = tokens[0] ?? '';
    const second = tokens[1] ?? '';
    const third = tokens[2] ?? '';

    if (!packageManagerCommands.has(first)) {
      continue;
    }

    if (second === 'run' && third && third !== '--' && !third.startsWith('-')) {
      commands.push({ name: third, raw: line });
      continue;
    }

    if ((first === 'pnpm' || first === 'yarn' || first === 'bun') && second && !second.startsWith('-') && !isPackageManagerBuiltin(second)) {
      commands.push({ name: second, raw: line });
    }
  }

  return commands;
}

function isPackageManagerBuiltin(value: string): boolean {
  return ['run', 'install', 'add', 'remove', 'exec', 'dlx', 'init', 'create', 'test'].includes(value);
}
