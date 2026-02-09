---
doc_type: "tasks"
title: "Project Filter/Sort"
feature_id: "F-002"
status: "Draft"
linked_prd_ids:
  - "FR-003"
  - "FR-004"
  - "NFR-002"
last_updated: "2026-02-09"
---

# Tasks: Project Filter/Sort

## Related Docs

- [[spec]]
- [[plan]]
- [[test-matrix]]

## Task List

| ID | Task | PRD IDs | Output | Required Test Command | Detail | Status |
| --- | --- | --- | --- | --- | --- | --- |
| T-001 | 기본 정렬 규칙 확정 | FR-004 | spec open question 해소 | N/A (product decision) | `tasks/T-001.md` | Todo |
| T-002 | 필터/정렬 규칙 spec 반영 | FR-003, FR-004 | spec/plan 갱신 | `npm run verify` | `-` | Todo |
| T-003 | 필터/정렬 로직 구현 | FR-003, FR-004 | 목록 결과 일관화 | `npm run test:unit` | `-` | Todo |
| T-004 | 쿼리 파라미터 fallback 처리 | FR-003 | invalid 값 안전 처리 | `npm run verify` | `-` | Todo |
| T-005 | 기능 완료 검증 | NFR-002 | 회귀 없음 확인 | `npm run test:e2e` | `-` | Todo |

## Notes

- 상세 task 분할 기준은 `docs/specs/task-governance.md`를 따른다.
