---
doc_type: "test-matrix"
title: "Spec Status Workflow Guardrails"
feature_id: "F-004"
status: "Done"
owner: "unassigned"
linked_prd_ids:
  - "FR-006"
  - "NFR-001"
last_updated: "2026-02-09"
---

# Test Matrix: Spec Status Workflow Guardrails

## Related Docs

- [[spec]]
- [[plan]]
- [[tasks]]

## Requirement to Test Mapping

| PRD ID | AC ID | Test Type | Test Command | Test Location | Status |
| --- | --- | --- | --- | --- | --- |
| FR-006 | AC-001 | Docs | `npm run specs:check` | `docs/specs/README.md` | Done |
| FR-006 | AC-002 | Docs | `npm run specs:validate` | `docs/specs/task-governance.md` | Done |
| NFR-001 | AC-003 | Docs | `npm run specs:check` | `docs/specs/progress.md` | Done |

## Coverage Check

- [x] 모든 AC가 최소 1개 테스트에 매핑됐다.
- [x] 필수 게이트(`specs:check`, `specs:validate`)가 포함됐다.
- [x] 변경 영향은 문서만 포함되어 `npm run build`는 `N/A`다.
