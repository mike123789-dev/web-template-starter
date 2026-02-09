#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import {
  findFeatureDir,
  parseArgs,
  parseTaskRow,
  resolveRepoRoot,
  runNpm,
  setFrontmatterField,
  today,
} from './common.mjs';

function usage() {
  return [
    'Usage:',
    '  npm run specs:task:done -- --feature-id F-003 --task-id T-002 [--dry-run]',
    '',
    'Options:',
    '- --skip-check: do not run npm run specs:check',
    '- --skip-validate: do not run npm run specs:validate',
  ].join('\n');
}

function formatTaskRow(cells) {
  return `| ${cells.join(' | ')} |`;
}

function parseTaskStatusRows(content) {
  const statuses = [];
  for (const line of content.split('\n')) {
    const cells = parseTaskRow(line);
    if (!cells) continue;
    statuses.push({ taskId: cells[0], status: cells[6] });
  }
  return statuses;
}

async function main() {
  const args = parseArgs(process.argv.slice(2), {
    booleanFlags: ['dry-run', 'skip-check', 'skip-validate'],
  });
  const featureId = args['feature-id'];
  const taskId = args['task-id'];
  const dryRun = Boolean(args['dry-run']);
  const skipCheck = Boolean(args['skip-check']);
  const skipValidate = Boolean(args['skip-validate']);

  if (!featureId || !taskId) {
    throw new Error(`Missing required args.\n\n${usage()}`);
  }
  if (!/^F-\d{3}$/.test(featureId)) {
    throw new Error(`Invalid feature id: ${featureId}`);
  }
  if (!/^T-\d{3}$/.test(taskId)) {
    throw new Error(`Invalid task id: ${taskId}`);
  }

  const repoRoot = resolveRepoRoot();
  const featuresRoot = path.join(repoRoot, 'docs/specs/features');
  const featureDir = await findFeatureDir(featuresRoot, featureId);
  const tasksPath = path.join(featureDir, 'tasks.md');
  const tasksDetailPath = path.join(featureDir, 'tasks', `${taskId}.md`);
  const date = today();

  let tasksContent = await fs.readFile(tasksPath, 'utf8');
  const lines = tasksContent.split('\n');
  let found = false;
  let detailRef = '-';

  for (let i = 0; i < lines.length; i += 1) {
    const cells = parseTaskRow(lines[i]);
    if (!cells) continue;
    if (cells[0] !== taskId) continue;
    found = true;
    detailRef = cells[5].replaceAll('`', '');
    cells[6] = 'Done';
    lines[i] = formatTaskRow(cells);
    break;
  }

  if (!found) {
    throw new Error(`${featureId} does not contain ${taskId} in tasks.md`);
  }

  tasksContent = setFrontmatterField(lines.join('\n'), 'last_updated', date);

  if (dryRun) {
    console.log(`[DRY RUN] ${featureId}/${taskId} -> Done`);
    console.log(`- featureDir: ${path.relative(repoRoot, featureDir)}`);
    console.log(`- detail: ${detailRef}`);
    return;
  }

  await fs.writeFile(tasksPath, tasksContent);

  if (detailRef !== '-' && detailRef !== '') {
    const detailPath = path.join(featureDir, detailRef);
    const detailContent = await fs.readFile(detailPath, 'utf8');
    const updatedDetail = setFrontmatterField(
      setFrontmatterField(detailContent, 'status', 'Done'),
      'last_updated',
      date
    );
    await fs.writeFile(detailPath, updatedDetail);
  } else {
    try {
      const detailContent = await fs.readFile(tasksDetailPath, 'utf8');
      const updatedDetail = setFrontmatterField(
        setFrontmatterField(detailContent, 'status', 'Done'),
        'last_updated',
        date
      );
      await fs.writeFile(tasksDetailPath, updatedDetail);
    } catch {
      // no matching task detail file; tasks.md is source of truth for this case
    }
  }

  const statuses = parseTaskStatusRows(tasksContent);
  const allDone = statuses.length > 0 && statuses.every((row) => row.status === 'Done');
  console.log(`Updated ${path.relative(repoRoot, tasksPath)}: ${taskId} -> Done`);
  if (allDone) {
    console.log(`All tasks are Done for ${featureId}. Consider: npm run specs:feature:status -- --feature-id ${featureId} --status Verifying`);
  }

  if (!skipCheck) runNpm(repoRoot, ['run', 'specs:check']);
  if (!skipValidate) runNpm(repoRoot, ['run', 'specs:validate']);
}

main().catch((error) => {
  console.error(String(error.message ?? error));
  process.exit(1);
});
