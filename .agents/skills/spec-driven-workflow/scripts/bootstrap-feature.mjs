#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;

    if (token === '--dry-run' || token === '--force') {
      args[token.slice(2)] = true;
      continue;
    }

    const key = token.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`);
    }
    args[key] = value;
    i += 1;
  }
  return args;
}

function resolveRepoRoot() {
  const currentFile = fileURLToPath(import.meta.url);
  return path.resolve(path.dirname(currentFile), '../../../../');
}

function formatDate() {
  return new Date().toISOString().slice(0, 10);
}

function usage() {
  return [
    'Usage:',
    '  node .agents/skills/spec-driven-workflow/scripts/bootstrap-feature.mjs \\',
    '    --feature-id F-003 \\',
    '    --slug project-archive \\',
    '    --title "Project Archive" \\',
    '    --prd "FR-005,NFR-003" \\',
    '    [--owner "unassigned"] [--status "Draft"] [--dry-run] [--force]',
    '',
    'Notes:',
    '- status: Draft | Ready | In Progress | Verifying | Done',
    '- prd: comma-separated requirement IDs',
  ].join('\n');
}

function validateFeatureId(featureId) {
  return /^F-\d{3}$/.test(featureId);
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function replaceLinkedPrdIds(content, prdIds) {
  const block = `linked_prd_ids:\n${prdIds.map((id) => `  - "${id}"`).join('\n')}`;
  return content.replace(
    /linked_prd_ids:\n(?:\s+- "[^"]*"\n?)+/m,
    `${block}\n`
  );
}

function replaceSingleStatus(content, status) {
  return content.replace(/status:\s*"[^"]*"/, `status: "${status}"`);
}

function replaceTaskSampleIds(content, prdIds) {
  const firstFr = prdIds.find((id) => id.startsWith('FR-')) ?? prdIds[0];
  const firstNfr = prdIds.find((id) => id.startsWith('NFR-')) ?? prdIds[0];
  return content.replaceAll('FR-xxx', firstFr).replaceAll('NFR-xxx', firstNfr);
}

async function fileExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const featureId = args['feature-id'];
  const title = args.title;
  const slugInput = args.slug ?? title;
  const owner = args.owner ?? 'unassigned';
  const status = args.status ?? 'Draft';
  const dryRun = Boolean(args['dry-run']);
  const force = Boolean(args.force);
  const prdRaw = args.prd ?? '';

  if (!featureId || !title || !slugInput || !prdRaw) {
    throw new Error(`Required arguments are missing.\n\n${usage()}`);
  }
  if (!validateFeatureId(featureId)) {
    throw new Error(`Invalid feature id "${featureId}". Expected format F-001.`);
  }

  const allowedStatus = new Set(['Draft', 'Ready', 'In Progress', 'Verifying', 'Done']);
  if (!allowedStatus.has(status)) {
    throw new Error(`Invalid status "${status}".`);
  }

  const slug = slugify(slugInput);
  if (!slug) {
    throw new Error('Invalid slug after normalization.');
  }

  const prdIds = prdRaw
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
  if (prdIds.length === 0) {
    throw new Error('At least one PRD ID is required in --prd.');
  }

  const repoRoot = resolveRepoRoot();
  const templatesDir = path.join(repoRoot, 'docs/specs/templates');
  const featuresDir = path.join(repoRoot, 'docs/specs/features');
  const featureFolderName = `${featureId}-${slug}`;
  const featureDir = path.join(featuresDir, featureFolderName);
  const today = formatDate();

  if ((await fileExists(featureDir)) && !force) {
    throw new Error(`Feature directory already exists: ${featureDir}\nUse --force to overwrite.`);
  }

  const templateNames = [
    ['spec.template.md', 'spec.md'],
    ['plan.template.md', 'plan.md'],
    ['tasks.template.md', 'tasks.md'],
    ['test-matrix.template.md', 'test-matrix.md'],
  ];

  const rendered = {};
  for (const [templateName, outputName] of templateNames) {
    const templatePath = path.join(templatesDir, templateName);
    let content = await fs.readFile(templatePath, 'utf8');
    content = content
      .replaceAll('<Feature Title>', title)
      .replaceAll('F-xxx', featureId)
      .replaceAll('<name>', owner)
      .replaceAll('YYYY-MM-DD', today);
    content = replaceLinkedPrdIds(content, prdIds);
    content = replaceSingleStatus(content, status);
    content = replaceTaskSampleIds(content, prdIds);
    rendered[outputName] = content;
  }

  const featureReadme = [
    `# ${featureId} ${title}`,
    '',
    `- Status: \`${status}\``,
    `- Owner: \`${owner}\``,
    `- Linked PRD IDs: \`${prdIds.join(', ')}\``,
    `- Last Updated: \`${today}\``,
    '',
    '## Documents',
    '',
    '- `spec.md`',
    '- `plan.md`',
    '- `tasks.md`',
    '- `test-matrix.md`',
    '- `changelog.md`',
  ].join('\n');

  const changelog = [
    `# Changelog: ${featureId} ${title}`,
    '',
    `## ${today}`,
    '',
    '- Feature folder initialized via bootstrap script',
  ].join('\n');

  if (dryRun) {
    console.log('[DRY RUN] Feature scaffold preview');
    console.log(`- repoRoot: ${repoRoot}`);
    console.log(`- featureDir: ${featureDir}`);
    console.log(`- files: README.md, changelog.md, ${Object.keys(rendered).join(', ')}`);
    return;
  }

  if (force) {
    await fs.rm(featureDir, { recursive: true, force: true });
  }
  await fs.mkdir(featureDir, { recursive: true });

  await fs.writeFile(path.join(featureDir, 'README.md'), featureReadme);
  await fs.writeFile(path.join(featureDir, 'changelog.md'), changelog);
  for (const [outputName, content] of Object.entries(rendered)) {
    await fs.writeFile(path.join(featureDir, outputName), content);
  }

  console.log(`Created feature scaffold: ${path.relative(repoRoot, featureDir)}`);
}

main().catch((error) => {
  console.error(String(error.message ?? error));
  process.exit(1);
});
