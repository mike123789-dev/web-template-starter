import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export function parseArgs(argv, options = {}) {
  const args = {};
  const booleanFlags = new Set(options.booleanFlags ?? []);

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;

    const key = token.slice(2);
    if (booleanFlags.has(key)) {
      args[key] = true;
      continue;
    }

    const value = argv[i + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`);
    }
    args[key] = value;
    i += 1;
  }

  return args;
}

export function resolveRepoRoot() {
  const currentFile = fileURLToPath(import.meta.url);
  return path.resolve(path.dirname(currentFile), '../../../../');
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function nowIso() {
  return new Date().toISOString();
}

export async function fileExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export function parseFrontmatter(content) {
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

export function findSection(content, heading) {
  const sectionRegex = new RegExp(`^## ${heading}\\n([\\s\\S]*?)(?=\\n## |$)`, 'm');
  return sectionRegex.exec(content)?.[1] ?? '';
}

export function hasNeedsClarification(specContent) {
  const openQuestions = findSection(specContent, 'Open Questions');
  return openQuestions.includes('[NEEDS CLARIFICATION]');
}

export function setFrontmatterField(content, key, value) {
  const valueLiteral = `"${value}"`;
  const quotedRegex = new RegExp(`^(${key}:\\s*)"[^"]*"\\s*$`, 'm');
  if (quotedRegex.test(content)) {
    return content.replace(quotedRegex, `$1${valueLiteral}`);
  }
  const unquotedRegex = new RegExp(`^(${key}:\\s*)([^\\n#]+?)\\s*$`, 'm');
  if (unquotedRegex.test(content)) {
    return content.replace(unquotedRegex, `$1${valueLiteral}`);
  }
  return content;
}

export function parseTaskRow(line) {
  if (!line.startsWith('|')) return null;
  const cells = line
    .split('|')
    .slice(1, -1)
    .map((part) => part.trim());
  if (cells.length < 7) return null;
  if (!/^T-\d{3}$/.test(cells[0])) return null;
  return cells;
}

export async function findFeatureDir(featuresRoot, featureId) {
  const entries = await fs.readdir(featuresRoot, { withFileTypes: true });
  const dirs = entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(`${featureId}-`))
    .map((entry) => entry.name);

  if (dirs.length === 0) {
    throw new Error(`Feature folder not found for ${featureId}`);
  }
  if (dirs.length > 1) {
    throw new Error(`Multiple feature folders matched ${featureId}: ${dirs.join(', ')}`);
  }
  return path.join(featuresRoot, dirs[0]);
}

export function runNpm(cwd, args) {
  const result = spawnSync('npm', args, { cwd, stdio: 'inherit' });
  if (result.status !== 0) {
    throw new Error(`Command failed: npm ${args.join(' ')}`);
  }
}
