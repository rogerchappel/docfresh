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

    for (const segment of splitShellCommand(line)) {
      const tokens = segment.split(/\s+/);
      const first = tokens[0] ?? '';
      const second = tokens[1] ?? '';
      const third = tokens[2] ?? '';

      if (!packageManagerCommands.has(first)) {
        continue;
      }

      if (second === 'run' && third && third !== '--' && !third.startsWith('-')) {
        commands.push({ name: third, raw: segment });
        continue;
      }

      if ((first === 'pnpm' || first === 'yarn' || first === 'bun') && second && !second.startsWith('-') && !isPackageManagerBuiltin(second)) {
        commands.push({ name: second, raw: segment });
      }
    }
  }

  return commands;
}

function splitShellCommand(line: string): string[] {
  const segments: string[] = [];
  let start = 0;
  let quote = '';

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index] ?? '';
    if (character === '\\' && quote !== "'") {
      index += 1;
      continue;
    }
    if (character === "'" || character === '"') {
      quote = quote === character ? '' : quote === '' ? character : quote;
      continue;
    }
    if (quote === '' && (line.startsWith('&&', index) || line.startsWith('||', index) || character === ';')) {
      const segment = line.slice(start, index).trim();
      if (segment) segments.push(segment);
      index += character === ';' ? 0 : 1;
      start = index + 1;
    }
  }

  const finalSegment = line.slice(start).trim();
  if (finalSegment) segments.push(finalSegment);
  return segments;
}

function isPackageManagerBuiltin(value: string): boolean {
  return ['run', 'install', 'add', 'remove', 'exec', 'dlx', 'init', 'create', 'test'].includes(value);
}
