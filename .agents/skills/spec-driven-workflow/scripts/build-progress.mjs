#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { hasNeedsClarification, nowIso, parseFrontmatter, parseTaskRow, resolveRepoRoot } from './common.mjs';

function renderStatusBadge(rawStatus) {
  const status = String(rawStatus ?? '-').trim() || '-';
  const statusIconMap = {
    Draft: '⬜',
    Ready: '🟦',
    'In Progress': '🟨',
    Blocked: '🟥',
    Done: '🟩',
  };
  const statusClassMap = {
    Draft: 'draft',
    Ready: 'ready',
    'In Progress': 'in-progress',
    Blocked: 'blocked',
    Done: 'done',
  };
  const icon = statusIconMap[status] ?? '▫';
  const cls = statusClassMap[status] ?? 'unknown';
  return `<span class="sdd-status sdd-status--${cls}">${icon} ${status}</span>`;
}

function renderFlagBadge(rawFlag) {
  const flag = String(rawFlag ?? '-').trim() || '-';
  const icon = flag === 'Yes' ? '❗' : flag === 'No' ? '✅' : '▫';
  const cls = flag === 'Yes' ? 'yes' : flag === 'No' ? 'no' : 'unknown';
  return `<span class="sdd-flag sdd-flag--${cls}">${icon} ${flag}</span>`;
}

function parseTaskRows(tasksContent) {
  const rows = [];
  for (const line of tasksContent.split('\n')) {
    const cols = parseTaskRow(line);
    if (!cols) continue;

    const [taskId, task, , , , detail, status] = cols;
    rows.push({
      taskId,
      task,
      detail: detail.replaceAll('`', ''),
      status,
    });
  }
  return rows;
}

function safeStatusCount(rows, status) {
  return rows.filter((row) => row.status === status).length;
}

function featureLink(featureDirName, filename) {
  return `[${featureDirName}/${filename}](features/${featureDirName}/${filename})`;
}

async function main() {
  const repoRoot = resolveRepoRoot();
  const specsRoot = path.join(repoRoot, 'docs/specs');
  const featuresRoot = path.join(specsRoot, 'features');
  const outFile = path.join(specsRoot, 'progress.md');

  const entries = await fs.readdir(featuresRoot, { withFileTypes: true });
  const featureDirs = entries
    .filter((entry) => entry.isDirectory() && /^F-\d{3}-/.test(entry.name))
    .map((entry) => entry.name)
    .sort();

  const summaryRows = [];
  const blockedRows = [];
  const clarificationRows = [];

  for (const dirName of featureDirs) {
    const featureDir = path.join(featuresRoot, dirName);
    const specPath = path.join(featureDir, 'spec.md');
    const tasksPath = path.join(featureDir, 'tasks.md');

    const specContent = await fs.readFile(specPath, 'utf8');
    const tasksContent = await fs.readFile(tasksPath, 'utf8');

    const specMeta = parseFrontmatter(specContent) ?? {};
    const taskRows = parseTaskRows(tasksContent);

    const totalTasks = taskRows.length;
    const doneTasks = safeStatusCount(taskRows, 'Done');
    const blockedTasks = safeStatusCount(taskRows, 'Blocked');
    const clarification = hasNeedsClarification(specContent) ? 'Yes' : 'No';
    const statusCell = renderStatusBadge(specMeta.status ?? '-');
    const clarificationCell = renderFlagBadge(clarification);

    const linkedPrd = Array.isArray(specMeta.linked_prd_ids) ? specMeta.linked_prd_ids.join(', ') : '';
    summaryRows.push(
      `| ${specMeta.feature_id ?? dirName.split('-').slice(0, 2).join('-')} | ${specMeta.title ?? dirName} | ${linkedPrd} | ${statusCell} | ${doneTasks}/${totalTasks} | ${blockedTasks} | ${clarificationCell} | ${specMeta.last_updated ?? '-'} |`
    );

    for (const row of taskRows) {
      if (row.status !== 'Blocked') continue;
      blockedRows.push(
        `| ${specMeta.feature_id ?? '-'} | ${row.taskId} | ${row.task} | ${row.detail} | ${featureLink(dirName, 'tasks.md')} |`
      );
    }

    if (clarification === 'Yes') {
      clarificationRows.push(`- ${featureLink(dirName, 'spec.md')}`);
    }
  }

  const content = [
    '---',
    'cssclasses:',
    '  - sdd-progress',
    '---',
    '',
    '# SDD Progress',
    '',
    `Generated: ${nowIso()}`,
    '',
    'This file is the single progress source. Regenerate with `npm run specs:progress`.',
    '',
    '## Feature Summary',
    '',
    '| Feature ID | Title | PRD IDs | Status | Progress | Blocked | Clarification | Last Updated |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...(summaryRows.length > 0 ? summaryRows : ['| - | - | - | - | - | - | - | - |']),
    '',
    '## Blocked Tasks',
    '',
    '| Feature | Task ID | Task | Detail | Source |',
    '| --- | --- | --- | --- | --- |',
    ...(blockedRows.length > 0 ? blockedRows : ['| - | - | No blocked tasks | - | - |']),
    '',
    '## NEEDS CLARIFICATION',
    '',
    ...(clarificationRows.length > 0 ? clarificationRows : ['- None']),
    '',
  ].join('\n');

  await fs.writeFile(outFile, content);
  console.log(`Updated ${path.relative(repoRoot, outFile)}`);
}

main().catch((error) => {
  console.error(String(error.message ?? error));
  process.exit(1);
});
