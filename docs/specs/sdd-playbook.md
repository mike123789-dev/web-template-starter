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

## UI Change Default Gate

- UI 변경(컴포넌트/상호작용/화면 상태)이 포함되면 기본 게이트를 아래 조합으로 고정한다.
- `npm run verify`
- `npm run test:e2e`
- `npm run build`
- `npm run premerge:check:evidence`
- 최종 리뷰 공유 시 Browser Evidence 경로와 이미지를 함께 포함한다.

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
- 반복 전환 중간 단계는 fast 명령 사용:
- `npm run specs:task:done:fast -- --feature-id F-xxx --task-id T-xxx`
- `npm run specs:feature:status:fast -- --feature-id F-xxx --status "<Status>"`
- 마지막 단계에서만 `npm run specs:check` + `npm run specs:validate`를 실행한다.

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

### UI pre-merge (report + evidence + PR template injection)

```bash
npm run premerge:check:evidence:pr -- --feature-id F-xxx
```
