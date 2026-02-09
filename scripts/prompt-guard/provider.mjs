import { readFileSync, existsSync } from 'node:fs';
import { globSync } from 'glob';

const REQUIRED_AGENTS_SECTIONS = [
  '## Project Structure & Module Organization',
  '## Build, Test, and Development Commands',
  '## Coding Style & Naming Conventions',
  '## Testing Guidelines',
  '## Spec-Driven Flow (Short)',
  '## Commit & Pull Request Guidelines',
  '## Configuration & Environment',
];

const FORBIDDEN_PATTERNS = [/\bTODO\b/i, /lorem ipsum/i, /TBD/i];

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return { hasFrontmatter: false, fields: {} };
  }

  const raw = match[1].split('\n');
  const fields = {};
  let activeMultilineKey = null;
  for (const line of raw) {
    const keyValue = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (keyValue) {
      const key = keyValue[1];
      const value = (keyValue[2] || '').trim();
      if (value) {
        fields[key] = value;
        activeMultilineKey = null;
      } else {
        fields[key] = '';
        activeMultilineKey = key;
      }
      continue;
    }

    if (activeMultilineKey && /^\s+/.test(line)) {
      fields[activeMultilineKey] = `${fields[activeMultilineKey]} ${line.trim()}`.trim();
    }
  }

  return { hasFrontmatter: true, fields };
}

function checkAgentsFile(path) {
  const source = readFileSync(path, 'utf8');
  const missingSections = REQUIRED_AGENTS_SECTIONS.filter((heading) => !source.includes(heading));
  const forbiddenHits = FORBIDDEN_PATTERNS.filter((re) => re.test(source)).map((re) => re.toString());

  const checks = [
    {
      id: 'agents-has-main-title',
      pass: source.startsWith('# Repository Guidelines'),
      detail: 'Top-level title must be "# Repository Guidelines".',
    },
    {
      id: 'agents-required-sections',
      pass: missingSections.length === 0,
      detail:
        missingSections.length === 0
          ? 'All required sections exist.'
          : `Missing sections: ${missingSections.join(', ')}`,
    },
    {
      id: 'agents-no-forbidden-placeholders',
      pass: forbiddenHits.length === 0,
      detail:
        forbiddenHits.length === 0
          ? 'No placeholder patterns found.'
          : `Forbidden patterns found: ${forbiddenHits.join(', ')}`,
    },
  ];

  return summarize(path, checks);
}

function extractLikelyRelativeRefs(source) {
  const refs = [];

  const markdownLinks = [...source.matchAll(/\[[^\]]+\]\((\.{1,2}\/[^)\s]+)\)/g)].map((m) => m[1]);
  refs.push(...markdownLinks);

  const backtickPaths = [...source.matchAll(/`(\.{1,2}\/[^`\s]+)`/g)].map((m) => m[1]);
  refs.push(...backtickPaths);

  return [...new Set(refs)];
}

function checkSkillFile(path) {
  const source = readFileSync(path, 'utf8');
  const { hasFrontmatter, fields } = parseFrontmatter(source);

  const checks = [];

  checks.push({
    id: 'skill-frontmatter-exists',
    pass: hasFrontmatter,
    detail: hasFrontmatter ? 'Frontmatter exists.' : 'Frontmatter block is missing.',
  });

  checks.push({
    id: 'skill-frontmatter-name',
    pass: Boolean(fields.name),
    detail: fields.name ? `name=${fields.name}` : 'frontmatter.name is missing.',
  });

  checks.push({
    id: 'skill-frontmatter-description',
    pass: Boolean(fields.description),
    detail: fields.description ? 'description exists.' : 'frontmatter.description is missing.',
  });

  checks.push({
    id: 'skill-h1-title',
    pass: /^#\s+.+/m.test(source),
    detail: /^#\s+.+/m.test(source) ? 'H1 title exists.' : 'H1 title is missing.',
  });

  const hasUsageSection =
    /##\s+.*(When|How|Usage|Workflow)/i.test(source) ||
    /(Use when|Apply these rules when|Reference these guidelines when)/i.test(source);
  checks.push({
    id: 'skill-has-usage-guidance',
    pass: hasUsageSection,
    detail: hasUsageSection
      ? 'Contains usage/workflow section.'
      : 'Missing usage/workflow-style section (When/How/Usage/Workflow).',
  });

  const referencedFiles = extractLikelyRelativeRefs(source).filter(
    (p) => !p.startsWith('http') && !p.startsWith('/'),
  );

  const missingRefs = referencedFiles
    .map((p) => ({ p, full: path.replace(/SKILL\.md$/, '') + p.replace(/^\.\//, '') }))
    .filter(({ full }) => !existsSync(full))
    .slice(0, 5);

  checks.push({
    id: 'skill-local-reference-validity',
    pass: missingRefs.length === 0,
    detail:
      missingRefs.length === 0
        ? 'Sampled local path references resolve.'
        : `Unresolved refs: ${missingRefs.map(({ p }) => p).join(', ')}`,
  });

  return summarize(path, checks);
}

function checkSkillsGlob(globPattern) {
  const files = globSync(globPattern).sort();
  if (files.length === 0) {
    return {
      pass: false,
      score: 0,
      filesChecked: 0,
      failingFiles: [{ file: globPattern, reason: 'No files matched pattern.' }],
      checks: [],
    };
  }

  const results = files.map((file) => checkSkillFile(file));
  const totalScore = results.reduce((sum, result) => sum + result.score, 0);
  const pass = results.every((result) => result.pass);

  return {
    pass,
    score: Number((totalScore / results.length).toFixed(3)),
    filesChecked: results.length,
    failingFiles: results.filter((result) => !result.pass).map((result) => ({
      file: result.file,
      failedChecks: result.checks.filter((check) => !check.pass).map((check) => check.id),
    })),
    checks: results,
  };
}

function summarize(file, checks) {
  const passed = checks.filter((check) => check.pass).length;
  const score = Number((passed / checks.length).toFixed(3));

  return {
    file,
    pass: checks.every((check) => check.pass),
    score,
    checks,
  };
}

export default class LocalPromptGuardProvider {
  constructor(options = {}) {
    this.providerId = options.id || 'local-prompt-guard';
  }

  id() {
    return this.providerId;
  }

  async callApi(prompt, context) {
    const vars = context?.vars || {};
    const mode = vars.mode || 'agents';

    let result;

    if (mode === 'agents') {
      result = checkAgentsFile(vars.target || 'AGENTS.md');
    } else if (mode === 'skills') {
      result = checkSkillsGlob(vars.target || '.agents/skills/**/SKILL.md');
    } else {
      result = {
        pass: false,
        score: 0,
        error: `Unsupported mode: ${mode}`,
      };
    }

    return {
      output: JSON.stringify({ prompt, ...result }, null, 2),
    };
  }
}
