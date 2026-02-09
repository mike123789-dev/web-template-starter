---
name: spec-progress
description: Use when the user asks for current spec progress, status snapshot, blocked tasks, or what to start next from Ready features.
metadata:
  short-description: Check spec progress and next Ready feature
---

# Spec Progress

## Goal

Provide a reliable status snapshot for `docs/specs` and recommend the next action.

## When To Use

- "스펙 진행상황 보여줘"
- "지금 뭐가 Ready인지 알려줘"
- "다음에 뭘 시작하면 돼?"

## Workflow

1. Run `npm run specs:check`.
2. Use `docs/specs/progress.md` as the single source of truth.
3. Summarize:
   - feature status (`Draft`, `Ready`, `In Progress`, `Verifying`, `Done`)
   - progress (`done/total`)
   - blocked tasks
   - `[NEEDS CLARIFICATION]` items
4. If `Ready` features exist, recommend one to start next using this priority:
   - higher progress ratio first
   - no blocked tasks
   - no clarification needed

## Guardrails

- Never infer status from stale output; always run `specs:check` first.
- Never invent task counts or IDs that are not present in `progress.md`.
- If no feature is `Ready`, explicitly say so and suggest the current `In Progress` focus.

## Output Format

1. Progress snapshot
2. Ready features
3. Blockers and clarification
4. Recommended next action

## References

- `docs/specs/progress.md`
- `docs/specs/README.md`
- `.agents/skills/spec-driven-workflow/references/commands.md`
