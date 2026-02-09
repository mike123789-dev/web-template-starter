---
doc_type: test-matrix
title: Project Create Flow
feature_id: F-001
status: Ready
linked_prd_ids:
  - FR-001
  - FR-002
  - NFR-001
last_updated: 2026-02-09
---

# Test Matrix: Project Create Flow

## Related Docs

- [[spec]]
- [[plan]]
- [[tasks]]

## Requirement to Test Mapping

| PRD ID | AC ID | Test Type | Test Command | Test Location | Status |
| --- | --- | --- | --- | --- | --- |
| FR-002 | AC-001 | Unit | `npm run test:unit` | `src/**/*.test.ts*` | Planned |
| FR-002 | AC-002 | E2E | `npm run test:e2e` | `e2e/home.spec.ts` | Planned |
| FR-002 | AC-003 | API/Build Gate | `npm run verify` | `src/app/api/projects/route.ts` | Planned |
| NFR-001 | AC-001, AC-002, AC-003 | Build | `npm run build` | N/A | Planned |

## Coverage Check

- [x] 모든 AC가 최소 1개 테스트에 매핑됐다.
- [x] 필수 게이트(`verify`)가 포함됐다.
- [x] 라우트/API 영향으로 `build`가 포함됐다.
