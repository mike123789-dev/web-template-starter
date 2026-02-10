---
doc_type: "tasks"
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

# Tasks: Project List UI States

## Related Docs

- [[spec]]
- [[plan]]
- [[test-matrix]]

## Task List

| ID | Task | PRD IDs | Output | Required Test Command | Detail | Status |
| --- | --- | --- | --- | --- | --- | --- |
| T-001 | UI 상태 요구사항/AC 확정 및 문서 동기화 | FR-002, NFR-001 | spec/plan/test-matrix 정합화 | `npm run specs:validate` | `-` | Todo |
| T-002 | 목록 로딩/오류/빈결과 상태 UI 구현 | FR-002, NFR-001 | 상태별 UI + reset filters 액션 | `npm run verify` | `tasks/T-002.md` | Todo |
| T-003 | UI 회귀 방지 테스트 추가 및 게이트 통과 | FR-005, NFR-002 | unit/e2e 케이스 및 게이트 통과 | `npm run test:e2e && npm run build` | `-` | Todo |

## Notes

- 각 task는 최소 1개 PRD ID를 가져야 한다.
- 각 task는 테스트 명령 또는 `N/A (reason)`를 명시해야 한다.
- 상세 task 문서 사용 기준은 `docs/specs/task-governance.md`를 따른다.
- `Status`는 `Todo`, `In Progress`, `Blocked`, `Done`만 사용한다.
