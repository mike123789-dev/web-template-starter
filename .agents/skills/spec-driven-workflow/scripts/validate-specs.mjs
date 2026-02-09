#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import {
  fileExists,
  hasNeedsClarification,
  parseFrontmatter,
  parseTaskRow,
  resolveRepoRoot,
} from './common.mjs';

const FEATURE_DOC_STATUS = new Set(['Draft', 'Ready', 'In Progress', 'Verifying', 'Done']);
const TASK_STATUS = new Set(['Todo', 'In Progress', 'Blocked', 'Done']);
const PRD_ID_PATTERN = /^(FR|NFR)-\d{3}$/;
const PLACEHOLDER_PATTERN = /<[^>\n]+>/;

const REQUIRED_DOCS = [
  { file: 'spec.md', docType: 'spec' },
  { file: 'plan.md', docType: 'plan' },
  { file: 'tasks.md', docType: 'tasks' },
  { file: 'test-matrix.md', docType: 'test-matrix' },
];

function requiredKeysByDocType(docType) {
  if (docType === 'task-detail') {
    return ['doc_type', 'title', 'feature_id', 'task_id', 'status', 'linked_prd_ids', 'last_updated'];
  }
  return ['doc_type', 'title', 'feature_id', 'status', 'linked_prd_ids', 'last_updated'];
}

function validateDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function parsePrdIdsFromPrd(prdContent) {
  return new Set([...prdContent.matchAll(/`((?:FR|NFR)-\d{3})`/g)].map((match) => match[1]));
}

function normalizeId(value) {
  return value.replaceAll('`', '').trim();
}

function parseRowPrdIds(value) {
  return value
    .split(',')
    .map((part) => normalizeId(part))
    .filter(Boolean);
}

function parseTaskRows(tasksContent) {
  const rows = [];
  for (const line of tasksContent.split('\n')) {
    const cols = parseTaskRow(line);
    if (!cols) continue;
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

function hasTemplatePlaceholder(content) {
  return PLACEHOLDER_PATTERN.test(content);
}

function validatePrdIds(ids, knownPrdIds, context, errors) {
  for (const id of ids) {
    if (!PRD_ID_PATTERN.test(id)) {
      errors.push(`${context}: invalid PRD ID format "${id}"`);
      continue;
    }
    if (!knownPrdIds.has(id)) {
      errors.push(`${context}: unknown PRD ID "${id}" (not found in docs/specs/prd.md)`);
    }
  }
}

async function validateFeatureDir(featureDir, knownPrdIds, errors) {
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
    } else {
      validatePrdIds(frontmatter.linked_prd_ids, knownPrdIds, `${folderName}/${file}: linked_prd_ids`, errors);
    }
    if (frontmatter.last_updated && !validateDate(frontmatter.last_updated)) {
      errors.push(`${folderName}/${file}: last_updated must be YYYY-MM-DD`);
    }

    const contentWithoutFrontmatter = doc.content.replace(/^---\n[\s\S]*?\n---\n?/, '');
    if (hasTemplatePlaceholder(contentWithoutFrontmatter)) {
      errors.push(`${folderName}/${file}: unresolved placeholder detected (angle-bracket token)`);
    }
  }

  if (docs['spec.md'] && hasNeedsClarification(docs['spec.md'].content)) {
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
      const rowPrdIds = parseRowPrdIds(row.prdIds);
      if (rowPrdIds.length === 0) {
        errors.push(`${folderName}/tasks.md: missing PRD IDs in ${row.taskId}`);
      } else {
        validatePrdIds(rowPrdIds, knownPrdIds, `${folderName}/tasks.md ${row.taskId}`, errors);
      }
      if (!row.requiredTestCommand || normalizeId(row.requiredTestCommand) === '-') {
        errors.push(`${folderName}/tasks.md: missing required test command in ${row.taskId}`);
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
        } else {
          validatePrdIds(
            fm.linked_prd_ids,
            knownPrdIds,
            `${folderName}/tasks/${entry}: linked_prd_ids`,
            errors
          );
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

        const contentWithoutFrontmatter = detailContent.replace(/^---\n[\s\S]*?\n---\n?/, '');
        if (hasTemplatePlaceholder(contentWithoutFrontmatter)) {
          errors.push(`${folderName}/tasks/${entry}: unresolved placeholder detected (angle-bracket token)`);
        }
      }
    }
  }
}

async function main() {
  const repoRoot = resolveRepoRoot();
  const featuresRoot = path.join(repoRoot, 'docs/specs/features');
  const prdPath = path.join(repoRoot, 'docs/specs/prd.md');
  const prdContent = await fs.readFile(prdPath, 'utf8');
  const knownPrdIds = parsePrdIdsFromPrd(prdContent);

  if (knownPrdIds.size === 0) {
    throw new Error('No PRD IDs were found in docs/specs/prd.md');
  }

  const entries = await fs.readdir(featuresRoot, { withFileTypes: true });
  const featureDirs = entries
    .filter((entry) => entry.isDirectory() && /^F-\d{3}-/.test(entry.name))
    .map((entry) => path.join(featuresRoot, entry.name))
    .sort();

  const errors = [];
  for (const featureDir of featureDirs) {
    await validateFeatureDir(featureDir, knownPrdIds, errors);
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
