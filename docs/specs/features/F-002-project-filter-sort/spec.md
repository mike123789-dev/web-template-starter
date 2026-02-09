---
doc_type: "spec"
title: "Project Filter/Sort"
feature_id: "F-002"
status: "Done"
owner: "unassigned"
linked_prd_ids:
  - "FR-003"
  - "FR-004"
  - "NFR-002"
last_updated: "2026-02-09"
---

# Spec: Project Filter/Sort

## Related Docs

- [[plan]]
- [[tasks]]
- [[test-matrix]]

## Problem

프로젝트 목록에서 상태 필터와 정렬 방식이 모호하면 사용자와 에이전트 모두 결과를 신뢰하기 어렵다.

## User Scenarios

1. Given 목록 페이지에서 상태 필터를 선택했을 때, when 필터 조건이 적용되면, then 해당 상태의 프로젝트만 보여야 한다.
2. Given 정렬 옵션을 선택했을 때, when 목록이 갱신되면, then 정의된 순서 규칙으로 일관되게 정렬되어야 한다.

## In Scope

- 상태 필터(`active`, `paused`, `archived`)
- 정렬 옵션 처리
- 필터/정렬 쿼리 파라미터 반영
- 적용 순서 고정: **필터 후 정렬**

## Out of Scope

- 서버 영속 저장
- 복합 검색(키워드, 다중 필터)

## Acceptance Criteria

- `AC-001`: 상태 필터 값이 유효하면 해당 상태 프로젝트만 노출한다.
- `AC-002`: 정렬 선택 시 동일 데이터에 대해 항상 동일 순서 결과를 만든다.
- `AC-003`: 유효하지 않은 필터/정렬 값은 기본값으로 안전하게 처리한다.
- `AC-004`: 기본 정렬은 `updatedAt desc`이며, `sort` 파라미터가 없거나 유효하지 않을 때 적용된다.
- `AC-005`: 동일 입력에 대해 필터/정렬 결과 순서는 항상 결정적(deterministic)이어야 한다.

## Edge/Failure Cases

- 지원하지 않는 query param 값
- 데이터가 비어 있을 때 필터/정렬 동작

## Open Questions

- None (기본 정렬: `updatedAt desc`, query fallback: `sort=updated`)
