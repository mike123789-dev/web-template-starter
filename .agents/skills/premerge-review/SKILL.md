---
name: premerge-review
description: Use when the user asks for final merge readiness review focusing on regression risk, missing tests, and blockers.
metadata:
  short-description: Final pre-merge risk and blocker review
---

# Pre-merge Review

## Goal

Produce a merge-readiness review with explicit risks, missing tests, and blockers.

## When To Use

- "머지 전에 최종 리뷰해줘"
- "pre-merge 체크해줘"
- "리스크/누락 테스트/블로커 정리해줘"

## Workflow

1. Review changed files and behavior impact.
2. Classify change type using `docs/agent/dod.md`.
3. Verify required gate evidence:
   - docs-only: no mandatory code gate
   - agent docs/prompt governance: `npm run prompt:guard` (+ `prompt:quality` or `prompt:all` when required)
   - code changes: `npm run verify`
   - `src/app/**` or `src/app/api/**` impact: `npm run test:e2e`
   - route/api/config impact: `npm run build` additional gate
4. Check browser verification trigger for UI high-risk changes (see `docs/engineering/testing.md`).
5. If no blocker and all tasks are `Done`, sync feature docs status with:
   - `npm run specs:feature:status -- --feature-id <F-xxx> --status "Done"`
6. Prioritize findings by severity and report with the required template.

## Blocker Criteria

Treat these as blockers by default:

- required gate not executed or failed
- reproducible regression in primary user flow
- unresolved data-loss/security risk
- status mismatch between spec docs and actual task completion

## Required Template

### Pre-merge Review

- Risks:
  - [High|Medium|Low] <risk summary> (file: <path>)
- Missing Tests:
  - <missing test or evidence gap> (recommended command: <command>)
- Blockers:
  - <merge blocker> (owner: <role>, action: <next step>)

If there is no blocker:

- Blockers:
  - none

## Review Rules

- Do not assume a gate passed without explicit evidence.
- Put concrete file references in every risk item.
- Prefer actionable missing-test commands over generic advice.

## References

- `docs/agent/runbook.md`
- `docs/agent/dod.md`
- `docs/engineering/testing.md`
