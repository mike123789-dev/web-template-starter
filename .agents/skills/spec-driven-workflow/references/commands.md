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

## 2) Validate SDD docs

```bash
npm run specs:validate
```

Validation checks:

- required docs per feature
- frontmatter required keys and enums
- task detail link consistency
- required cross-links (`Related Docs`)
- status vs `[NEEDS CLARIFICATION]` consistency
