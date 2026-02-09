export const ROUTING_CASES = [
  {
    id: 'route-spec-planner',
    task: '신규 기능 스펙 문서(spec/plan/tasks/test-matrix)를 정합성 있게 맞추고 PRD ID 추적을 확인해줘.',
    expectedAgent: 'spec-planner',
    reasonKeywords: ['spec', 'PRD', 'test-matrix'],
  },
  {
    id: 'route-implementer',
    task: 'src/app/projects/new/page.tsx 동작을 최소 수정으로 구현하고 회귀 없이 반영해줘.',
    expectedAgent: 'implementer',
    reasonKeywords: ['implement', 'minimal', 'code'],
  },
  {
    id: 'route-test-guardian',
    task: '이번 변경에 필요한 테스트 게이트를 판단해서 verify/build/specs 명령 누락이 없는지 체크해줘.',
    expectedAgent: 'test-guardian',
    reasonKeywords: ['test', 'verify', 'build'],
  },
  {
    id: 'route-browser-verifier',
    task: '폼 제출 플로우가 실제 브라우저에서 깨지는지 재현/검증해줘.',
    expectedAgent: 'browser-verifier',
    reasonKeywords: ['browser', 'flow', 'validate'],
  },
  {
    id: 'route-reviewer',
    task: '머지 전에 회귀 위험, 누락 테스트, 고위험 변경점을 리뷰해줘.',
    expectedAgent: 'reviewer',
    reasonKeywords: ['review', 'risk', 'regression'],
  },
];

export const STATIC_RULES = {
  requiredFiles: [
    'spec-planner.md',
    'implementer.md',
    'test-guardian.md',
    'browser-verifier.md',
    'reviewer.md',
  ],
};
