---
doc_type: "test-matrix"
title: "Project List UI States"
feature_id: "F-006"
status: "Done"
owner: "unassigned"
linked_prd_ids:
  - "FR-001"
  - "FR-002"
  - "FR-005"
  - "NFR-001"
  - "NFR-002"
last_updated: "2026-02-10"
---

# Test Matrix: Project List UI States

## Related Docs

- [[spec]]
- [[plan]]
- [[tasks]]

## Requirement to Test Mapping

| PRD ID | AC ID | Test Type | Test Command | Test Location | Status |
| --- | --- | --- | --- | --- | --- |
| FR-002 | AC-001 | Unit | `npm run test:unit` | `src/components/projects/ProjectsList.test.tsx` | Done |
| FR-002 | AC-002 | Unit | `npm run test:unit` | `src/components/projects/ProjectsList.test.tsx` | Done |
| NFR-001 | AC-003 | Unit/Storybook | `npm run test:unit && npm run test:storybook` | `src/components/projects/ProjectsListSkeleton.tsx` | Done |
| FR-005 | AC-004 | E2E | `npm run test:e2e` | `e2e/home.spec.ts` | Done |
| NFR-002 | AC-001, AC-002, AC-003, AC-004 | Verify Gate | `npm run verify` | `package.json#scripts.verify` | Done |
| NFR-002 | AC-001, AC-002, AC-003, AC-004 | Build Gate | `npm run build` | N/A | Done |

## Coverage Check

- [x] 모든 AC가 최소 1개 테스트에 매핑됐다.
- [x] 필수 게이트(`verify`)가 포함됐다.
- [x] 라우트 영향으로 `build`가 포함됐다.
