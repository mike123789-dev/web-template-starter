#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import {
  findFeatureDir,
  hasNeedsClarification,
  parseArgs,
  parseTaskRow,
  resolveRepoRoot,
  runNpm,
  setFrontmatterField,
  today,
} from './common.mjs';

const FEATURE_STATUS = new Set(['Draft', 'Ready', 'In Progress', 'Verifying', 'Done']);

function usage() {
  return [
    'Usage:',
    '  npm run specs:feature:status -- --feature-id F-003 --status Verifying [--dry-run]',
    '',
    'Allowed status:',
    '- Draft | Ready | In Progress | Verifying | Done',
  ].join('\n');
}

function parseTaskRows(tasksContent) {
  const rows = [];
  for (const line of tasksContent.split('\n')) {
    const cols = parseTaskRow(line);
    if (!cols) continue;
    rows.push({ taskId: cols[0], status: cols[6] });
  }
  return rows;
}

async function main() {
  const args = parseArgs(process.argv.slice(2), {
    booleanFlags: ['dry-run', 'skip-check', 'skip-validate'],
  });
  const featureId = args['feature-id'];
  const status = args.status;
  const dryRun = Boolean(args['dry-run']);
  const skipCheck = Boolean(args['skip-check']);
  const skipValidate = Boolean(args['skip-validate']);

  if (!featureId || !status) {
    throw new Error(`Missing required args.\n\n${usage()}`);
  }
  if (!/^F-\d{3}$/.test(featureId)) {
    throw new Error(`Invalid feature id: ${featureId}`);
  }
  if (!FEATURE_STATUS.has(status)) {
    throw new Error(`Invalid status: ${status}`);
  }

  const repoRoot = resolveRepoRoot();
  const featureDir = await findFeatureDir(path.join(repoRoot, 'docs/specs/features'), featureId);
  const files = ['spec.md', 'plan.md', 'tasks.md', 'test-matrix.md'];
  const filePaths = files.map((file) => path.join(featureDir, file));
  const date = today();

  const specContent = await fs.readFile(path.join(featureDir, 'spec.md'), 'utf8');
  const tasksContent = await fs.readFile(path.join(featureDir, 'tasks.md'), 'utf8');
  const taskRows = parseTaskRows(tasksContent);

  if ((status === 'Verifying' || status === 'Done') && taskRows.some((row) => row.status !== 'Done')) {
    throw new Error(`Cannot set ${featureId} to ${status}: not all tasks are Done.`);
  }
  if (status !== 'Draft' && hasNeedsClarification(specContent)) {
    throw new Error(`Cannot set ${featureId} to ${status}: [NEEDS CLARIFICATION] exists in Open Questions.`);
  }

  if (dryRun) {
    console.log(`[DRY RUN] ${featureId} status -> ${status}`);
    console.log(`- featureDir: ${path.relative(repoRoot, featureDir)}`);
    return;
  }

  for (const filePath of filePaths) {
    const content = await fs.readFile(filePath, 'utf8');
    const updated = setFrontmatterField(setFrontmatterField(content, 'status', status), 'last_updated', date);
    await fs.writeFile(filePath, updated);
  }

  const readmePath = path.join(featureDir, 'README.md');
  try {
    const readme = await fs.readFile(readmePath, 'utf8');
    const readmeUpdated = readme
      .replace(/^- Status:\s*`[^`]*`/m, `- Status: \`${status}\``)
      .replace(/^- Last Updated:\s*`[^`]*`/m, `- Last Updated: \`${date}\``);
    await fs.writeFile(readmePath, readmeUpdated);
  } catch {
    // README is optional for status command
  }

  console.log(`Updated ${featureId} status to ${status}`);

  if (!skipCheck) runNpm(repoRoot, ['run', 'specs:check']);
  if (!skipValidate) runNpm(repoRoot, ['run', 'specs:validate']);
}

main().catch((error) => {
  console.error(String(error.message ?? error));
  process.exit(1);
});
