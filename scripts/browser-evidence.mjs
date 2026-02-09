#!/usr/bin/env node

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

function parseArgs(argv) {
  const args = {
    url: 'http://127.0.0.1:3000',
    name: 'premerge-home',
    outDir: 'docs/artifacts/browser-evidence',
    startDev: false,
  };

  const booleanFlags = new Set(['start-dev']);

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;

    const key = token.slice(2);
    if (booleanFlags.has(key)) {
      args.startDev = true;
      continue;
    }

    const value = argv[i + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`);
    }

    if (key === 'url') args.url = value;
    if (key === 'name') args.name = value;
    if (key === 'out-dir') args.outDir = value;
    i += 1;
  }

  return args;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'pipe',
    encoding: 'utf8',
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.status !== 0 && !options.allowFailure) {
    throw new Error(`${command} ${args.join(' ')} failed`);
  }

  return result;
}

function runNpmScript(name, args = [], options = {}) {
  return run('npm', ['run', '-s', name, ...args], options);
}

function runAgentBrowser(args, options = {}) {
  return run('npx', ['agent-browser', ...args], options);
}

function parseScreenshotPath(output) {
  const match = output.match(/saved to\s+(.+\.png)/i);
  return match?.[1]?.trim() ?? null;
}

async function findLatestScreenshotFallback() {
  const dir = path.join(os.homedir(), '.agent-browser', 'tmp', 'screenshots');
  const files = await fs.readdir(dir, { withFileTypes: true });
  const candidates = [];

  for (const file of files) {
    if (!file.isFile() || !file.name.endsWith('.png')) continue;
    const fullPath = path.join(dir, file.name);
    const stat = await fs.stat(fullPath);
    candidates.push({ fullPath, mtimeMs: stat.mtimeMs });
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return candidates[0].fullPath;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

async function waitForUrl(url, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // retry until timeout
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function main() {
  const { url, name, outDir, startDev } = parseArgs(process.argv.slice(2));
  const root = process.cwd();
  const outputDir = path.resolve(root, outDir);

  await fs.mkdir(outputDir, { recursive: true });

  let shouldStopDev = false;
  try {
    if (startDev) {
      runNpmScript('dev:stop', [], { allowFailure: true });
      const devProc = spawn('npm', ['run', '-s', 'dev', '--', '--hostname', '127.0.0.1'], {
        stdio: 'ignore',
        detached: true,
      });
      devProc.unref();
      shouldStopDev = true;
      await waitForUrl(url);
    }

    runAgentBrowser(['open', url]);
    runAgentBrowser(['snapshot', '-i']);

    const screenshotResult = runAgentBrowser(['screenshot', '--full']);
    let sourcePath = parseScreenshotPath(`${screenshotResult.stdout ?? ''}\n${screenshotResult.stderr ?? ''}`);

    if (!sourcePath) {
      sourcePath = await findLatestScreenshotFallback();
    }

    if (!sourcePath) {
      throw new Error('Could not resolve screenshot path from agent-browser output');
    }

    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${stamp}-${slugify(name) || 'evidence'}.png`;
    const targetPath = path.join(outputDir, fileName);

    await fs.copyFile(sourcePath, targetPath);
    console.log(`Evidence saved: ${targetPath}`);
  } finally {
    runAgentBrowser(['close'], { allowFailure: true });
    if (shouldStopDev) {
      runNpmScript('dev:stop', [], { allowFailure: true });
    }
  }
}

main().catch((error) => {
  console.error(String(error.message ?? error));
  process.exit(1);
});
