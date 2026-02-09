---
doc_type: "tasks"
title: "Project Data Access Contract"
feature_id: "F-005"
status: "Ready"
owner: "unassigned"
linked_prd_ids:
  - "FR-003"
  - "FR-004"
  - "FR-005"
  - "NFR-002"
last_updated: "2026-02-09"
---

# Tasks: Project Data Access Contract

## Related Docs

- [[spec]]
- [[plan]]
- [[test-matrix]]

## Task List

| ID | Task | PRD IDs | Output | Required Test Command | Detail | Status |
| --- | --- | --- | --- | --- | --- | --- |
| T-001 | 조회 함수 계약(존재/미존재/기본값) 단위 테스트 추가 | FR-003, FR-004 | `projects.ts` 계약 테스트 케이스 | `npm run test:unit` | `-` | Todo |
| T-002 | delay 옵션 동작 검증 및 문서 정합화 | FR-004, NFR-002 | `delayMs` 경계 테스트 + spec 반영 | `npm run test:unit` | `-` | Todo |
| T-003 | AC-테스트 매핑 완료 및 스펙 검증 게이트 통과 | FR-005, NFR-002 | 매핑 누락 0건 + 검증 통과 | `npm run specs:check && npm run specs:validate` | `-` | Todo |

## Notes

- 각 task는 최소 1개 PRD ID를 가져야 한다.
- 각 task는 테스트 명령 또는 `N/A (reason)`를 명시해야 한다.
- 상세 task 문서 사용 기준은 `docs/specs/task-governance.md`를 따른다.
- `Status`는 `Todo`, `In Progress`, `Blocked`, `Done`만 사용한다.
