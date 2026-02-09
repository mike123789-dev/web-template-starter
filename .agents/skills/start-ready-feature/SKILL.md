---
name: start-ready-feature
description: Use when the user asks to start a Ready feature, pick the next feature to begin, or move a feature into In Progress state.
metadata:
  short-description: Start a Ready feature safely
---

# Start Ready Feature

## Goal

Move a `Ready` feature to `In Progress` safely using project commands.

## When To Use

- "ready인 거 시작해줘"
- "다음 feature 시작하자"
- "Ready에서 In Progress로 바꿔줘"

## Workflow

1. Run `npm run specs:check` to refresh progress and status output.
2. Identify features with status `Ready`.
3. If no `Ready` feature exists, report and stop.
4. If only one exists, select it.
5. If multiple exist:
   - if user already specified `feature-id`, use it
   - otherwise ask user to choose `feature-id`
6. Run:
   - `npm run specs:feature:status -- --feature-id <F-xxx> --status "In Progress"`
7. Run `npm run specs:status` and confirm the transition is reflected.
8. Recommend the next immediate task from the selected feature.

## Guardrails

- Never pick arbitrarily when multiple `Ready` features exist.
- Never mark `Done` or `Verifying` from this flow.
- Never manually edit status in markdown when status command exists.
- If status command fails, report the error and stop.

## Output Format

1. Selected feature and selection reason
2. Commands executed and results
3. Status transition confirmation
4. Next immediate task recommendation

## References

- `docs/specs/progress.md`
- `docs/specs/features/F-xxx-*/README.md`
- `.agents/skills/spec-driven-workflow/references/commands.md`
