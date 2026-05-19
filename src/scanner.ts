import path from 'node:path';
import { extractDocumentedScriptCommands } from './commands.js';
import { findMarkdownFiles, pathExists, readMarkdownDocuments } from './files.js';
import { extractCommandBlocks, extractFileReferences, extractMarkdownLinks } from './markdown.js';
import { loadPackageInfo } from './package-info.js';
import { isExternalTarget, stripFragment } from './path-utils.js';
import { runSmokeBlocks } from './smoke.js';
import type { Finding, MarkdownDocument, ScanOptions, ScanReport } from './types.js';

export async function scanRepository(options: ScanOptions): Promise<ScanReport> {
  const root = path.resolve(options.root);
  const markdownFiles = await findMarkdownFiles(root, options.markdown ?? []);
  const documents = await readMarkdownDocuments(root, markdownFiles);
  const packageInfo = await loadPackageInfo(root);
  const commandBlocks = documents.flatMap(extractCommandBlocks);

  const findings: Finding[] = [
    ...checkPackageMetadata(documents, packageInfo.exists),
    ...await checkLocalLinks(root, documents),
    ...await checkFileReferences(root, documents),
    ...checkDocumentedScripts(documents, packageInfo.scripts)
  ];

  let smokeCommands = 0;
  if (options.runSmoke) {
    const smoke = await runSmokeBlocks(root, commandBlocks);
    smokeCommands = smoke.commands;
    findings.push(...smoke.findings);
  }

  findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.kind.localeCompare(b.kind));

  return {
    ok: findings.every((finding) => finding.severity !== 'error'),
    root,
    summary: {
      markdownFiles: documents.length,
      findings: findings.length,
      smokeCommands
    },
    findings
  };
}

function checkPackageMetadata(documents: MarkdownDocument[], packageExists: boolean): Finding[] {
  const readme = documents.find((document) => document.path === 'README.md');
  if (!readme || !packageExists) {
    return [];
  }

  const hasInstall = /\b(npm|pnpm|yarn|bun)\s+(install|add)\b/.test(readme.content);
  const hasUse = /\b(docfresh|npx|npm|pnpm|yarn|bun)\b/.test(readme.content);
  const findings: Finding[] = [];

  if (!hasInstall) {
    findings.push({
      kind: 'missing-package-metadata',
      severity: 'warning',
      file: readme.path,
      line: 1,
      message: 'README does not document an install command.',
      suggestion: 'Add a short install section that matches this package manager.'
    });
  }

  if (!hasUse) {
    findings.push({
      kind: 'missing-package-metadata',
      severity: 'warning',
      file: readme.path,
      line: 1,
      message: 'README does not document a CLI or package usage command.',
      suggestion: 'Add the smallest working usage example.'
    });
  }

  return findings;
}

async function checkLocalLinks(root: string, documents: MarkdownDocument[]): Promise<Finding[]> {
  const findings: Finding[] = [];

  for (const document of documents) {
    for (const link of extractMarkdownLinks(document)) {
      if (isExternalTarget(link.target)) {
        continue;
      }

      const target = stripFragment(decodeURIComponent(link.target));
      if (target.length === 0) {
        continue;
      }

      const absolute = path.resolve(root, path.dirname(document.path), target);
      if (!await pathExists(absolute)) {
        findings.push({
          kind: 'broken-local-link',
          severity: 'error',
          file: link.file,
          line: link.line,
          message: `Local link target "${link.target}" does not exist.`,
          suggestion: 'Fix the link target or add the referenced file.'
        });
      }
    }
  }

  return findings;
}

async function checkFileReferences(root: string, documents: MarkdownDocument[]): Promise<Finding[]> {
  const findings: Finding[] = [];

  for (const document of documents) {
    for (const reference of extractFileReferences(document)) {
      const absolute = path.resolve(root, path.dirname(document.path), reference.target);
      if (!await pathExists(absolute)) {
        findings.push({
          kind: 'missing-file',
          severity: 'error',
          file: reference.file,
          line: reference.line,
          message: `Referenced file "${reference.target}" does not exist.`,
          suggestion: 'Create the file or update the documentation reference.'
        });
      }
    }
  }

  return findings;
}

function checkDocumentedScripts(documents: MarkdownDocument[], scripts: Map<string, string>): Finding[] {
  const findings: Finding[] = [];

  for (const document of documents) {
    for (const block of extractCommandBlocks(document)) {
      for (const command of extractDocumentedScriptCommands(block.content)) {
        if (!scripts.has(command.name)) {
          findings.push({
            kind: 'missing-package-script',
            severity: 'error',
            file: block.file,
            line: block.line,
            message: `Documented command "${command.raw}" references missing package script "${command.name}".`,
            suggestion: 'Add the package script or update the documented command.'
          });
        }
      }
    }
  }

  return findings;
}
