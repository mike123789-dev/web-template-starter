---
name: spec-driven-workflow
description: Use this skill when requests match "현재 상태 알려줘", "스펙 만들어", or "스펙 마무리해". It runs the PRD-linked docs/specs workflow end-to-end: scaffold feature docs, sync spec/plan/tasks/test-matrix, update task/feature status via commands, regenerate progress, and validate AC-to-test traceability before Done.
---

# Spec Driven Workflow

## Goal

Keep `docs/specs` as a single source for requirements, implementation intent, progress, and test traceability.

## When To Use

- 신규 feature 스펙 폴더를 만들거나 기존 스펙을 업데이트할 때
- task 진행 상태를 반영하고 `progress.md`를 최신화해야 할 때
- AC-테스트 매핑 누락/PRD ID 정합성/문서 품질을 점검할 때
- 에이전트가 문서를 직접 편집하지 않고 명령 중심으로 상태를 반영해야 할 때

## Core Commands

1. Bootstrap feature docs
- `npm run specs:new -- --feature-id F-003 --slug project-archive --title "Project Archive" --prd "FR-005,NFR-003"`

2. Progress board
- `npm run specs:progress`
- `npm run specs:status`
- `npm run specs:check`

3. Validation
- `npm run specs:validate`

4. Agent-safe status operations
- Task done: `npm run specs:task:done -- --feature-id F-003 --task-id T-002`
- Feature status sync: `npm run specs:feature:status -- --feature-id F-003 --status Verifying`
- Fast middle-loop mode:
- `npm run specs:task:done:fast -- --feature-id F-003 --task-id T-002`
- `npm run specs:feature:status:fast -- --feature-id F-003 --status "In Progress"`

## Agent Operating Contract

- 문서 상태 변경은 수동 markdown 편집보다 명령 사용을 우선한다.
- task 완료는 `specs:task:done`으로 처리한다.
- feature 상태 전환은 `specs:feature:status`로 처리한다.
- 반복 작업 중간 단계에서는 `*:fast` 명령으로 중복 `check/validate`를 줄인다.
- 상태 전환 후 반드시 `specs:check`, `specs:validate` 결과를 확인한다.
- 검증 실패 상태에서 feature를 `Done`으로 두지 않는다.

## Workflow

1. Confirm requirement source
- Read `docs/specs/prd.md` and identify requirement IDs (`FR-*`, `NFR-*`).

2. Select feature scope
- Prefer the bootstrap command for new features.
- Create or update `docs/specs/features/F-xxx-<slug>/`.
- Set status using fixed flow: `Draft -> Ready -> In Progress -> Verifying -> Done`.

3. Update core feature docs
- Use Obsidian-style YAML frontmatter at the top of each doc.
- Follow the exact key/enum rules in `docs/specs/obsidian/frontmatter-schema.md`.
- `spec.md`: problem, scenarios, scope, acceptance criteria, edge cases.
- `plan.md`: technical approach, touched files, risks, validation strategy.
- `tasks.md`: executable tasks table with `PRD IDs`, `Required Test Command`, `Detail`, `Status`.
- `test-matrix.md`: map each AC to at least one test command/location.

4. Apply task split rules
- Use `docs/specs/task-governance.md` to decide if `tasks/T-xxx.md` is required.
- If required, create `tasks/T-xxx.md` and match filename with task ID in `tasks.md`.
- Use only allowed task statuses: `Todo`, `In Progress`, `Blocked`, `Done`.

5. Update progress
- Run `npm run specs:progress` and use `docs/specs/progress.md` as the single progress source.
- For quick snapshot, run `npm run specs:check`.
- Keep feature-local `README.md` metadata aligned with task completion.
- Use `docs/specs/obsidian/dashboard.md` only as a view wrapper around `progress.md`.
- Prefer command-based updates over manual markdown edits:
- task completion: `specs:task:done`
- feature status transitions: `specs:feature:status`

6. Gate completion
- Do not mark `Done` until all are true:
- all tasks are complete,
- each task marked `Done` satisfies task-level done criteria from `task-governance.md`,
- every AC is mapped in `test-matrix.md`,
- progress board regenerated (`npm run specs:check` or `npm run specs:progress`),
- required commands passed (`npm run specs:validate`, `npm run verify`, and `npm run build` for route/api/config impact).

## Required Guardrails

- Never start implementation for a feature that still has `[NEEDS CLARIFICATION]`.
- Never add tasks without PRD IDs and a required test command (or explicit `N/A (reason)`).
- Never leave `tasks.md` and `tasks/T-xxx.md` out of sync.
- Never close a feature with unmapped acceptance criteria.
- Never bypass status commands when an automated command exists for the same action.
- Never ignore `specs:validate` failure output; fix root causes before proceeding.

## Validation Coverage (Current)

- Required docs/frontmatter/schema compliance
- `Related Docs` cross-link consistency
- `[NEEDS CLARIFICATION]` and status consistency (`Open Questions` scope)
- PRD ID format and existence check (`docs/specs/prd.md` 기준)
- Placeholder token(`<...>`) 잔존 검사
- task-detail 파일 동기화 및 상태 enum 검사

## References

- Use `references/checklist.md` as a quick pre-implementation/pre-merge checklist.
- Use `references/commands.md` for script usage and flags.
- Use `docs/specs/obsidian/frontmatter-schema.md` as the source of truth for metadata keys.
- Use `docs/specs/task-governance.md` for task split criteria and status rules.
- Use `docs/specs/obsidian/linking-rules.md` for graph-friendly cross-links.
