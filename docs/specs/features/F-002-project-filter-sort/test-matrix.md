---
doc_type: "test-matrix"
title: "Project Filter/Sort"
feature_id: "F-002"
status: "Done"
linked_prd_ids:
  - "FR-003"
  - "FR-004"
  - "NFR-002"
last_updated: "2026-02-09"
---

# Test Matrix: Project Filter/Sort

## Related Docs

- [[spec]]
- [[plan]]
- [[tasks]]

## Requirement to Test Mapping

| PRD ID | AC ID | Test Type | Test Command | Test Location | Status |
| --- | --- | --- | --- | --- | --- |
| FR-003 | AC-001 | Unit | `npm run test:unit` | `src/lib/projects-filter-sort.test.ts` | Done |
| FR-004 | AC-002 | Unit | `npm run test:unit` | `src/lib/projects-filter-sort.test.ts` | Done |
| FR-003 | AC-003 | E2E | `npm run test:e2e` | `e2e/home.spec.ts` | Done |
| FR-004 | AC-004 | Unit/Integration | `npm run verify` | `src/lib/projects-filter-sort.ts`, `src/components/projects/ProjectsList.tsx`, `src/components/projects/ProjectsFilters.tsx` | Done |
| FR-004 | AC-005 | Unit | `npm run test:unit` | `src/lib/projects-filter-sort.test.ts` | Done |
| NFR-002 | AC-001, AC-002, AC-003, AC-004, AC-005 | Build | `npm run build` | N/A | Planned |

## Coverage Check

- [x] 모든 AC가 최소 1개 테스트에 매핑됐다.
- [x] 필수 게이트(`verify`)가 포함됐다.
- [x] 라우트 영향으로 `build`가 포함됐다.
