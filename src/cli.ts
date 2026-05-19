#!/usr/bin/env node
import { scanRepository } from './scanner.js';
import { formatJson, formatText } from './reporters.js';
import type { OutputFormat } from './types.js';

type CliOptions = {
  root: string;
  format: OutputFormat;
  markdown: string[];
  smoke: boolean;
};

const help = `DocFresh checks whether README/docs examples still match a local repo.

Usage:
  docfresh check [--root <path>] [--format text|json] [--markdown <file>] [--smoke]
  docfresh --version
  docfresh --help

Options:
  --root <path>       Repository root to scan. Defaults to the current directory.
  --format <format>   Output format: text or json. Defaults to text.
  --markdown <file>   Scan one markdown file relative to the root. Repeatable.
  --smoke             Run fenced commands marked with docfresh: smoke.
`;

async function main(argv: string[]): Promise<number> {
  if (argv.includes('--version') || argv.includes('-v')) {
    process.stdout.write('0.1.0\n');
    return 0;
  }

  if (argv.includes('--help') || argv.includes('-h')) {
    process.stdout.write(help);
    return 0;
  }

  const command = argv[0] ?? 'check';
  if (command !== 'check') {
    process.stderr.write(`Unknown command "${command}". Run docfresh --help.\n`);
    return 2;
  }

  const options = parseOptions(argv.slice(1));
  const report = await scanRepository({
    root: options.root,
    markdown: options.markdown,
    runSmoke: options.smoke
  });

  process.stdout.write(options.format === 'json' ? formatJson(report) : formatText(report));
  return report.ok ? 0 : 1;
}

function parseOptions(argv: string[]): CliOptions {
  const options: CliOptions = {
    root: process.cwd(),
    format: 'text',
    markdown: [],
    smoke: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--root') {
      options.root = readValue(argv, index, arg);
      index += 1;
      continue;
    }

    if (arg === '--format') {
      const format = readValue(argv, index, arg);
      if (format !== 'text' && format !== 'json') {
        throw new Error('--format must be "text" or "json".');
      }
      options.format = format;
      index += 1;
      continue;
    }

    if (arg === '--markdown') {
      options.markdown.push(readValue(argv, index, arg));
      index += 1;
      continue;
    }

    if (arg === '--smoke') {
      options.smoke = true;
      continue;
    }

    throw new Error(`Unknown option "${arg}". Run docfresh --help.`);
  }

  return options;
}

function readValue(argv: string[], index: number, flag: string): string {
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${flag} requires a value.`);
  }
  return value;
}

main(process.argv.slice(2)).then((code) => {
  process.exitCode = code;
}).catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 2;
});
