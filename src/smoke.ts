import { spawn } from 'node:child_process';
import type { CommandBlock, Finding } from './types.js';

export type SmokeResult = {
  commands: number;
  findings: Finding[];
};

export async function runSmokeBlocks(root: string, blocks: CommandBlock[]): Promise<SmokeResult> {
  const smokeBlocks = blocks.filter((block) => block.smoke && block.content.length > 0);
  const findings: Finding[] = [];

  for (const block of smokeBlocks) {
    const result = await runShell(block.content, root);
    if (result.code !== 0) {
      findings.push({
        kind: 'smoke-failed',
        severity: 'error',
        file: block.file,
        line: block.line,
        message: `Smoke command failed with exit code ${result.code}.`,
        suggestion: 'Update the documented command or the project behavior so the smoke example passes.'
      });
    }
  }

  return {
    commands: smokeBlocks.length,
    findings
  };
}

function runShell(command: string, cwd: string): Promise<{ code: number | null }> {
  return new Promise((resolve) => {
    const child = spawn(command, {
      cwd,
      shell: true,
      stdio: 'ignore',
      env: {
        ...process.env,
        DOCFRESH_SMOKE: '1'
      }
    });

    child.once('error', () => resolve({ code: 1 }));
    child.once('exit', (code) => resolve({ code }));
  });
}
