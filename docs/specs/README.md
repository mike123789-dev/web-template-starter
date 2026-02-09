# Specs Workspace

PRD를 source of truth로 두고, 기능 단위 Spec/Plan/Tasks/Test Matrix를 관리하는 문서 허브다.

## Structure

- `prd.md`: 제품 요구사항과 성공 기준
- `glossary.md`: 공통 용어 정의
- `decisions/`: ADR 기반 결정 기록 허브
- `decisions.md`: 레거시 결정 로그 (참고용)
- `progress.md`: 단일 진행판 (자동 생성)
- `obsidian/dashboard.md`: Obsidian 뷰 래퍼 (`progress.md` 중심)
- `obsidian/weekly-review.md`: 주간 리뷰 운영 노트
- `obsidian/setup.md`: Obsidian 템플릿/Dataview 설정 가이드
- `obsidian/frontmatter-schema.md`: Obsidian YAML frontmatter 공통 스키마
- `task-governance.md`: task 분할/상세 문서 규칙
- `obsidian/linking-rules.md`: 문서 간 상호 링크 규칙
- `sdd-playbook.md`: 운영 요약 + 자동화 명령
- `templates/`: 기능 문서 템플릿 (`task-detail.template.md`, `feature-bootstrap.template.md`, `weekly-review.template.md` 포함)
- `features/`: 기능별 실행 문서

## Status Workflow

1. `Draft`: 요구사항 초안
2. `Ready`: 구현 가능한 상태(모호성 없음)
3. `In Progress`: 구현 진행 중
4. `Verifying`: 테스트/검증 중
5. `Done`: DoD 충족

## Status Transition Guardrails

- `Draft -> Ready`: `spec.md`의 `[NEEDS CLARIFICATION]` 해소, placeholder 제거, 핵심 문서(`spec/plan/tasks/test-matrix`) 작성 완료
- `Ready -> In Progress`: 실행 가능한 task 목록과 `Required Test Command`가 확정된 상태
- `In Progress -> Verifying`: `tasks.md`의 모든 task가 `Done`이고 모든 AC가 `test-matrix.md`에 매핑된 상태
- `Verifying -> Done`: `npm run specs:check`, `npm run specs:validate` 통과, 진행판에 `Blocked/Clarification` 없음
- 상태 전환은 항상 `npm run specs:feature:status -- --feature-id F-xxx --status "<Status>"` 명령으로 수행

## Command-First Operations

- Task 완료 처리: `npm run specs:task:done -- --feature-id F-xxx --task-id T-xxx`
- Feature 상태 전환: `npm run specs:feature:status -- --feature-id F-xxx --status "<Status>"`
- 상태/작업 갱신 직후 `npm run specs:check` 실행
- 문서 변경이 있으면 `npm run specs:validate`까지 실행

## Progress (Single Source)

- 생성 파일: `docs/specs/progress.md`
- 갱신 명령: `npm run specs:progress`
- 확인 명령: `npm run specs:status`
- 권장 원클릭 명령: `npm run specs:check` (갱신 + 출력)
- 원칙: 진행상황 표는 `progress.md`만 신뢰하고, 다른 문서는 해당 파일을 링크/임베드만 한다.

## Operating Rules

1. 모든 기능은 `features/F-xxx-.../` 폴더를 먼저 만든다.
2. `spec.md`에 `[NEEDS CLARIFICATION]`이 남아 있으면 구현 시작하지 않는다.
3. `spec/plan/tasks/test-matrix/task-detail` 문서는 `obsidian/frontmatter-schema.md`를 따른다.
4. `tasks.md`의 각 작업은 최소 1개의 PRD 요구사항 ID를 가진다.
5. `tasks.md`의 각 작업은 테스트 명령(또는 근거 있는 N/A)을 가진다.
6. task 상세 문서(`tasks/T-xxx.md`) 분할 기준은 `task-governance.md`를 따른다.
7. 문서 상호 링크는 `obsidian/linking-rules.md`를 따른다.
8. `test-matrix.md`에서 모든 Acceptance Criteria가 테스트에 매핑되어야 `Done`이다.
9. 완료 전 `npm run specs:check`, `npm run specs:validate`를 실행한다.
10. 비문서 변경이면 최소 `npm run verify`를 통과한다.
11. 라우트/API/설정 변경은 `npm run build`까지 통과한다.
12. 상태값을 수동 편집으로 바꾸지 말고 `specs:feature:status`를 사용한다.
13. task 상태를 수동 편집으로 바꾸지 말고 `specs:task:done`을 사용한다.

## Automation Commands

- Bootstrap: `npm run specs:new -- --feature-id F-003 --slug project-archive --title "Project Archive" --prd "FR-005,NFR-003"`
- Build progress: `npm run specs:progress`
- Show progress: `npm run specs:status`
- Refresh + show: `npm run specs:check`
- Validate: `npm run specs:validate`
- Full gate: `npm run specs:check && npm run specs:validate && npm run verify`
