---
doc_type: "test-matrix"
title: "Project List UI States"
feature_id: "F-006"
status: "Draft"
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
| FR-001 | AC-001 | Unit | `npm run test:unit` | `src/**/**.test.ts` | Planned |
| FR-001 | AC-002 | Storybook | `npm run test:storybook` | `src/**/**.stories.tsx` | Planned |
| NFR-001 | AC-003 | Build | `npm run build` | N/A | Planned |

## Coverage Check

- [ ] 모든 AC가 최소 1개 테스트에 매핑됐다.
- [ ] 필수 게이트(`verify`)가 포함됐다.
- [ ] 변경 영향이 라우트/API면 `build`가 포함됐다.
