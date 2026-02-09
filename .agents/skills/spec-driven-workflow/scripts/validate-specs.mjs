#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FEATURE_DOC_STATUS = new Set(['Draft', 'Ready', 'In Progress', 'Verifying', 'Done']);
const TASK_STATUS = new Set(['Todo', 'In Progress', 'Blocked', 'Done']);

const REQUIRED_DOCS = [
  { file: 'spec.md', docType: 'spec' },
  { file: 'plan.md', docType: 'plan' },
  { file: 'tasks.md', docType: 'tasks' },
  { file: 'test-matrix.md', docType: 'test-matrix' },
];

function resolveRepoRoot() {
  const currentFile = fileURLToPath(import.meta.url);
  return path.resolve(path.dirname(currentFile), '../../../../');
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return null;

  const block = match[1];
  const result = {};
  let activeArrayKey = null;

  for (const rawLine of block.split('\n')) {
    const line = rawLine.trimEnd();
    if (!line.trim()) continue;

    if (line.startsWith('  - ') || line.startsWith('- ')) {
      if (!activeArrayKey) continue;
      const value = line.replace(/^\s*-\s*/, '').replace(/^"|"$/g, '');
      result[activeArrayKey].push(value);
      continue;
    }

    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const valueRaw = line.slice(idx + 1).trim();

    if (!valueRaw) {
      result[key] = [];
      activeArrayKey = key;
      continue;
    }

    activeArrayKey = null;
    result[key] = valueRaw.replace(/^"|"$/g, '');
  }

  return result;
}

async function fileExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function requiredKeysByDocType(docType) {
  if (docType === 'task-detail') {
    return ['doc_type', 'title', 'feature_id', 'task_id', 'status', 'linked_prd_ids', 'last_updated'];
  }
  return ['doc_type', 'title', 'feature_id', 'status', 'linked_prd_ids', 'last_updated'];
}

function validateDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function parseTaskRows(tasksContent) {
  const rows = [];
  for (const line of tasksContent.split('\n')) {
    if (!line.startsWith('| T-')) continue;
    const cols = line
      .split('|')
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
    if (cols.length < 7) continue;
    const [taskId, task, prdIds, output, requiredTestCommand, detail, status] = cols;
    rows.push({
      taskId,
      task,
      prdIds,
      output,
      requiredTestCommand,
      detail: detail.replaceAll('`', ''),
      status,
    });
  }
  return rows;
}

function hasAllLinks(content, links) {
  return links.every((link) => content.includes(link));
}

async function validateFeatureDir(featureDir, errors) {
  const folderName = path.basename(featureDir);
  const featureId = folderName.split('-').slice(0, 2).join('-');

  const docs = {};
  for (const doc of REQUIRED_DOCS) {
    const filePath = path.join(featureDir, doc.file);
    if (!(await fileExists(filePath))) {
      errors.push(`${folderName}: missing required file ${doc.file}`);
      continue;
    }
    const content = await fs.readFile(filePath, 'utf8');
    docs[doc.file] = { content, filePath, docType: doc.docType };
  }

  for (const { file, docType } of REQUIRED_DOCS) {
    const doc = docs[file];
    if (!doc) continue;
    const frontmatter = parseFrontmatter(doc.content);
    if (!frontmatter) {
      errors.push(`${folderName}/${file}: missing YAML frontmatter`);
      continue;
    }

    for (const key of requiredKeysByDocType(docType)) {
      if (!(key in frontmatter)) {
        errors.push(`${folderName}/${file}: missing frontmatter key "${key}"`);
      }
    }

    if (frontmatter.doc_type && frontmatter.doc_type !== docType) {
      errors.push(`${folderName}/${file}: doc_type must be "${docType}"`);
    }
    if (frontmatter.feature_id && frontmatter.feature_id !== featureId) {
      errors.push(`${folderName}/${file}: feature_id must match folder prefix "${featureId}"`);
    }
    if (frontmatter.status && !FEATURE_DOC_STATUS.has(frontmatter.status)) {
      errors.push(`${folderName}/${file}: invalid status "${frontmatter.status}"`);
    }
    if (!Array.isArray(frontmatter.linked_prd_ids) || frontmatter.linked_prd_ids.length === 0) {
      errors.push(`${folderName}/${file}: linked_prd_ids must be a non-empty array`);
    }
    if (frontmatter.last_updated && !validateDate(frontmatter.last_updated)) {
      errors.push(`${folderName}/${file}: last_updated must be YYYY-MM-DD`);
    }
  }

  if (docs['spec.md']?.content.includes('[NEEDS CLARIFICATION]')) {
    const specFrontmatter = parseFrontmatter(docs['spec.md'].content);
    if (specFrontmatter?.status && specFrontmatter.status !== 'Draft') {
      errors.push(`${folderName}/spec.md: status must be Draft while [NEEDS CLARIFICATION] exists`);
    }
  }

  if (docs['spec.md'] && !hasAllLinks(docs['spec.md'].content, ['[[plan]]', '[[tasks]]', '[[test-matrix]]'])) {
    errors.push(`${folderName}/spec.md: missing one or more required Related Docs links`);
  }
  if (docs['plan.md'] && !hasAllLinks(docs['plan.md'].content, ['[[spec]]', '[[tasks]]', '[[test-matrix]]'])) {
    errors.push(`${folderName}/plan.md: missing one or more required Related Docs links`);
  }
  if (docs['tasks.md'] && !hasAllLinks(docs['tasks.md'].content, ['[[spec]]', '[[plan]]', '[[test-matrix]]'])) {
    errors.push(`${folderName}/tasks.md: missing one or more required Related Docs links`);
  }
  if (
    docs['test-matrix.md'] &&
    !hasAllLinks(docs['test-matrix.md'].content, ['[[spec]]', '[[plan]]', '[[tasks]]'])
  ) {
    errors.push(`${folderName}/test-matrix.md: missing one or more required Related Docs links`);
  }

  if (docs['tasks.md']) {
    const taskRows = parseTaskRows(docs['tasks.md'].content);
    const taskIds = new Set(taskRows.map((row) => row.taskId));

    for (const row of taskRows) {
      if (!TASK_STATUS.has(row.status)) {
        errors.push(`${folderName}/tasks.md: invalid task status "${row.status}" in ${row.taskId}`);
      }
      if (row.detail !== '-') {
        const detailPath = path.join(featureDir, row.detail);
        if (!(await fileExists(detailPath))) {
          errors.push(`${folderName}/tasks.md: detail file not found for ${row.taskId} -> ${row.detail}`);
        }
      }
    }

    const taskDetailDir = path.join(featureDir, 'tasks');
    if (await fileExists(taskDetailDir)) {
      const entries = await fs.readdir(taskDetailDir);
      for (const entry of entries) {
        if (!entry.endsWith('.md')) continue;
        const taskId = path.basename(entry, '.md');
        const detailFilePath = path.join(taskDetailDir, entry);
        const detailContent = await fs.readFile(detailFilePath, 'utf8');
        const fm = parseFrontmatter(detailContent);

        if (!fm) {
          errors.push(`${folderName}/tasks/${entry}: missing YAML frontmatter`);
          continue;
        }

        for (const key of requiredKeysByDocType('task-detail')) {
          if (!(key in fm)) {
            errors.push(`${folderName}/tasks/${entry}: missing frontmatter key "${key}"`);
          }
        }

        if (fm.doc_type && fm.doc_type !== 'task-detail') {
          errors.push(`${folderName}/tasks/${entry}: doc_type must be "task-detail"`);
        }
        if (fm.feature_id && fm.feature_id !== featureId) {
          errors.push(`${folderName}/tasks/${entry}: feature_id must match "${featureId}"`);
        }
        if (fm.task_id && fm.task_id !== taskId) {
          errors.push(`${folderName}/tasks/${entry}: task_id must match filename "${taskId}"`);
        }
        if (fm.status && !TASK_STATUS.has(fm.status)) {
          errors.push(`${folderName}/tasks/${entry}: invalid task status "${fm.status}"`);
        }
        if (!Array.isArray(fm.linked_prd_ids) || fm.linked_prd_ids.length === 0) {
          errors.push(`${folderName}/tasks/${entry}: linked_prd_ids must be a non-empty array`);
        }
        if (fm.last_updated && !validateDate(fm.last_updated)) {
          errors.push(`${folderName}/tasks/${entry}: last_updated must be YYYY-MM-DD`);
        }

        if (!taskIds.has(taskId)) {
          errors.push(`${folderName}/tasks/${entry}: no matching row found in tasks.md`);
        }
        if (!hasAllLinks(detailContent, ['[[../tasks]]', '[[../spec]]', '[[../test-matrix]]'])) {
          errors.push(`${folderName}/tasks/${entry}: missing one or more required Related Docs links`);
        }
      }
    }
  }
}

async function main() {
  const repoRoot = resolveRepoRoot();
  const featuresRoot = path.join(repoRoot, 'docs/specs/features');
  const entries = await fs.readdir(featuresRoot, { withFileTypes: true });
  const featureDirs = entries
    .filter((entry) => entry.isDirectory() && /^F-\d{3}-/.test(entry.name))
    .map((entry) => path.join(featuresRoot, entry.name))
    .sort();

  const errors = [];
  for (const featureDir of featureDirs) {
    await validateFeatureDir(featureDir, errors);
  }

  if (errors.length > 0) {
    console.error('Spec validation failed:\n');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Spec validation passed for ${featureDirs.length} feature folder(s).`);
}

main().catch((error) => {
  console.error(String(error.message ?? error));
  process.exit(1);
});
