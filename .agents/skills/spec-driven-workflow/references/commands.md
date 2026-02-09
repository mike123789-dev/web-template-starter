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
