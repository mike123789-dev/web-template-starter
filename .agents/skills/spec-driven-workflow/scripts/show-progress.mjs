#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function resolveRepoRoot() {
  const currentFile = fileURLToPath(import.meta.url);
  return path.resolve(path.dirname(currentFile), '../../../../');
}

async function main() {
  const repoRoot = resolveRepoRoot();
  const progressPath = path.join(repoRoot, 'docs/specs/progress.md');

  try {
    const content = await fs.readFile(progressPath, 'utf8');
    process.stdout.write(content);
    if (!content.endsWith('\n')) process.stdout.write('\n');
  } catch {
    console.error('Missing docs/specs/progress.md');
    console.error('Run: npm run specs:progress');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(String(error.message ?? error));
  process.exit(1);
});
