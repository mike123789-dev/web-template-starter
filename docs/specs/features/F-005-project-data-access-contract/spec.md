---
doc_type: "spec"
title: "Project Data Access Contract"
feature_id: "F-005"
status: "Done"
owner: "unassigned"
linked_prd_ids:
  - "FR-003"
  - "FR-004"
  - "FR-005"
  - "NFR-002"
last_updated: "2026-02-10"
---

# Spec: Project Data Access Contract

## Related Docs

- [[plan]]
- [[tasks]]
- [[test-matrix]]

## Problem

`src/lib/projects.ts`의 조회 함수 동작(지연 옵션, 미존재 ID 처리, 기본값)이 문서로 고정되어 있지 않으면 UI/API 레이어에서 서로 다른 가정을 사용하게 된다.

## User Scenarios

1. Given 프로젝트 상세 화면에서 `getProjectById`를 호출할 때, when ID가 존재하지 않으면, then `null`을 받아 404/empty 처리 분기를 안정적으로 수행한다.
2. Given 활동 피드에서 `getProjectActivity`를 호출할 때, when 활동 데이터가 없는 프로젝트면, then 빈 배열(`[]`)을 받아 렌더링 오류 없이 동작한다.

## In Scope

- `getProjects`, `getProjectById`, `getProjectActivity`의 반환 계약 명시
- `delayMs` 옵션의 동작 규칙(0 이하/양수)
- `getProjectStatusLabel`의 상태 라벨 매핑 규칙

## Out of Scope

- DB 영속 계층 도입
- 쓰기 연산(create/update/delete) API 추가

## Acceptance Criteria

- `AC-001`: `getProjectById(id)`는 ID 미존재 시 `null`을 반환한다.
- `AC-002`: `getProjectActivity(id)`는 활동 데이터가 없을 때 `[]`를 반환한다.
- `AC-003`: `delayMs > 0`일 때만 지연을 적용하고, 기본 호출은 즉시 반환된다.
- `AC-004`: `getProjectStatusLabel`은 `active/paused/archived`를 각각 `Active/Paused/Archived`로 매핑한다.

## Edge/Failure Cases

- `delayMs`가 `0` 또는 음수일 때 sleep을 수행하지 않아야 한다.
- 활동 맵에 없는 project id여도 예외 없이 빈 배열을 반환해야 한다.

## Observability

- 단위 테스트에서 반환값/호출 시간 경계(`delayMs`)를 검증한다.
- `npm run test:unit` 통과 여부로 계약 회귀를 확인한다.

## Open Questions

- None
