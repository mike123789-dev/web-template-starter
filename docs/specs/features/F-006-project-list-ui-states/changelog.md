# Changelog: F-006 Project List UI States

## 2026-02-10

- Feature folder initialized via bootstrap script
- Replaced scaffold placeholders with UI-state focused scope, AC, tasks, and test mappings
- Implemented list-state UI updates: filter-aware empty state, inline error state, and filter reset action
- Added accessibility attributes to list skeleton (`aria-busy`, loading text)
- Added unit tests for `ProjectsList` and `ProjectsListSkeleton`, and updated E2E scenario for reset-filters flow
