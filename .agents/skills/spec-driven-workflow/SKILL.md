---
name: spec-driven-workflow
description: Maintain PRD-linked spec-driven documentation for this repository. Use when adding or changing product behavior, creating feature specs/plans/tasks, deciding whether task detail files are required, tracking progress, or mapping acceptance criteria to tests under docs/specs.
---

# Spec Driven Workflow

## Goal

Keep `docs/specs` as a single source for requirements, implementation intent, progress, and test traceability.

## Automation

- Bootstrap feature docs from templates:
- `npm run specs:new -- --feature-id F-003 --slug project-archive --title "Project Archive" --prd "FR-005,NFR-003"`
- Validate SDD rules:
- `npm run specs:validate`

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
- Reflect feature status and progress ratio in `docs/specs/README.md`.
- Keep feature-local `README.md` metadata aligned with task completion.
- Check `docs/specs/obsidian/dashboard.md` to verify Draft/Blocked/clarification visibility.

6. Gate completion
- Do not mark `Done` until all are true:
- all tasks are complete,
- each task marked `Done` satisfies task-level done criteria from `task-governance.md`,
- every AC is mapped in `test-matrix.md`,
- required commands passed (`npm run specs:validate`, `npm run verify`, and `npm run build` for route/api/config impact).

## Required Guardrails

- Never start implementation for a feature that still has `[NEEDS CLARIFICATION]`.
- Never add tasks without PRD IDs and a required test command (or explicit `N/A (reason)`).
- Never leave `tasks.md` and `tasks/T-xxx.md` out of sync.
- Never close a feature with unmapped acceptance criteria.

## References

- Use `references/checklist.md` as a quick pre-implementation/pre-merge checklist.
- Use `references/commands.md` for script usage and flags.
- Use `docs/specs/obsidian/frontmatter-schema.md` as the source of truth for metadata keys.
- Use `docs/specs/task-governance.md` for task split criteria and status rules.
- Use `docs/specs/obsidian/linking-rules.md` for graph-friendly cross-links.
