# Spec Sync

You are syncing spec documents for this repository.

## Goal

Keep feature docs consistent across:

- `docs/specs/features/F-xxx-*/spec.md`
- `docs/specs/features/F-xxx-*/plan.md`
- `docs/specs/features/F-xxx-*/tasks.md`
- `docs/specs/features/F-xxx-*/test-matrix.md`

## Required Actions

1. Identify the target feature folder from current context.
2. Check PRD ID traceability and AC-to-test mapping.
3. Update only required spec docs with minimal edits.
4. Run:
   - `npm run specs:check`
   - `npm run specs:validate`
5. Report:
   - changed files
   - command results
   - unresolved gaps

## Constraints

- Do not edit code files unless explicitly requested.
- Do not mark feature as `Done` if validation fails.
