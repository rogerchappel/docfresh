export type OutputFormat = 'text' | 'json';

export type Severity = 'error' | 'warning' | 'info';

export type FindingKind =
  | 'missing-file'
  | 'missing-package-script'
  | 'stale-command'
  | 'broken-local-link'
  | 'missing-package-metadata'
  | 'smoke-failed';

export type Finding = {
  kind: FindingKind;
  severity: Severity;
  file: string;
  line: number;
  message: string;
  suggestion: string;
};

export type CommandBlock = {
  file: string;
  line: number;
  language: string;
  content: string;
  smoke: boolean;
};

export type MarkdownDocument = {
  path: string;
  content: string;
  lines: string[];
};

export type ScanOptions = {
  root: string;
  markdown?: string[];
  runSmoke: boolean;
};

export type ScanSummary = {
  markdownFiles: number;
  findings: number;
  smokeCommands: number;
};

export type ScanReport = {
  ok: boolean;
  root: string;
  summary: ScanSummary;
  findings: Finding[];
};
