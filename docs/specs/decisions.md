# Decisions Log

> 이 문서는 레거시 로그다. 신규 결정 기록은 `docs/specs/decisions/` ADR 문서를 사용한다.

## D-001: PRD + Feature Specs Co-located

- Date: 2026-02-09
- Status: Accepted
- Context: 기능 추가 시 요구사항/테스트 추적 일관성이 필요했다.
- Decision: `docs/specs/` 아래에 PRD와 기능 문서를 함께 관리한다.
- Consequence: 에이전트가 단일 경로에서 맥락을 얻고, 요구사항-테스트 매핑 누락을 줄일 수 있다.

## D-002: Feature Status Workflow Fixed

- Date: 2026-02-09
- Status: Accepted
- Context: 작업 상태 표현이 팀/작업자마다 달라 관리가 어려웠다.
- Decision: `Draft -> Ready -> In Progress -> Verifying -> Done` 상태를 강제한다.
- Consequence: 진행 상황 비교와 리뷰 타이밍이 명확해진다.
