# Commands

## 1) Bootstrap new feature docs

```bash
npm run specs:new -- \
  --feature-id F-003 \
  --slug project-archive \
  --title "Project Archive" \
  --prd "FR-005,NFR-003" \
  --owner "unassigned" \
  --status "Draft"
```

Useful options:

- `--dry-run`: preview only
- `--force`: overwrite existing feature folder

## 2) Build single progress board

```bash
npm run specs:progress
```

Output:

- `docs/specs/progress.md` (single source for feature status, blocked tasks, clarification)

## 3) Show current progress board

```bash
npm run specs:status
```

## 4) Refresh + show in one command

```bash
npm run specs:check
```

## 5) Validate SDD docs

```bash
npm run specs:validate
```

Validation checks:

- required docs per feature
- frontmatter required keys and enums
- task detail link consistency
- required cross-links (`Related Docs`)
- status vs `[NEEDS CLARIFICATION]` consistency
- PRD ID format/existence checks against `docs/specs/prd.md`
- unresolved template placeholders (`<...>`) detection

## 6) Mark task done (agent-safe)

```bash
npm run specs:task:done -- --feature-id F-003 --task-id T-002
```

Fast mode (skip repeated checks during middle steps):

```bash
npm run specs:task:done:fast -- --feature-id F-003 --task-id T-002
```

Behavior:

- marks target row in `tasks.md` as `Done`
- syncs `tasks/T-xxx.md` status when present
- refreshes progress board (`specs:check`)
- runs validation gate (`specs:validate`)

## 7) Update feature status (agent-safe)

```bash
npm run specs:feature:status -- --feature-id F-003 --status Verifying
```

Fast mode (skip repeated checks during middle steps):

```bash
npm run specs:feature:status:fast -- --feature-id F-003 --status "In Progress"
```

Behavior:

- syncs status for `spec.md`, `plan.md`, `tasks.md`, `test-matrix.md`, and feature `README.md`
- blocks `Verifying/Done` when any task is not `Done`
- blocks non-`Draft` status if Open Questions contains `[NEEDS CLARIFICATION]`
- refreshes progress board and validates docs

Recommended operation pattern:

- middle loop: use `*:fast` commands
- final gate: run `npm run specs:check && npm run specs:validate`
