# Testing

이 프로젝트는 Next.js 웹 앱이다. UI 컴포넌트는 Storybook 중심으로 검증하고, 로직은 유닛 테스트로 분리한다. E2E는 필요할 때 최소 범위로 도입한다.

## 1) UI Component Test (Storybook)

목표: 브라우저/서버 의존 없이 UI 컴포넌트를 빠르게 검증한다.

- **테스트 단위**: `*.stories.tsx` (컴포넌트와 co-locate)
- **권장 스택**: Storybook + Vitest addon
- **실행**
  - Storybook: `npm run storybook`
  - Storybook test: `npm run test:storybook`
- **포인트**
  - 스토리의 `play()` + assertion으로 상호작용을 검증한다.
  - 외부 의존(네트워크/라우팅)은 Storybook 환경에서 mock으로 대체한다.

## 2) Unit Test (순수 로직)

목표: React/DOM 의존을 최소화한 **순수 로직**을 안정적으로 검증한다.

- **테스트 단위**: `*.test.ts` / `*.spec.ts` (로직과 co-locate)
- **권장 스택**: Vitest (node 환경)
- **실행**
  - Unit test: `npm run test:unit`
  - (전체) `npm test`는 unit + storybook 테스트를 연속 실행한다.
  - (전체) `npm run test:all`은 unit + storybook + E2E 테스트를 연속 실행한다.
- **포인트**
  - 파싱/정렬/계산 등은 가능한 한 UI와 분리한다.

## 3) Smoke / E2E (필요 시)

목표: 실제 브라우저에서 **핵심 플로우**가 동작하는지 마지막으로 확인한다.

- **권장 스택**: Playwright
- **실행**
  - E2E: `npm run test:e2e` (Playwright 설정의 `webServer`가 기본 포트 `3100`에서 dev 서버를 자동으로 띄운 뒤 실행)
- **포인트**
  - 일반적으로 별도 서버 수동 실행 없이 `npm run test:e2e`만 실행하면 된다.
  - 로그인/체크아웃 등 핵심 사용자 경로만 최소한으로 커버한다.

## 4) Browser Agent Validation (UI 고위험 변경 시)

목표: 테스트 스위트에서 놓치기 쉬운 실제 브라우저 상호작용 회귀를 사전에 잡는다.

- **권장 도구**: [`$agent-browser`](../../.agents/skills/agent-browser/SKILL.md)
- **수행 주체**: `.agents/agents/browser-verifier.md` subagent
- **실행 트리거**
  - `src/app/**` 라우트/페이지 동작 변경
  - 상호작용 UI 변경(폼, 필터, 정렬, 모달, 네비게이션)
  - UI가 의존하는 API 응답/검증 변경
  - 하이드레이션/localStorage/CSR-RSC 경계 수정
  - 브라우저 환경에서만 재현되는 버그 수정
- **검증 패턴**
  - `open -> snapshot -i -> interact -> re-snapshot`
  - 주요 단계에서 URL/텍스트/스크린샷 증적을 남긴다.
- **예시**
  - `agent-browser open http://127.0.0.1:3000`
  - `agent-browser snapshot -i`
  - `agent-browser click @e1`
  - `agent-browser wait --load networkidle`
  - `agent-browser snapshot -i`
  - `agent-browser screenshot --full`

## 운영 원칙

- 빠른 피드백을 위해 **Storybook 컴포넌트 테스트를 우선**한다.
- 배포 전에는 **Smoke/E2E를 최소 케이스로 실행**한다.
- 테스트 도입 시 `package.json` 스크립트와 실행 방법을 이 문서에 추가한다.
- 변경 유형별 필수 실행 목록은 `docs/agent/dod.md`를 기준으로 따른다.
- 기능 요구사항과 테스트 추적은 `docs/specs/` 문서를 source로 유지한다.
- 에이전트 운영 규칙 변경(`AGENTS.md`, `.agents/skills/**`)은 기본 `npm run prompt:guard`로 검증한다.
- `prompt-evals/**`, `scripts/prompt-guard/**`, `promptfoo*.yaml` 변경이나 PR 최종 게이트에서는 `npm run prompt:quality`(또는 `npm run prompt:all`)를 추가한다.
- UI 고위험 변경은 테스트 스위트와 별개로 browser-verifier 결과를 함께 확인한다.
