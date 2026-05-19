import type { ScanReport } from './types.js';

export function formatJson(report: ScanReport): string {
  return `${JSON.stringify(report, null, 2)}\n`;
}

export function formatText(report: ScanReport): string {
  const lines: string[] = [];
  lines.push(report.ok ? 'DocFresh passed.' : 'DocFresh found documentation drift.');
  lines.push(`Root: ${report.root}`);
  lines.push(`Markdown files: ${report.summary.markdownFiles}`);
  lines.push(`Findings: ${report.summary.findings}`);

  if (report.summary.smokeCommands > 0) {
    lines.push(`Smoke commands: ${report.summary.smokeCommands}`);
  }

  if (report.findings.length > 0) {
    lines.push('');
    for (const finding of report.findings) {
      lines.push(`[${finding.severity}] ${finding.kind} ${finding.file}:${finding.line}`);
      lines.push(`  ${finding.message}`);
      lines.push(`  fix: ${finding.suggestion}`);
    }
  }

  return `${lines.join('\n')}\n`;
}
