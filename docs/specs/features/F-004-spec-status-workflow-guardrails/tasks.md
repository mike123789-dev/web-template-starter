---
doc_type: "tasks"
title: "Spec Status Workflow Guardrails"
feature_id: "F-004"
status: "Done"
owner: "unassigned"
linked_prd_ids:
  - "FR-006"
  - "NFR-001"
last_updated: "2026-02-09"
---

# Tasks: Spec Status Workflow Guardrails

## Related Docs

- [[spec]]
- [[plan]]
- [[test-matrix]]

## Task List

| ID | Task | PRD IDs | Output | Required Test Command | Detail | Status |
| --- | --- | --- | --- | --- | --- | --- |
| T-001 | 상태 전이 규칙 및 선행 조건 정의 | FR-006 | 상태별 체크리스트 문서화 | `npm run specs:check` | `-` | Done |
| T-002 | 명령 기반 상태 전환/작업 완료 규칙 명문화 | FR-006, NFR-001 | 작업/상태 전환 운영 규칙 | `npm run specs:validate` | `-` | Done |
| T-003 | 진행판 점검/검증 루틴 정리 | NFR-001 | 완료 게이트 기준 정리 | `npm run specs:check` | `-` | Done |

## Notes

- 각 task는 최소 1개 PRD ID를 가져야 한다.
- 각 task는 테스트 명령 또는 `N/A (reason)`를 명시해야 한다.
- 상세 task 문서 사용 기준은 `docs/specs/task-governance.md`를 따른다.
- `Status`는 `Todo`, `In Progress`, `Blocked`, `Done`만 사용한다.
