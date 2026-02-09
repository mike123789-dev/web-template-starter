# Specs Workspace

PRD를 source of truth로 두고, 기능 단위 Spec/Plan/Tasks/Test Matrix를 관리하는 문서 허브다.

## Structure

- `prd.md`: 제품 요구사항과 성공 기준
- `glossary.md`: 공통 용어 정의
- `decisions.md`: 주요 결정 기록
- `templates/`: 기능 문서 템플릿
- `features/`: 기능별 실행 문서

## Status Workflow

1. `Draft`: 요구사항 초안
2. `Ready`: 구현 가능한 상태(모호성 없음)
3. `In Progress`: 구현 진행 중
4. `Verifying`: 테스트/검증 중
5. `Done`: DoD 충족

## Progress Dashboard

| Feature ID | Title | PRD IDs | Status | Progress | Last Updated |
| --- | --- | --- | --- | --- | --- |
| F-001 | Project Create Flow | FR-001, FR-002, NFR-001 | Ready | 0/6 | 2026-02-09 |
| F-002 | Project Filter/Sort | FR-003, FR-004, NFR-002 | Draft | 0/5 | 2026-02-09 |

## Operating Rules

1. 모든 기능은 `features/F-xxx-.../` 폴더를 먼저 만든다.
2. `spec.md`에 `[NEEDS CLARIFICATION]`이 남아 있으면 구현 시작하지 않는다.
3. `tasks.md`의 각 작업은 최소 1개의 PRD 요구사항 ID를 가진다.
4. `tasks.md`의 각 작업은 테스트 명령(또는 근거 있는 N/A)을 가진다.
5. `test-matrix.md`에서 모든 Acceptance Criteria가 테스트에 매핑되어야 `Done`이다.
6. 비문서 변경이면 최소 `npm run verify`를 통과한다.
7. 라우트/API/설정 변경은 `npm run build`까지 통과한다.
