import CodexExecProvider from './codex-exec-provider.mjs';
import {
  CASES,
  GLOBAL_FORBIDDEN_PATTERNS,
  RUBRIC,
  TOTAL_CASE_WEIGHT,
} from '../../prompt-evals/codex-quality-cases.mjs';

const workdir = process.cwd();
const threshold = Number(process.env.CODEX_QUALITY_THRESHOLD || 85);
const minCaseScore = Number(process.env.CODEX_QUALITY_MIN_CASE_SCORE || 70);
const runs = Number(process.env.CODEX_QUALITY_RUNS || 1);

function parseCommands(output) {
  const format = {
    validJson: false,
    hasCommandsArray: false,
    allCommandsAreStrings: false,
  };

  try {
    format.validJson = true;
    const parsed = JSON.parse(output);
    if (!parsed || !Array.isArray(parsed.commands)) {
      return { commands: [], format };
    }
    format.hasCommandsArray = true;
    format.allCommandsAreStrings = parsed.commands.every((c) => typeof c === 'string');
    return {
      commands: parsed.commands.filter((c) => typeof c === 'string'),
      format,
    };
  } catch {
    return { commands: [], format };
  }
}

function getFormatScore(format) {
  let score = 0;
  if (format.validJson) {
    score += 8;
  }
  if (format.hasCommandsArray) {
    score += 6;
  }
  if (format.allCommandsAreStrings) {
    score += 6;
  }
  return score;
}

function getCoverageScore(commands, requiredPatterns) {
  if (requiredPatterns.length === 0) {
    return RUBRIC.coverage;
  }
  const matchedRequired = requiredPatterns.filter((pattern) => commands.some((c) => pattern.test(c))).length;
  return Number(((matchedRequired / requiredPatterns.length) * RUBRIC.coverage).toFixed(2));
}

function getRelevanceScore(commands, allowedPatterns, minCommands, maxCommands) {
  if (commands.length === 0) {
    return 0;
  }

  const countInRange = commands.length >= minCommands && commands.length <= maxCommands;
  const countScore = countInRange ? 10 : 0;

  const allowedCount = commands.filter((command) =>
    allowedPatterns.length === 0 ? true : allowedPatterns.some((pattern) => pattern.test(command)),
  ).length;
  const topicalRatio = allowedCount / commands.length;
  const topicalScore = Number((topicalRatio * 10).toFixed(2));

  return Number((countScore + topicalScore).toFixed(2));
}

function getSafetyScore(commands) {
  const violations = commands.filter((command) =>
    GLOBAL_FORBIDDEN_PATTERNS.some((pattern) => pattern.test(command)),
  );
  return {
    score: violations.length === 0 ? RUBRIC.safety : 0,
    violations,
  };
}

function scoreSingleRun(testCase, output) {
  const parsed = parseCommands(output);
  const formatScore = getFormatScore(parsed.format);
  const coverageScore = getCoverageScore(parsed.commands, testCase.requiredPatterns);
  const relevanceScore = getRelevanceScore(
    parsed.commands,
    testCase.allowedPatterns,
    testCase.minCommands,
    testCase.maxCommands,
  );
  const safety = getSafetyScore(parsed.commands);

  const total = Number((formatScore + coverageScore + relevanceScore + safety.score).toFixed(2));

  return {
    commands: parsed.commands,
    format: parsed.format,
    dimensions: {
      format: formatScore,
      coverage: coverageScore,
      relevance: relevanceScore,
      safety: safety.score,
    },
    safetyViolations: safety.violations,
    score: total,
  };
}

async function main() {
  const provider = new CodexExecProvider({ id: 'local-codex-exec' });

  let weightedScoreSum = 0;
  const caseResults = [];
  const failedCases = [];

  for (const testCase of CASES) {
    const runResults = [];
    const runErrors = [];

    for (let run = 0; run < runs; run += 1) {
      const response = await provider.callApi(testCase.question, {
        vars: { workdir },
      });

      if (response.error) {
        runErrors.push(response.error);
      }

      runResults.push(scoreSingleRun(testCase, response.output));
    }

    const avgScore = Number((runResults.reduce((sum, r) => sum + r.score, 0) / runResults.length).toFixed(2));
    weightedScoreSum += avgScore * testCase.caseWeight;

    if (avgScore < minCaseScore) {
      failedCases.push(testCase.id);
    }

    const latest = runResults[runResults.length - 1];

    caseResults.push({
      id: testCase.id,
      description: testCase.description,
      case_weight: testCase.caseWeight,
      score: avgScore,
      max_score: 100,
      latest_commands: latest.commands,
      latest_dimensions: latest.dimensions,
      safety_violations: latest.safetyViolations,
      runs: runResults,
      errors: runErrors,
    });
  }

  const percent = Number((weightedScoreSum / TOTAL_CASE_WEIGHT).toFixed(2));

  const summary = {
    score_percent: percent,
    threshold_percent: threshold,
    min_case_score: minCaseScore,
    runs_per_case: runs,
    rubric: RUBRIC,
    weighted_points_earned: percent,
    weighted_points_max: 100,
    total_case_weight: TOTAL_CASE_WEIGHT,
    pass: percent >= threshold && failedCases.length === 0,
    failed_cases: failedCases,
    cases: caseResults,
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
