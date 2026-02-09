#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'pipe',
    encoding: 'utf8',
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.status !== 0 && !options.allowFailure) {
    process.exit(result.status ?? 1);
  }

  return result;
}

function runNpmScript(name, options = {}) {
  return run('npm', ['run', '-s', name], options);
}

function runE2EWithRetry() {
  runNpmScript('dev:stop');
  const first = runNpmScript('test:e2e', { allowFailure: true });
  if (first.status === 0) return;

  const combined = `${first.stdout ?? ''}\n${first.stderr ?? ''}`;
  const lockDetected = combined.includes('.next/dev/lock') || combined.includes('Unable to acquire lock');
  if (!lockDetected) {
    process.exit(first.status ?? 1);
  }

  console.error('\n[premerge:check] E2E lock detected. Retrying once after dev:stop...\n');
  runNpmScript('dev:stop');
  const second = runNpmScript('test:e2e', { allowFailure: true });
  if (second.status !== 0) {
    process.exit(second.status ?? 1);
  }
}

runNpmScript('specs:check');
runNpmScript('specs:validate');
runNpmScript('verify');
runE2EWithRetry();
runNpmScript('build');
