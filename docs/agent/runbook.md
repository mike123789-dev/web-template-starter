# Agent Runbook

이 문서는 이 저장소에서 AI 에이전트가 작업할 때의 기본 실행 절차를 정의한다.

## 목적

- 변경 품질을 일정하게 유지한다.
- 변경 유형별 필수 검증을 누락하지 않는다.
- 리뷰어가 결과를 빠르게 판단할 수 있도록 증적을 남긴다.

## 작업 절차

1. 범위 확인
- 요구사항과 변경 대상 파일을 확정한다.
- 관련 문서(`AGENTS.md`, `docs/specs/README.md`, `docs/engineering/testing.md`, `docs/agent/dod.md`)를 먼저 확인한다.

2. 변경 분류
- 아래 중 하나 이상으로 분류한다.
- 문서 전용 변경
- 에이전트 운영 문서 변경(`AGENTS.md`, `.agents/skills/**`)
- UI 컴포넌트 변경
- 순수 로직(`src/lib` 등) 변경
- App Router 페이지/레이아웃 변경
- API 라우트 변경
- 의존성/빌드/설정 변경
- 신규 기능/기능 확장 변경

3. 구현
- 신규 기능/기능 확장은 `docs/specs/features/F-xxx-.../` 문서를 먼저 작성한다.
- 최소 범위로 수정하고, 기존 동작 회귀를 우선 방지한다.
- 변경이 커지면 중간 단위로 나눠 확인한다.

4. 검증
- `docs/agent/dod.md`의 변경 유형별 필수 테스트를 실행한다.
- 에이전트 운영 문서 변경이면 기본적으로 `npm run prompt:guard`를 실행한다.
- `prompt-evals/**`, `scripts/prompt-guard/**`, `promptfoo*.yaml` 변경 또는 PR 최종 게이트에서는 `npm run prompt:quality`(또는 `npm run prompt:all`)를 추가 실행한다.
- 사용자 플로우 고위험 변경이면 `browser-verifier`로 실브라우저 검증 증적을 남긴다.
- 필요 시 추가 검증을 실행한다(예: `npm run test:all`, `npm run build`).

5. 결과 보고
- 변경 파일 목록
- 실행한 명령과 성공 여부
- 남은 리스크/미실행 항목

## 실행 원칙

- 비코드 문서 변경이 아니라면 `npm run verify`를 기본 검증으로 사용한다.
- 라우팅/API/설정 변경은 `npm run build`까지 확인한다.
- 에이전트 운영 규칙 변경은 `npm run prompt:guard`를 기본 검증으로 사용하고, 영향이 큰 변경에서만 `prompt:quality` 또는 `prompt:all`로 승격한다.
- UI/플로우 영향이 있으면 `agent-browser` 기반 검증을 병행한다.
- CI 설정 변경은 본 저장소 기본 작업 범위에서 제외한다(요청 시 별도 진행).
