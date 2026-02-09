---
doc_type: "tasks"
title: "<Feature Title>"
feature_id: "F-xxx"
status: "Draft"
linked_prd_ids:
  - "FR-xxx"
  - "NFR-xxx"
last_updated: "YYYY-MM-DD"
---

# Tasks: <Feature Title>

## Task List

| ID | Task | PRD IDs | Output | Required Test Command | Detail | Status |
| --- | --- | --- | --- | --- | --- | --- |
| T-001 | <작업 내용> | FR-xxx | <산출물> | `npm run verify` | `-` | Todo |
| T-002 | <작업 내용> | FR-xxx | <산출물> | `npm run test:e2e` | `tasks/T-002.md` | In Progress |
| T-003 | <작업 내용> | NFR-xxx | <산출물> | `npm run build` | `-` | Blocked |

## Notes

- 각 task는 최소 1개 PRD ID를 가져야 한다.
- 각 task는 테스트 명령 또는 `N/A (reason)`를 명시해야 한다.
- 상세 task 문서 사용 기준은 `docs/specs/task-governance.md`를 따른다.
- `Status`는 `Todo`, `In Progress`, `Blocked`, `Done`만 사용한다.
