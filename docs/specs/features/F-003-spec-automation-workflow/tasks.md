---
doc_type: "tasks"
title: "Spec Automation Workflow"
feature_id: "F-003"
status: "In Progress"
linked_prd_ids:
  - "FR-001"
  - "FR-002"
  - "FR-005"
  - "NFR-003"
last_updated: "2026-02-09"
---

# Tasks: Spec Automation Workflow

## Related Docs

- [[spec]]
- [[plan]]
- [[test-matrix]]

## Task List

| ID | Task | PRD IDs | Output | Required Test Command | Detail | Status |
| --- | --- | --- | --- | --- | --- | --- |
| T-001 | F-003 핵심 문서의 placeholder 제거 및 목적 정합화 | FR-001, FR-002 | 실행 가능한 스펙 문서 4종 | `npm run specs:validate` | `-` | Done |
| T-002 | task 상세 문서(T-002)를 task-governance 기준으로 구체화 | FR-002, NFR-003 | 상세 task 실행 기준 문서 | `npm run specs:check` | `tasks/T-002.md` | In Progress |
| T-003 | AC-테스트 매핑 및 진행판 상태(`Blocked/Clarification`) 정상화 | FR-005, NFR-003 | 매핑 누락 0건, blocked 0건 | `npm run specs:check` | `-` | Todo |

## Notes

- 상세 task 문서 사용 기준은 `docs/specs/task-governance.md`를 따른다.
