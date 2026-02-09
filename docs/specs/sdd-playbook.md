# SDD Playbook

이 문서는 현재 저장소의 Spec-Driven Development 운영 기준을 한 번에 보는 요약 문서다.

## Source of Truth

- Product requirement: `docs/specs/prd.md`
- Progress board: `docs/specs/progress.md`
- Metadata schema: `docs/specs/obsidian/frontmatter-schema.md`
- Task split rule: `docs/specs/task-governance.md`
- Link rule: `docs/specs/obsidian/linking-rules.md`

## Required Feature Docs

각 feature 폴더(`docs/specs/features/F-xxx-<slug>/`)는 다음 문서를 가진다.

- `spec.md`
- `plan.md`
- `tasks.md`
- `test-matrix.md`

선택:

- `tasks/T-xxx.md` (task-governance 기준으로 필요 시)
- `changelog.md`

## Standard Flow

1. `npm run specs:new -- ...`로 feature 문서 스캐폴딩 생성
2. `spec/plan/tasks/test-matrix`를 요구사항 기준으로 채움
3. `tasks/T-xxx.md` 필요 여부를 `task-governance`로 판단
4. 문서 상태를 `Draft -> Ready -> In Progress -> Verifying -> Done`으로 관리
5. `npm run specs:check`로 단일 진행판(`progress.md`) 갱신 + 즉시 확인
6. 완료 전 `npm run specs:validate`, `npm run verify` 실행
7. 라우트/API/설정 영향이 있으면 `npm run build`까지 실행

## Status Transition Checklist

1. `Ready` 전환 전:
- `[NEEDS CLARIFICATION]` 없음
- placeholder(`<...>`) 없음
- `spec/plan/tasks/test-matrix` 작성 완료
2. `In Progress` 전환 전:
- task마다 `PRD IDs`와 `Required Test Command`가 정의됨
3. `Verifying` 전환 전:
- `tasks.md`의 모든 task가 `Done`
- 모든 AC가 `test-matrix.md`에 매핑됨
4. `Done` 전환 전:
- `npm run specs:check` 통과
- `npm run specs:validate` 통과
- 진행판(`progress.md`)에서 `Blocked/Clarification` 없음

## Command-Based Status Operations

- Task 완료: `npm run specs:task:done -- --feature-id F-xxx --task-id T-xxx`
- Feature 상태 전환: `npm run specs:feature:status -- --feature-id F-xxx --status "<Status>"`
- 상태 변경 직후 `npm run specs:check`를 실행한다.
- 문서 변경이 포함되면 `npm run specs:validate`를 실행한다.

## Why test-matrix

- 요구사항(`AC`)이 어떤 테스트로 증명되는지 추적하기 위한 문서다.
- 기능 변경 시 테스트 누락을 막는 품질 계약서 역할을 한다.

## Automation Commands

### Bootstrap

```bash
npm run specs:new -- \
  --feature-id F-003 \
  --slug project-archive \
  --title "Project Archive" \
  --prd "FR-005,NFR-003"
```

### Build progress board

```bash
npm run specs:progress
```

### Show current progress board

```bash
npm run specs:status
```

### Refresh + show in one command

```bash
npm run specs:check
```

### Validate

```bash
npm run specs:validate
```
