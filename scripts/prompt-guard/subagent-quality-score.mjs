import { existsSync, readFileSync } from 'node:fs';
import CodexExecProvider from './codex-exec-provider.mjs';
import { ROUTING_CASES, STATIC_RULES } from '../../prompt-evals/subagent-quality-cases.mjs';

const workdir = process.cwd();
const threshold = Number(process.env.SUBAGENT_QUALITY_THRESHOLD || 85);
const agentsDir = '.agents/agents';

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return {};
  const obj = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z0-9_-]+):\s*(.+)$/);
    if (kv) obj[kv[1]] = kv[2].trim();
  }
  return obj;
}

function staticQualityScore() {
  const checks = [];
  let earned = 0;
  const max = 40;

  for (const file of STATIC_RULES.requiredFiles) {
    const full = `${agentsDir}/${file}`;
    const exists = existsSync(full);
    checks.push({ file, check: 'file-exists', pass: exists, points: 2 });
    if (!exists) continue;
    earned += 2;

    const src = readFileSync(full, 'utf8');
    const fm = parseFrontmatter(src);

    const hasName = Boolean(fm.name);
    checks.push({ file, check: 'frontmatter-name', pass: hasName, points: 1 });
    if (hasName) earned += 1;

    const hasDescription = Boolean(fm.description);
    checks.push({ file, check: 'frontmatter-description', pass: hasDescription, points: 1 });
    if (hasDescription) earned += 1;

    const hasResponsibilities = /##\s+Responsibilities/i.test(src);
    checks.push({ file, check: 'responsibilities-section', pass: hasResponsibilities, points: 2 });
    if (hasResponsibilities) earned += 2;

    const hasOutput = /##\s+Output Format/i.test(src);
    checks.push({ file, check: 'output-format-section', pass: hasOutput, points: 2 });
    if (hasOutput) earned += 2;
  }

  return {
    score: Number(((earned / max) * 100).toFixed(2)),
    earned,
    max,
    checks,
  };
}

function safeJsonParse(output) {
  try {
    return { ok: true, data: JSON.parse(output) };
  } catch {
    return { ok: false, data: null };
  }
}

async function routeQualityScore() {
  const provider = new CodexExecProvider({ id: 'subagent-routing' });

  const perCase = [];
  let earnedRouting = 0;
  let earnedFormat = 0;

  for (const testCase of ROUTING_CASES) {
    const prompt = [
      '다음 서브에이전트 중 하나만 선택해 JSON으로 답해: spec-planner, implementer, test-guardian, browser-verifier, reviewer.',
      '응답 스키마: {"selected_agent": string, "reason": string}',
      `요청: ${testCase.task}`,
      '반드시 JSON만 출력해.',
    ].join('\n');

    const response = await provider.callApi(prompt, { vars: { workdir } });
    const parsed = safeJsonParse(response.output);

    let formatPoints = 0;
    let routingPoints = 0;
    let selected = null;
    let reason = '';

    if (parsed.ok && parsed.data && typeof parsed.data === 'object') {
      const keys = Object.keys(parsed.data);
      const strictShape = keys.length === 2 && keys.includes('selected_agent') && keys.includes('reason');
      const validTypes = typeof parsed.data.selected_agent === 'string' && typeof parsed.data.reason === 'string';
      if (strictShape && validTypes) formatPoints = 2;

      selected = parsed.data.selected_agent;
      reason = parsed.data.reason;

      if (selected === testCase.expectedAgent) routingPoints = 10;
    }

    earnedFormat += formatPoints;
    earnedRouting += routingPoints;

    perCase.push({
      id: testCase.id,
      task: testCase.task,
      expected_agent: testCase.expectedAgent,
      selected_agent: selected,
      reason,
      format_points: formatPoints,
      routing_points: routingPoints,
      output: response.output,
      error: response.error || null,
    });
  }

  const maxRouting = ROUTING_CASES.length * 10;
  const maxFormat = ROUTING_CASES.length * 2;

  return {
    score: Number((((earnedRouting + earnedFormat) / (maxRouting + maxFormat)) * 100).toFixed(2)),
    routing: {
      earned: earnedRouting,
      max: maxRouting,
    },
    format: {
      earned: earnedFormat,
      max: maxFormat,
    },
    cases: perCase,
  };
}

async function main() {
  const staticResult = staticQualityScore();
  const routeResult = await routeQualityScore();

  // Final: static 40% + routing 60%
  const total = Number((staticResult.score * 0.4 + routeResult.score * 0.6).toFixed(2));

  const summary = {
    score_percent: total,
    threshold_percent: threshold,
    pass: total >= threshold,
    dimensions: {
      static_definition_quality: staticResult.score,
      subagent_routing_quality: routeResult.score,
    },
    static: staticResult,
    routing: routeResult,
  };

  console.log(JSON.stringify(summary, null, 2));

  if (!summary.pass) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
