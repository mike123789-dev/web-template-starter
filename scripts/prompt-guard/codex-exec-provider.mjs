import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

export default class CodexExecProvider {
  constructor(options = {}) {
    this.providerId = options.id || 'local-codex-exec';
    this.defaultModel = process.env.CODEX_EVAL_MODEL || '';
    this.defaultTimeoutMs = Number(process.env.CODEX_EVAL_TIMEOUT_MS || 180000);
  }

  id() {
    return this.providerId;
  }

  async callApi(prompt, context) {
    const vars = context?.vars || {};
    const model = vars.model || this.defaultModel;
    const timeoutMs = Number(vars.timeoutMs || this.defaultTimeoutMs);
    const workdir = vars.workdir || process.cwd();

    const tempDir = mkdtempSync(join(tmpdir(), 'codex-eval-'));
    const outputFile = join(tempDir, 'last-message.txt');

    const args = ['exec', '--skip-git-repo-check', '--cd', workdir, '--output-last-message', outputFile];
    if (model) {
      args.push('--model', model);
    }

    args.push(String(prompt));

    const startedAt = Date.now();
    const result = spawnSync('codex', args, {
      encoding: 'utf8',
      timeout: timeoutMs,
      cwd: workdir,
      env: process.env,
      maxBuffer: 10 * 1024 * 1024,
    });
    const durationMs = Date.now() - startedAt;

    let output = '';
    let error = null;

    try {
      output = readFileSync(outputFile, 'utf8').trim();
    } catch {
      output = (result.stdout || '').trim();
    }

    if (result.status !== 0) {
      error = [
        `codex exec failed (exit=${result.status ?? 'null'})`,
        result.stderr?.trim() || '(no stderr)',
      ].join('\n');
    }

    rmSync(tempDir, { recursive: true, force: true });

    return {
      output,
      error,
      metadata: {
        exitCode: result.status,
        signal: result.signal,
        durationMs,
      },
    };
  }
}
