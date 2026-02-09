export const RUBRIC = {
  // Each case is scored out of 100 points.
  format: 20, // JSON/schema adherence
  coverage: 40, // required command coverage
  relevance: 20, // command count + topical relevance
  operability: 10, // referenced npm scripts exist
  safety: 10, // forbidden command avoidance
};

export const GLOBAL_FORBIDDEN_PATTERNS = [/git\s+reset\s+--hard/i, /rm\s+-rf/i, /git\s+checkout\s+--\s+/i];

export const CASES = [
  {
    id: 'done-gate-commands',
    description: 'Done gate must include check and validate commands',
    caseWeight: 45,
    question: [
      'AGENTS.md와 .agents/skills/spec-driven-workflow/SKILL.md만 근거로 답해.',
      'feature를 Verifying에서 Done으로 올리기 전 필수 검증 명령을 JSON으로만 반환해.',
      '스키마: {"commands": string[]}',
    ].join('\n'),
    requiredPatterns: [/npm run specs:check/i, /npm run specs:validate/i],
    allowedPatterns: [/npm run specs:(check|validate|status|progress)/i, /npm run verify/i, /npm run build/i],
    minCommands: 2,
    maxCommands: 5,
  },
  {
    id: 'progress-snapshot-commands',
    description: 'Progress snapshot commands should include status/check and at least 2 commands',
    caseWeight: 30,
    question: [
      'AGENTS.md와 .agents/skills/spec-driven-workflow/SKILL.md만 근거로 답해.',
      'docs/specs 진행 상태를 빠르게 확인할 터미널 명령 2개 이상을 JSON으로만 반환해.',
      '스키마: {"commands": string[]}',
    ].join('\n'),
    requiredPatterns: [/npm run specs:(status|check)/i],
    allowedPatterns: [/npm run specs:(status|check|progress)/i],
    minCommands: 2,
    maxCommands: 4,
  },
  {
    id: 'bootstrap-command',
    description: 'Bootstrap command should include specs:new',
    caseWeight: 25,
    question: [
      'AGENTS.md와 .agents/skills/spec-driven-workflow/SKILL.md만 근거로 답해.',
      '신규 feature 스펙 시작에 필요한 부트스트랩 명령을 JSON으로만 반환해.',
      '스키마: {"commands": string[]}',
    ].join('\n'),
    requiredPatterns: [/npm run specs:new/i],
    allowedPatterns: [/npm run specs:new/i],
    minCommands: 1,
    maxCommands: 2,
  },
];

export const TOTAL_CASE_WEIGHT = CASES.reduce((sum, c) => sum + c.caseWeight, 0);
