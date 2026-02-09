# Changelog: F-003 Spec Automation Workflow

## 2026-02-09

- Feature folder initialized via bootstrap script
- Replaced template placeholders in `spec/plan/tasks/test-matrix` with actionable content
- Removed `Blocked` task state and cleared `[NEEDS CLARIFICATION]` marker
- Fixed PRD traceability mismatch (`NFR-001` -> `NFR-003`) in F-003 docs
- Completed T-002/T-003 and finalized feature status to `Done`
- Passed gates: `npm run specs:check`, `npm run specs:validate`, `npm run verify`
