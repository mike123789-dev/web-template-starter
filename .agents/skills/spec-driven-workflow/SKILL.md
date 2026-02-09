---
name: spec-driven-workflow
description: Maintain PRD-linked spec-driven documentation for this repository. Use when adding or changing product behavior, preparing implementation plans, splitting work into tasks, tracking feature progress, or mapping acceptance criteria to required tests under docs/specs.
---

# Spec Driven Workflow

## Goal

Keep `docs/specs` as a single source for requirements, implementation intent, progress, and test traceability.

## Workflow

1. Confirm requirement source
- Read `docs/specs/prd.md` and identify requirement IDs (`FR-*`, `NFR-*`).

2. Select feature scope
- Create or update `docs/specs/features/F-xxx-<slug>/`.
- Set status using fixed flow: `Draft -> Ready -> In Progress -> Verifying -> Done`.

3. Update core feature docs
- `spec.md`: problem, scenarios, scope, acceptance criteria, edge cases.
- `plan.md`: technical approach, touched files, risks, validation strategy.
- `tasks.md`: executable tasks with `PRD IDs` and `Required Test Command`.
- `test-matrix.md`: map each AC to at least one test command/location.

4. Update progress
- Reflect feature status and progress ratio in `docs/specs/README.md`.
- Keep feature-local `README.md` metadata aligned with task completion.

5. Gate completion
- Do not mark `Done` until all are true:
- all tasks are complete,
- every AC is mapped in `test-matrix.md`,
- required commands passed (`npm run verify`, and `npm run build` for route/api/config impact).

## Required Guardrails

- Never start implementation for a feature that still has `[NEEDS CLARIFICATION]`.
- Never add tasks without PRD IDs.
- Never close a feature with unmapped acceptance criteria.

## References

- Use `references/checklist.md` as a quick pre-implementation/pre-merge checklist.
