#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

function parseArgs(argv) {
  const args = {
    withBrowserEvidence: false,
    evidenceName: '',
    featureId: '',
    reportPath: 'docs/artifacts/premerge-report.md',
  };

  const booleanFlags = new Set(['with-browser-evidence']);

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;

    const key = token.slice(2);
    if (booleanFlags.has(key)) {
      args.withBrowserEvidence = true;
      continue;
    }

    const value = argv[i + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`);
    }

    if (key === 'feature-id') args.featureId = value;
    if (key === 'evidence-name') args.evidenceName = value;
    if (key === 'report-path') args.reportPath = value;
    i += 1;
  }

  return args;
}

function run(command, args, options = {}) {
  const startedAt = Date.now();
  const result = spawnSync(command, args, {
    stdio: 'pipe',
    encoding: 'utf8',
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  return {
    ...result,
    durationMs: Date.now() - startedAt,
    command: `${command} ${args.join(' ')}`,
    ok: result.status === 0,
    output: `${result.stdout ?? ''}\n${result.stderr ?? ''}`,
    allowFailure: Boolean(options.allowFailure),
  };
}

function runAsync(command, args) {
  const startedAt = Date.now();
  const child = spawn(command, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let stdout = '';
  let stderr = '';

  child.stdout.on('data', (chunk) => {
    stdout += chunk.toString();
  });
  child.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  return new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('close', (code) => {
      if (stdout) process.stdout.write(stdout);
      if (stderr) process.stderr.write(stderr);
      resolve({
        status: code,
        durationMs: Date.now() - startedAt,
        command: `${command} ${args.join(' ')}`,
        ok: code === 0,
        output: `${stdout}\n${stderr}`,
      });
    });
  });
}

function runNpmScript(name, scriptArgs = [], options = {}) {
  return run('npm', ['run', '-s', name, ...scriptArgs], options);
}

function runNpmScriptAsync(name, scriptArgs = []) {
  return runAsync('npm', ['run', '-s', name, ...scriptArgs]);
}

function parseEvidencePath(output) {
  const match = output.match(/Evidence saved:\s+(.+\.png)/);
  return match?.[1]?.trim() ?? '';
}

function toStep(name, result, note = '') {
  return {
    name,
    command: result.command,
    status: result.ok ? 'PASS' : 'FAIL',
    durationMs: result.durationMs,
    note,
  };
}

function formatDuration(ms) {
  return `${(ms / 1000).toFixed(1)}s`;
}

async function writeReport(reportPath, report) {
  const absoluteReportPath = path.resolve(reportPath);
  await fs.mkdir(path.dirname(absoluteReportPath), { recursive: true });

  const lines = [];
  lines.push('# Pre-merge Gate Report');
  lines.push('');
  lines.push(`- Generated At: \`${report.generatedAt}\``);
  lines.push(`- Status: \`${report.status}\``);
  lines.push(`- CWD: \`${report.cwd}\``);
  lines.push(`- Browser Evidence: \`${report.browserEvidence || 'none'}\``);
  lines.push('');
  lines.push('## Steps');
  lines.push('');
  lines.push('| Step | Status | Duration | Command | Note |');
  lines.push('| --- | --- | --- | --- | --- |');
  for (const step of report.steps) {
    lines.push(
      `| ${step.name} | ${step.status} | ${formatDuration(step.durationMs)} | \`${step.command}\` | ${step.note || '-'} |`,
    );
  }

  if (report.error) {
    lines.push('');
    lines.push('## Error');
    lines.push('');
    lines.push('```txt');
    lines.push(report.error);
    lines.push('```');
  }

  lines.push('');
  lines.push('## Review Template');
  lines.push('');
  lines.push('```md');
  lines.push('### Pre-merge Review');
  lines.push('');
  lines.push('- Risks:');
  lines.push('  - [High|Medium|Low] <risk summary> (file: <path>)');
  lines.push('- Missing Tests:');
  lines.push('  - <missing test or evidence gap> (recommended command: <command>)');
  lines.push('- Blockers:');
  lines.push('  - <merge blocker> (owner: <role>, action: <next step>)');
  lines.push('- Browser Evidence:');
  lines.push('  - <absolute screenshot path>');
  lines.push('- Gate Report:');
  lines.push(`  - ${absoluteReportPath}`);
  lines.push('```');

  await fs.writeFile(absoluteReportPath, `${lines.join('\n')}\n`, 'utf8');
  return absoluteReportPath;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = {
    generatedAt: new Date().toISOString(),
    cwd: process.cwd(),
    status: 'PASS',
    browserEvidence: '',
    error: '',
    steps: [],
  };

  try {
    const specsCheckPromise = runNpmScriptAsync('specs:check');
    const verifyPromise = runNpmScriptAsync('verify');

    const specsCheckResult = await specsCheckPromise;
    report.steps.push(toStep('specs:check', specsCheckResult, 'parallel with verify'));
    if (!specsCheckResult.ok) {
      const verifyResultAfterCheckFail = await verifyPromise;
      report.steps.push(toStep('verify', verifyResultAfterCheckFail, 'parallel with specs:check'));
      throw new Error('Failed: specs:check');
    }

    const specsValidatePromise = runNpmScriptAsync('specs:validate');
    const verifyResult = await verifyPromise;
    report.steps.push(toStep('verify', verifyResult, 'parallel with specs:check'));
    if (!verifyResult.ok) {
      const specsValidateAfterVerifyFail = await specsValidatePromise;
      report.steps.push(toStep('specs:validate', specsValidateAfterVerifyFail));
      throw new Error('Failed: verify');
    }

    const specsValidateResult = await specsValidatePromise;
    report.steps.push(toStep('specs:validate', specsValidateResult));
    if (!specsValidateResult.ok) {
      throw new Error('Failed: specs:validate');
    }

    const stopBeforeE2E = runNpmScript('dev:stop', [], { allowFailure: true });
    report.steps.push(toStep('dev:stop (before e2e)', stopBeforeE2E));

    const firstE2E = runNpmScript('test:e2e', [], { allowFailure: true });
    if (firstE2E.ok) {
      report.steps.push(toStep('test:e2e', firstE2E));
    } else {
      const combined = `${firstE2E.output}`;
      const lockDetected = combined.includes('.next/dev/lock') || combined.includes('Unable to acquire lock');
      report.steps.push(toStep('test:e2e (attempt 1)', firstE2E, lockDetected ? 'lock detected' : 'non-lock failure'));

      if (!lockDetected) {
        throw new Error('Failed: test:e2e (non-lock failure)');
      }

      console.error('\n[premerge:check] E2E lock detected. Retrying once after dev:stop...\n');
      const stopBeforeRetry = runNpmScript('dev:stop', [], { allowFailure: true });
      report.steps.push(toStep('dev:stop (before e2e retry)', stopBeforeRetry));

      const secondE2E = runNpmScript('test:e2e', [], { allowFailure: true });
      report.steps.push(toStep('test:e2e (attempt 2)', secondE2E, 'retry after lock'));
      if (!secondE2E.ok) {
        throw new Error('Failed: test:e2e retry');
      }
    }

    const buildResult = runNpmScript('build');
    report.steps.push(toStep('build', buildResult));
    if (!buildResult.ok) {
      throw new Error('Failed: build');
    }

    if (args.withBrowserEvidence) {
      const evidenceBaseName =
        args.evidenceName || (args.featureId ? `premerge-${args.featureId.toLowerCase()}` : 'premerge-check');
      const browserArgs = ['--', '--name', evidenceBaseName, '--start-dev'];
      const evidenceResult = runNpmScript('browser:evidence', browserArgs, { allowFailure: true });
      const evidencePath = parseEvidencePath(evidenceResult.output);
      report.steps.push(
        toStep(
          'browser:evidence',
          evidenceResult,
          evidencePath ? `saved: ${evidencePath}` : 'path not parsed from output',
        ),
      );

      if (!evidenceResult.ok) {
        throw new Error('Failed: browser:evidence');
      }

      report.browserEvidence = evidencePath;
    }
  } catch (error) {
    report.status = 'FAIL';
    report.error = String(error?.message ?? error);
  }

  const writtenReport = await writeReport(args.reportPath, report);
  console.log(`Pre-merge report saved: ${writtenReport}`);

  if (report.status !== 'PASS') {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(String(error?.message ?? error));
  process.exit(1);
});
